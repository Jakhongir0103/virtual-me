import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from prompt import SYSTEM_PROMPT
import uuid
from typing import List, Dict, Union

load_dotenv()

app = FastAPI()

ALLOWED_ORIGINS = [
    "https://virtual-assistant-frontend.onrender.com",  # Production frontend
    "http://localhost:3000",  # Local development frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

model = ChatOpenAI(
    model_name="gpt-4o-mini",
    temperature=0.7,
    api_key=os.getenv("OPENAI_API_KEY")
)

# Enhanced conversation history management
class ConversationManager:
    def __init__(self, max_history_length: int = 20):
        """
        Initialize conversation manager with configurable history length.
        """
        self.conversations: Dict[str, List] = {}
        self.max_history_length = max_history_length
    
    def get_or_create_conversation(self, conversation_id: str) -> List:
        """
        Retrieve existing conversation or create a new one.
        """
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = [
                SystemMessage(content=SYSTEM_PROMPT)
            ]
        return self.conversations[conversation_id]
    
    def add_message(self, conversation_id: str, message: Union[HumanMessage, AIMessage]):
        """
        Add a message to conversation history, managing maximum history length.
        """
        conversation = self.conversations.get(conversation_id, [])
        conversation.append(message)
        
        # Trim history if it exceeds max length, keeping system message
        if len(conversation) > self.max_history_length + 1:
            conversation = conversation[:1] + conversation[-(self.max_history_length):]
        
        self.conversations[conversation_id] = conversation
    
    def clear_conversation(self, conversation_id: str):
        """
        Clear conversation history for a specific conversation.
        """
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]

# Initialize conversation manager
conversation_manager = ConversationManager()

class ChatMessage(BaseModel):
    message: str
    conversation_id: Union[str, None] = None

@app.post("/api/chat")
async def chat(message: ChatMessage):
    try:
        # Generate conversation ID if not provided
        conversation_id = message.conversation_id or str(uuid.uuid4())
        
        # Retrieve or create conversation history
        conversation_history = conversation_manager.get_or_create_conversation(conversation_id)
        
        # Add user message to history
        conversation_manager.add_message(
            conversation_id, 
            HumanMessage(content=message.message)
        )
        
        # Get response from the model using full conversation history
        response = model.invoke(conversation_history)
        
        # Add assistant response to history
        conversation_manager.add_message(
            conversation_id, 
            AIMessage(content=response.content)
        )
        
        return {
            "response": response.content,
            "conversation_id": conversation_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/conversations/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """
    Endpoint to clear a specific conversation history.
    """
    try:
        conversation_manager.clear_conversation(conversation_id)
        return {"message": "Conversation history cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT")))