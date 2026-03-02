from fastapi import FastAPI, WebSocket
from model_loader import load_model
from chat_session import ChatSession

app = FastAPI()
llm = load_model()

@app.websocket("/chat-socket")
async def chat_socket(websocket: WebSocket):
    await websocket.accept()
    chat_model = ChatSession(llm)
    
    while True:
        data = await websocket.receive_text()
        for chunk in chat_model.query_model(data):
            await websocket.send_text(chunk)
        await websocket.send_text("[END_OF_STREAM]")