

import React, { useRef, useState, useEffect } from "react";
import "./Marquee.css";

const Marquee = ({ children, scrollSpeed = 2 }) => {
  const marqueeRef = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left

  const handleMouseEnter = (e) => {
    setIsMouseOver(true);
    setLastMouseX(e.pageX);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  const handleMouseMove = (e) => {
    if (!isMouseOver) return;
    const currentMouseX = e.pageX;
    const direction = currentMouseX > lastMouseX ? 1 : -1;
    setScrollDirection(direction);
    setLastMouseX(currentMouseX);
  };

  useEffect(() => {
    let animationFrameId;
    const animateScroll = () => {
      if (marqueeRef.current) {
        marqueeRef.current.scrollLeft += scrollSpeed * scrollDirection;
        if (marqueeRef.current.scrollLeft >= marqueeRef.current.scrollWidth / 2) {
          marqueeRef.current.scrollLeft = 0;
        } else if (marqueeRef.current.scrollLeft <= 0) {
          marqueeRef.current.scrollLeft = marqueeRef.current.scrollWidth / 2;
        }
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };
    animationFrameId = requestAnimationFrame(animateScroll);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollSpeed, scrollDirection]);

  return (
    <div
      className="marquee"
      ref={marqueeRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="marquee-content" style={{ backgroundColor: "black" }}>
        {children}
      </div>
    </div>
  );
};

export default Marquee;
