import { useState, useEffect, useCallback } from "react";

const CustomCursor = ({
  isHovering = false, // Whether the cursor is over a hoverable element
  selectedNav = null, // Currently selected nav item (if any)
  cursorColor = "indigo", // Default color (Tailwind prefix)
  hoverText = "EXPLORE NOW", // Customizable hover text
  baseSize = 12, // Base cursor size in pixels
  hoverSize = 48, // Hover size in pixels
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  // Optimize mouse movement with requestAnimationFrame
  const updatePosition = useCallback((e) => {
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  useEffect(() => {
    // Hide cursor on touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
      return;
    }

    window.addEventListener("mousemove", updatePosition);
    return () => window.removeEventListener("mousemove", updatePosition);
  }, [updatePosition]);

  // Don't show cursor if a nav item is selected or not visible
  if (!isVisible || selectedNav) return null;

  return (
    <div
      className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out ${
        isHovering
          ? `w-${hoverSize/4} h-12 rounded-lg bg-gradient-to-br from-${cursorColor}-500 to-${cursorColor}-700 shadow-lg flex items-center justify-center text-white text-sm font-medium animate-pulse`
          : `w-${baseSize/4} h-${baseSize/4} rounded-full bg-${cursorColor}-400 border-2 border-${cursorColor}-600`
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {isHovering && hoverText}
    </div>
  );
};

export default CustomCursor;