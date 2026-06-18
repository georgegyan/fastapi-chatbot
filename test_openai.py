from app.services.openai_service import generate_response

reply = generate_response(
    "What is FastAPI?"
)

print(reply)