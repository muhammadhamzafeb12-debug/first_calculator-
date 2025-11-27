from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In prod, specify frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIRequest(BaseModel):
    prompt: str
    context: str = ""

@app.get("/")
async def root():
    return {"message": "Advanced AI Calculator API is running"}

@app.post("/ask-ai")
async def ask_ai(request: AIRequest):
    # Mock AI response for now
    # In a real scenario, this would call OpenAI or Gemini API
    
    prompt = request.prompt.lower()
    
    if "hello" in prompt:
        return {"response": "Hello! I am your AI math assistant. How can I help you today?"}
    elif "error" in prompt or "help" in prompt:
        return {"response": "It seems you might be stuck. Try checking your syntax or ask me for a formula!"}
    
    # Random helpful math facts or generic responses
    responses = [
        "That's an interesting calculation.",
        "Did you know that e^(i*pi) + 1 = 0?",
        "I can help you solve complex equations if you provide them.",
        "Make sure to close your parentheses!",
    ]
    
    return {"response": random.choice(responses)}

@app.post("/calculate")
async def calculate(expression: str):
    # Server-side calculation (safer than eval on client, but still needs sanitization)
    try:
        # Very basic unsafe eval for demonstration - DO NOT USE IN PROD without sanitization
        # In a real app, use a math parser library
        result = eval(expression, {"__builtins__": None}, {"min": min, "max": max, "abs": abs, "pow": pow})
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
