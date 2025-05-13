from fastapi import APIRouter, HTTPException
from bson import ObjectId
from uuid import uuid4
from app.models.post import Post, PostUpdate 
from app.config import database 

# Assign the database collection
db = database["post"]


router = APIRouter()

#Helper to convert MongoDB ObjectId to string 
def post_helper(post) -> dict:
    return {
        "id": str(post["_id"]),
        "created_at": str(post["created_at"]),
        "slug": str(post["slug"]),
        "title": str(post["title"]),
        "desc": str(post["desc"]),
        "content": str(post["content"]),
        "img": str(post["img"])
    }

# Create Post
@router.post("/", response_description="Add new post")
async def create_post(post: Post):
    post_dict= post.dict(by_alias=True)
    post_dict["_id"] = str(uuid4())  
    result = await db.post.insert_one(post_dict)
    new_post = await db.post.find_one({"_id": result.inserted_id})
    return{"status_code": 201,"result": [post_helper(new_post)]}

# Get all Post
@router.get("/", response_description="Get a list of all post")
async def list_posts():
    posts = await db.post.find().to_list(100)
    if posts:
        return {"status": 201, "result": [post_helper(post) for post in posts]}
    raise HTTPException(status_code=404, detail="No posts found")

# Read single post by ID
@router.get("/{id}", response_description="Get a single post")
async def read_post(id: str):
    if (post := await db.post.find_one({"_id": id})):
        return {"status": 201, "result": post_helper(post)}
    raise HTTPException(status_code=404, detail=f"Post {id} not found")

#update post
@router.put("/{id}", response_description="Update a post")
async def update_post(id: str, post: PostUpdate):
    post_dict = {k:v for k,v in post.dict(by_alias=True).items() if v is not None}
    if len(post_dict) >= 1:
        update_result = await db.post.update_one(
            {"_id": id}, {"$set": post_dict}
        )
        
        #Check if the post is successfully updated
        if update_result.modified_count == 1:
            if (updated_post := await db.post.find_one({"_id": id})) is not None:
                return {"status": 201, "result": post_helper(updated_post)}
            
    if (existing_post := await db.post.find_one({"_id": id})) is not None:
        return {"status": 200, "result": post_helper(existing_post)}
    
    raise HTTPException(status_code=404, detail=f"Post {id} not found")
        
#Delete Post
@router.delete("/{id}", response_description="Delete a post")
async def delete_post(id:str):
    delete_result = await db.post.delete_one({"_id": id})
    
    if delete_result.deleted_count == 1:
        return {"status": 200, "message": f"Post {id} deleted successfully"}
    
    raise HTTPException(status_code=404, detail=f"Post {id} not found")

