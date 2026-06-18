from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.chat import Chat
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatResponse
from app.api.dependencies import get_current_user

router = APIRouter(
    prefix="/api/v1/chats",
    tags=["Chats"]
)

@router.post(
    "",
    response_model=ChatResponse
)
def create_chat(
    chat: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_chat = Chat(
        title=chat.title,
        user_id=current_user.id
    )

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return new_chat