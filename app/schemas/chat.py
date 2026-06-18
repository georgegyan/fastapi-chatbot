from pydantic import BaseModel

class ChatCreate(BaseModel):
    title: str

class ChatResponse(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True