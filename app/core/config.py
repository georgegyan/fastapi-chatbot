import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = "change-this-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")