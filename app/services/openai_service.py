from openai import OpenAI
from app.core.config import OPENAI_API_KEY

client = OpenAI(
    api_key=OPENAI_API_KEY
)

def generate_response(message: str) -> str:
    response = client.responses.create(
        model="gpt-5",
        input=message
    )

    return response.output_text