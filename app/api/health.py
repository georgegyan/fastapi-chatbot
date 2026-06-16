from fastapi import APIRouter
from app.db.init_db import init_db

router = APIRouter()

@router.get("/health")
async def health_check():

    return {
        "status": "healthy",
    }

@router.get("/init-db")
async def initialize_database():
    init_db()

    return {
        "message": "Database initialized"
    }