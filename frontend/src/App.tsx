// import { APITester } from "./APITester";
import { useEffect, useState } from "react";
import "./index.css";

export function App() {
  const [websocket, useWebsocket] = useState();

  function sendMessage() {
    websocket.send("ping");
  }

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000");
    useWebsocket(websocket)
    websocket.onmessage = (e) => {
      console.log(e.data);
    }
  }, [])

  return (
    <div className="app">
      <input type="text" />
      <button onClick={sendMessage}> Send Msg </button>
    </div>
  );
}

export default App;
