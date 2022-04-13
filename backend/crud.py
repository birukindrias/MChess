from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas
from .hashing import hash_password, verify_password


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter_by(id=user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter_by(email=email).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter_by(username=username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    user = models.User(
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hash_password(user.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
