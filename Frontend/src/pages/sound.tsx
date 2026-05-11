export const playSoftSound = (type: "input" | "success" = "input") => {
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = type === "success" ? 660 : 420;

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.04, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);
};