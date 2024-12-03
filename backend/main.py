from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Define allowed origins
ALLOWED_ORIGINS = [
    "https://virtual-assistant-frontend.onrender.com",  # Production frontend
    "http://localhost:3000",  # Local development frontend
]

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Restrict to only needed methods
    allow_headers=["Content-Type", "Authorization"],  # Restrict to only needed headers
)

# Initialize the OpenAI model with a proper system message
model = ChatOpenAI(
    model_name="gpt-4",
    temperature=0.7,
    api_key=os.getenv("OPENAI_API_KEY")
)

# Create a conversation memory with the system prompt
memory = ConversationBufferMemory(
    return_messages=True,  # Return messages instead of string
    ai_prefix="Assistant",
    human_prefix="User"
)

# Define the prompt template with the system message
prompt = PromptTemplate(
    input_variables=["history", "input"],
    template="""
{system_prompt}

Previous conversation:
{history}

User: {input}
Assistant:""".format(system_prompt=SYSTEM_PROMPT, history="{history}", input="{input}")
)

# Create the conversation chain with the prompt template
conversation = ConversationChain(
    llm=model,
    memory=memory,
    prompt=prompt,
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
        # Get response from the model using the conversation chain
        response = conversation.predict(input=message.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT")))