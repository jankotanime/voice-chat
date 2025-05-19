let audioCtx = null;

export function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}