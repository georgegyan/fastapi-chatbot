from google import genai
from app.core.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_response(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"
    
def generate_chat_title(first_message: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""
            Generate a short chat title for (3-6 words max)
            for this message:
            
            {first_message}
            Return only title.
            """
        )

        return response.text.strip()
    
    except Exception:
        return "New Chat"