import { useEffect, useRef, useState } from "react";
import "./App.css";
import upArrowIcon from "./assets/up-arrow.svg";
import LoadingSpinner from "./components/LoadingSpinner";
import { SocketMessage } from "./models/SocketMessage.model";
import { ChatItem } from "./models/ChatItem.model";
import { ChatItemType } from "./models/ChatItemType.enum";

function App() {
  const webSocketUrl = import.meta.env.VITE_WEBSOCKET_URL;
  const [chatLog, setChatLog] = useState<ChatItem[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever chatLog changes
  useEffect(() => {
    // TODO: move to top of last message, not bottom of chat log
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog]);

  useEffect(() => {
    const websocket = new WebSocket(webSocketUrl);

    // TODO: show on screen connection is successful and if it cuts out
    websocket.onopen = () => {
      console.log("WebSocket is connected");
    };

    websocket.onmessage = (evt) => {
      if (evt.data === "[END_OF_STREAM]") {
        setIsLoading(false);
        return;
      }

      setChatLog((existingChat) => {
        const lastMessage = existingChat[existingChat.length - 1];
        if (lastMessage && lastMessage.type === ChatItemType.Received) {
          const updatedChat = [...existingChat];
          updatedChat[updatedChat.length - 1] = new ChatItem({
            type: lastMessage.type,
            text: lastMessage.text + evt.data,
          });
          return updatedChat;
        } else {
          const chatItem = new ChatItem({
            type: ChatItemType.Received,
            text: evt.data,
          });
          return [...existingChat, chatItem];
        }
      });
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
    if (!currentMessage) return;

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
        <LoadingSpinner isLoading={isLoading} />
      </div>

      <div className="input-area">
        <p className="input-label">How can I be of assistance?</p>
        <div className="input-wrapper">
          <input
            className="message-input"
            type="text"
            placeholder="Ask away"
            value={currentMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          ></input>
          <button className="submit-button" onClick={sendMessage}>
            <img src={upArrowIcon} alt="Up arrow icon" />
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
