import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Chat 7b</h1>
      <div className="card">
        <p>How can I be of assistance?</p>
        <input
          type="text"
          placeholder="Ask away"
          onfocus="this.placeholder"
          onblur="this.placeholder='Ask away'"
        ></input>
      </div>
    </>
  );
}

export default App;
