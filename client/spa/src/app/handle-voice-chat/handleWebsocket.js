import { io } from 'socket.io-client';

export const socket = io("http://localhost:8002", {
  transports: ['websocket', 'polling'],
  autoConnect: false
});

socket.on("connect_error", (err) => {
  console.error("Błąd połączenia z WebSocketem:", err.message);
});

socket.on("connect", () => {
  console.log("Połączono z serwerem WebSocket.");
});

socket.on("voice", ( buffer ) => {
  const blob = new Blob([buffer], { type: "audio/webm; codecs=opus" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play().catch(console.error);
});