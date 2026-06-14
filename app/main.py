from fastapi import FastAPI

app = FastAPI(
    title = "AI ChatBot",
    version = "1.0.0",
)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI ChatBot"}