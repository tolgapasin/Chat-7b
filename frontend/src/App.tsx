import { useEffect, useRef, useState } from "react";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";
import { SocketMessage } from "./models/SocketMessage.model";
import { ChatItem } from "./models/ChatItem.model";
import { ChatItemType } from "./models/ChatItemType.enum";

function App() {
  const [chatLog, setChatLog] = useState<ChatItem[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever chatLog changes
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog]);

  useEffect(() => {
    const websocket = new WebSocket("ws://127.0.0.1:8000/chat-socket");

    // TODO: show on screen connection is successful and if it cuts out
    websocket.onopen = () => {
      console.log("WebSocket is connected");
    };

    websocket.onmessage = (evt) => {
      // TODO: for some reason, very long responses come through just as string, not a SocketMessage object
      // look into why this is happening and then get rid of this try/catch
      let text: string;
      try {
        const message: SocketMessage = JSON.parse(evt.data);
        text = message.payload;
      } catch {
        text = evt.data;
      }

      const chatItem = new ChatItem({
        type: ChatItemType.Received,
        text: text,
      });

      setChatLog((existingChat) => [...existingChat, chatItem]);
    };

    websocket.onclose = () => {
      console.log("WebSocket is closed");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws) {
      const message = new SocketMessage({
        type: "message",
        payload: currentMessage,
      });
      ws.send(JSON.stringify(message));

      setIsLoading(true);

      const chatItem = new ChatItem({
        type: ChatItemType.Sent,
        text: message.payload,
      });
      setChatLog((existingChat) => [...existingChat, chatItem]);
      setCurrentMessage("");
    }
  };

  const handleInputChange = (event: any) => {
    setCurrentMessage(event.target.value);
  };

  return (
    <>
      <h1>Chat 7b</h1>
      <div ref={chatLogRef} className="chat-log">
        {chatLog.map((chatItem, index) => (
          <span
            key={index}
            className={
              chatItem.type === ChatItemType.Sent
                ? "chat-item sent"
                : "chat-item received"
            }
          >
            <p>{chatItem.text}</p>
          </span>
        ))}
      </div>
      {/* TODO: fix this */}
      <LoadingSpinner isLoading={isLoading} />
      <div className="card">
        <p>How can I be of assistance?</p>
        <input
          type="text"
          placeholder="Ask away"
          value={currentMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        ></input>
        <button onClick={sendMessage}>↑</button>
      </div>
    </>
  );
}

export default App;
