import { useEffect, useRef, useState } from "react";
import "./index.css";

export function App() {
  const [divText, setDivText] = useState([""]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const roomInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    wsRef.current = ws;

    ws.onmessage = (msg) => {
      setDivText(currentText => [...currentText, msg.data]);
    }
  }, [])

  function connectRoom() {
    const msg = roomInputRef.current?.value || "";
    if (!msg) return;

    const ws = wsRef.current;
    if (!ws) return;

    const join = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: msg
        }
      }));
    };

    if (ws.readyState === WebSocket.OPEN) {
      join();
    } else {
      ws.addEventListener("open", join, { once: true });
    }
  }

  function sendMessage() {
    const ws = wsRef.current;
    if (!ws) return;

    const message = inputRef.current?.value || "";
    if (!message) return;

    ws.send(JSON.stringify({
      type: "message",
      payload: {
        message
      }
    }));
  }
  return (
    <div className="app">
      <div className="flex">
      <input type="text" ref={roomInputRef} />
      <button onClick={connectRoom}> Connect to Room </button>
      </div>
      <div className="flex">
        <div className='h-[85vh]'>
          {divText.map(message => <div className='m-8'>
            <span className='bg-white text-black rounded p-4 '>
              {message}
            </span>
          </div>)}
        </div>
        <input type="text" ref={inputRef} />
        <button onClick={sendMessage}> Send Msg </button>
      </div>
    </div>
  );
}

export default App;
