from fastapi import FastAPI

app = FastAPI()

from .game import create_game, test
