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

from . import app, crud
from .db import get_db
from .hashing import verify_password

config = dotenv_values("backend/.env")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


def authenticate_user(db: Session, username, password):
    user = crud.get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False

    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
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


@app.post("/api/token")
def token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    weeks = str(config["ACCESS_TOKEN_EXPIRE_WEEKS"])
    access_token_expires = timedelta(int(weeks))
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
