import { socket } from "./handleWebsocket";

export const handleVoice = async (muted) => {
  const constraints = { audio: true, video: false };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);

  const processor = audioCtx.createScriptProcessor(2048, 1, 1);
  source.connect(processor);
  processor.connect(audioCtx.destination);

  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);
    const int16Buffer = new Int16Array(inputData.length);
    for (let i = 0; i < inputData.length; i++) {
      int16Buffer[i] = inputData[i] * 0x7FFF;
    }
    if (!muted.current) {
      socket.emit("voice", int16Buffer.buffer);
    }
  };
};