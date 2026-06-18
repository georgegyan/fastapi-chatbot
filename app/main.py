from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.core.settings import settings
from app.api.chat import router as chat_router
from app.api.message import router as message_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version
)

app.include_router(message_router)

app.include_router(chat_router)

app.include_router(health_router)
app.include_router(auth_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to AI ChatBot"
    }