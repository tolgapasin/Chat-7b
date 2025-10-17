import { useEffect, useState } from "react";
import "./App.css";
import LoadingSpinner from "./components/LoadingSpinner";
import type { SocketMessage } from "./models/SocketMessage.model";

function App() {
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket("ws://127.0.0.1:8000/chat-socket");

    // TODO: show on screen connection is successful and if it cuts out
    websocket.onopen = () => {
      console.log("WebSocket is connected");
    };

    websocket.onmessage = (evt) => {
      const message = evt.data as SocketMessage;
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(message.payload);
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
      ws.send(
        JSON.stringify({
          type: "message",
          payload: message,
        })
      );
      setIsLoading(true);
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage("");
    }
  };

  const handleInputChange = (event: any) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <h1>Chat 7b</h1>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
      {/* TODO: fix this */}
      <LoadingSpinner isLoading={isLoading} />
      <div className="card">
        <p>How can I be of assistance?</p>
        <input
          type="text"
          placeholder="Ask away"
          // onFocus="this.placeholder"
          // onBlur="this.placeholder='Ask away'"
          value={message}
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
