import { useCallback, useRef } from "react";

export const useClickSound = () => {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);

  const playClickSound = useCallback(() => {
    try {
      // Create audio element if it doesn't exist
      if (!clickAudioRef.current) {
        clickAudioRef.current = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/1113/1113.wav",
        );
        clickAudioRef.current.volume = 0.3; // Set volume to 30%
        clickAudioRef.current.preload = "auto";
      }

      // Reset audio to beginning and play
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch((error) => {
        // Silently fail if audio can't be played (e.g., no user interaction yet)
        console.warn("Click sound not available:", error);
      });
    } catch (error) {
      // Silently fail if audio is not supported
      console.warn("Click sound not available:", error);
    }
  }, []);

  const playHoverSound = useCallback(() => {
    try {
      // Create audio element if it doesn't exist
      if (!hoverAudioRef.current) {
        hoverAudioRef.current = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/2568/2568.wav",
        );
        hoverAudioRef.current.volume = 0.2; // Set volume to 20% (quieter than click)
        hoverAudioRef.current.preload = "auto";
      }

      // Reset audio to beginning and play
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play().catch((error) => {
        // Silently fail if audio can't be played (e.g., no user interaction yet)
        console.warn("Hover sound not available:", error);
      });
    } catch (error) {
      // Silently fail if audio is not supported
      console.warn("Hover sound not available:", error);
    }
  }, []);

  return { playClickSound, playHoverSound };
};
