from fastapi import FastAPI, status
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.param_functions import Depends
from sqlalchemy.orm import Session

from . import auth, crud, game_routes, models, schemas
from .auth import auth_router
from .db import engine, get_db
from .game_routes import game_router

models.Base.metadata.create_all(bind=engine)


origins = ["http://localhost:3000", "http://192.168.8.107:3000"]
# origins = ["*"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(game_router)


@app.post("/api/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
            headers={"WWW-Authenticate": "Bearer"},
        )
    db_user = await crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already in use",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await crud.create_user(db, user=user)
