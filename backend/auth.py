from datetime import datetime, timedelta
from typing import Optional

from dotenv import dotenv_values
from fastapi import status
from fastapi.exceptions import HTTPException
from fastapi.param_functions import Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy.orm.session import Session

from . import app, crud, models
from .db import get_db
from .hashing import verify_password
from .schemas import User

config = dotenv_values("backend/.env")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token/")


async def authenticate_user(db: Session, username, password):
    user = await crud.get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False

    return user


async def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(weeks=12)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, config["SECRET_KEY"], algorithm=config["ALGORITHM"]
    )
    return encoded_jwt


async def authenticate_access_token(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        decoded = jwt.decode(
            token, config["SECRET_KEY"], algorithms=[config["ALGORITHM"]]
        )
        user = db.query(models.User).get(decoded["sub"])
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials"
        )

    return user


@app.post("/api/token/")
async def token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    weeks = str(config["ACCESS_TOKEN_EXPIRE_WEEKS"])
    access_token_expires = timedelta(int(weeks))
    access_token = await create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/me/", response_model=User)
async def get_current_user(user=Depends(authenticate_access_token)):
    return User.from_orm(user)
