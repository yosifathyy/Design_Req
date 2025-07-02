import { useCallback } from "react";

// Simple click sound generator using Web Audio API
const createClickSound = (): (() => void) => {
  let audioContext: AudioContext | null = null;

  return () => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContext) {
        audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      // Create a simple click sound using oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        400,
        audioContext.currentTime + 0.1,
      );

      // Configure volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        audioContext.currentTime + 0.01,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.1,
      );

      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if Web Audio API is not supported
      console.warn("Click sound not available:", error);
    }
  };
};

export const useClickSound = () => {
  const playClickSound = useCallback(createClickSound(), []);

  return { playClickSound };
};
