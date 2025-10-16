import { useEffect, useState } from "react";
import "./App.css";

// https://www.geeksforgeeks.org/reactjs/real-time-updates-with-websockets-and-react-hooks/
function App() {
  //const [count, setCount] = useState(0);

  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    const websocket = new WebSocket("ws://127.0.0.1:8000/chat-socket");

    websocket.onopen = () => {
      console.log("WebSocket is connected");
      // Generate a unique client ID
      const id = Math.floor(Math.random() * 1000);
      setClientId(id);
    };

    websocket.onmessage = (evt) => {
      const message = evt.data;
      setMessages((prevMessages) => [...prevMessages, message]);
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
          clientId: clientId,
        })
      );
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

      <div className="card">
        <p>How can I be of assistance?</p>
        <input
          type="text"
          placeholder="Ask away"
          onFocus="this.placeholder"
          onBlur="this.placeholder='Ask away'"
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
