"use client";

import { useState, useEffect } from "react";

export default function DraggableDiv() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(false); // Track if the div is selected
  const [barHeight, setBarHeight] = useState(40); // Initial bar height
  const [divInBar, setDivInBar] = useState(false); // Track if the div is inside the bar

  useEffect(() => {
    // Listen for mousemove and mouseup globally
    const handleMouseMove = (e) => {
      if (!dragging) return;

      // Get the window's width and height
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Calculate new position with boundaries
      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      // Prevent dragging off the left and right of the screen
      newX = Math.max(0, Math.min(newX, windowWidth - 100)); // 100 is the width of the div

      // Prevent dragging off the top and bottom of the screen
      newY = Math.max(0, Math.min(newY, windowHeight - 100)); // 100 is the height of the div

      setPosition({ x: newX, y: newY });

      // If the div is dragged to the top bar, expand it
      if (newY < barHeight) {
        setDivInBar(true);
        setBarHeight(150); // Increase bar height when dragging inside the bar
      } else {
        setDivInBar(false);
        setBarHeight(40); // Reset bar height when dragged out
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      if (divInBar) {
        // If div is inside the bar, hide it and reset
        setVisible(false);
        setBarHeight(40); // Reset bar height
        setPosition({ x: 0, y: 0 }); // Reset position (optional)
      }
    };

    // Attach global mousemove and mouseup listeners
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset, divInBar]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setSelected(true); // Mark as selected
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    if (!visible) {
      setVisible(true); // Reveal the div on first drag
    }
  };

  return (
    <div>
      {/* Top bar to trigger animation and expansion */}
      <div
        onMouseEnter={() => setVisible(true)} // Reveal the div when hovering
        onMouseLeave={() => !dragging && setVisible(false)} // Hide when mouse leaves and not dragging
        style={{
          width: "100%",
          height: `${barHeight}px`, // Dynamic height for the bar
          backgroundColor: "#333",
          color: "#fff",
          textAlign: "center",
          lineHeight: `${barHeight}px`,
          cursor: "pointer",
          transition: "height 0.5s ease",
        }}
      >
        Hover over me to reveal (Drag me!)
      </div>

      {/* Hidden falling div */}
      <div
        style={{
          position: "absolute",
          top: visible ? "50px" : "-200px", // Moves down when visible
          left: "0",
          width: "100%",
          opacity: visible ? 1 : 0, // Fade in/out
          visibility: visible ? "visible" : "hidden", // Ensure it's interactable
          transition:
            "top 0.5s ease 0.3s, opacity 0.5s ease, visibility 0s linear 0.5s", // Falling animation with delay
          zIndex: 999,
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: "100px",
            height: "100px",
            backgroundColor: "lightblue",
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
        >
          Drag me
        </div>
      </div>
    </div>
  );
}
