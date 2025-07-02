import { useCallback, useRef } from "react";

export const useClickSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playClickSound = useCallback(() => {
    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/1113/1113.wav",
        );
        audioRef.current.volume = 0.3; // Set volume to 30%
        audioRef.current.preload = "auto";
      }

      // Reset audio to beginning and play
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        // Silently fail if audio can't be played (e.g., no user interaction yet)
        console.warn("Click sound not available:", error);
      });
    } catch (error) {
      // Silently fail if audio is not supported
      console.warn("Click sound not available:", error);
    }
  }, []);

  return { playClickSound };
};
