from pydantic import BaseModel

class ChatCreate(BaseModel):
    title: str | None = None

class ChatResponse(BaseModel):
    id: int
    title: str | None = None

    class Config:
        from_attributes = True