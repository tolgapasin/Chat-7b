from fastapi import FastAPI, WebSocket
from chat_model import ChatModel

chat_model = ChatModel()
app = FastAPI()

@app.websocket("/chat-socket")
async def chat_socket(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        for chunk in chat_model.query_model(data):
            await websocket.send_text(chunk)
        await websocket.send_text("[END_OF_STREAM]")