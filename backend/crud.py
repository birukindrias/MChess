from random import randint

from sqlalchemy.orm import Session

from . import models, schemas
from .game import org_board_props
from .hashing import hash_password, verify_password


async def get_user(db: Session, user_id: int):
    return db.query(models.User).filter_by(id=user_id).first()


async def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter_by(email=email).first()


async def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter_by(username=username).first()


async def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


async def create_user(db: Session, user: schemas.UserCreate):
    user = models.User(
        username=user.username,
        first_name=user.first_name.capitalize(),
        last_name=user.last_name.capitalize(),
        email=user.email,
        password_hash=hash_password(user.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


async def create_game(db: Session, user: schemas.User, game: schemas.GameCreate):
    is_white = randint(1, 1000000) % 2 == 0
    if is_white:
        game = models.LiveGame(
            white_player=user.username,
            time=game.time,
            increment=game.increment,
            board_props=org_board_props,
            game_moves="",
            game_end=False,
            game_started=False,
        )
    else:
        game = models.LiveGame(
            black_player=user.username,
            time=game.time,
            increment=game.increment,
            board_props=org_board_props,
            game_moves="",
            game_end=False,
            game_started=False,
        )

    db.add(game)
    db.commit()
    db.refresh(game)
    return game


async def get_game(db: Session, game_id: int):
    return db.query(models.Game).filter_by(id=game_id).first()


async def get_live_game(db: Session, game_id: int):
    return db.query(models.LiveGame).filter_by(id=game_id).first()
