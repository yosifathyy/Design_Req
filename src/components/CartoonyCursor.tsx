import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CartoonyCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setIsVisible(true);
      setMousePosition({ x: e.clientX - 16, y: e.clientY - 16 });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.matches(
          "button, a, input, textarea, select, [role='button'], .cursor-pointer",
        )
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.matches(
          "button, a, input, textarea, select, [role='button'], .cursor-pointer",
        )
      ) {
        setIsHovering(false);
      }
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("mouseleave", handleMouseOut);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("mouseleave", handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {/* Main cursor */}
        <motion.div
          className="relative w-full h-full"
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
            rotate: isClicking ? 180 : 0,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-3 border-retro-orange"
            animate={{
              scale: isHovering ? 1.2 : 1,
              borderWidth: isClicking ? "6px" : "3px",
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          />

          {/* Inner dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-retro-orange"
            animate={{
              scale: isClicking ? 2 : isHovering ? 1.5 : 1,
            }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          />

          {/* Sparkles around cursor when hovering */}
          {isHovering && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-retro-purple rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI) / 2) * 20,
                    y: Math.sin((i * Math.PI) / 2) * 20,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </>
          )}

          {/* Click ripple effect */}
          {isClicking && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-retro-peach"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default CartoonyCursor;
