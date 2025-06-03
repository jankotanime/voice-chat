import { io } from 'socket.io-client';
import { getAudioContext } from './audioContext.js';

const VOICE_URL = process.env.NEXT_PUBLIC_VOICE_URL

export const socket = io(VOICE_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false
});

socket.on("connect_error", (err) => {
  console.error("Błąd połączenia z WebSocketem:", err.message);
});

socket.on("connect", () => {
  console.log("Połączono z serwerem WebSocket.");
});

const audioCtx = getAudioContext();

socket.on("voice", (userId, buffer) => {
  if (!audioCtx) {
    console.warn("AudioContext niedostępny");
    return;
  }
  
  try {
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 0x7FFF;
    }

    const audioBuffer = audioCtx.createBuffer(1, float32Array.length, audioCtx.sampleRate);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (err) {
    console.error("Błąd podczas odtwarzania audio:", err);
  }
});

socket.on("guest_join", () => {
  const audio = new Audio("/spa/audio/guest-join.mp3");
  audio.play().catch(err => console.error("Error playing audio:", err));
});

socket.on("guest_leave", () => {
  const audio = new Audio("/spa/audio/guest-leave.mp3");
  audio.play().catch(err => console.error("Error playing audio:", err));
});

export const roomMatesListener = (setRoomMates) => {
  if (!socket) return
  socket.on("roomMates", (data) => {
    setRoomMates(data)
  }); 
}
