from fastapi.param_functions import Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.oauth2 import OAuth2PasswordRequestForm

from . import app, db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
