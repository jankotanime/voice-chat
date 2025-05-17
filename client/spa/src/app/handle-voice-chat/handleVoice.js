import { socket } from "./handleWebsocket";

let mediaRecorder;

export const handleVoice = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.connected) {
        event.data.arrayBuffer().then(buffer => {
          socket.emit("voice", buffer);
        });
      }
    };
    mediaRecorder.start(250);
  } catch (err) {
    console.error("Błąd dostępu do mikrofonu:", err);
  }
};
