from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message
from app.services.gemini_service import generate_response
from app.schemas.message import (
    MessageCreate,
    MessageResponse,
    AIResponse
)

# router instance for this module
router = APIRouter()

@router.post(
    "/{chat_id}/messages",
    response_model=AIResponse
)
def create_message(
    chat_id: int,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    user_message = Message(
        chat_id=chat.id,
        role="user",
        content=payload.content
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    ai_text = generate_response(
        payload.content
    )

    assistant_message = Message(
        chat_id=chat.id,
        role="assistant",
        content=ai_text
    )

    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    return {
        "user_message": user_message,
        "assistant_message": assistant_message
    }

@router.get(
    "/{chat_id}/messages",
    response_model=list[MessageResponse]
)
def get_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.id.asc())
        .all()
    )

    return messages