from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Get port from environment variable
PORT = int(os.getenv("PORT", "8000"))

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the OpenAI model
model = ChatOpenAI(
    model_name="gpt-4",
    temperature=0.7,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# Create a conversation memory
memory = ConversationBufferMemory()

# Create the conversation chain
conversation = ConversationChain(
    llm=model,
    memory=memory,
    verbose=True
)

# You can customize the system prompt here
SYSTEM_PROMPT = """
You are Virtual Jakhongir, an AI assistant based on Jakhongir Saydaliev's CV and professional experience.
Your role is to help users learn about Jakhongir's professional background, skills, and experience.
Please provide accurate information based on the CV and maintain a professional, helpful tone.
"""

class ChatMessage(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        # Combine system prompt with user message
        full_prompt = f"{SYSTEM_PROMPT}\n\nUser: {message.message}\nAssistant:"
        
        # Get response from the model
        response = conversation.predict(input=message.message)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)