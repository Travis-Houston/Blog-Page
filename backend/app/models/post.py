from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

# Define the Post model
class Post(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    slug: str
    title: str
    desc: str
    content: str
    img: Optional[str] = None
    
    class Config:
        #allow the use of aliases (e.g., _id to id)
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "slug": "my-first-post",
                "title": "My First Post",
                "desc": "This is a description of my first post.",
                "img": "https://example.com/image.jpg",
                "content": "This is the content of my first post."
            }
        }

class PostUpdate(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))
    slug: str = None
    title: str = None
    desc: str = None
    content: str = None
    img: Optional[str] = None