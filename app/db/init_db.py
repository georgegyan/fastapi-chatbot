from app.db.base import Base
from app.db.database import engine
# Import models so SQLAlchemy knows about them
from app.models.user import User

def init_db():
    Base.metadata.create_all(bind=engine)