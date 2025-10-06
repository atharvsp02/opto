import React, { useRef, useCallback, useMemo } from "react";
import "./AnimatedCSS/ProfileCard.css";

const ProfileCard = ({ enableTilt = true }) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
  const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

  const handlePointerMove = useCallback(
    (event) => {
      if (!enableTilt) return;
      const card = cardRef.current;
      const wrap = wrapRef.current;
      const rect = card.getBoundingClientRect();

      const percentX = clamp(((event.clientX - rect.left) / rect.width) * 100);
      const percentY = clamp(((event.clientY - rect.top) / rect.height) * 100);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      wrap.style.setProperty("--rotate-x", `${round(centerY / 4)}deg`);
      wrap.style.setProperty("--rotate-y", `${round(-centerX / 5)}deg`);
      wrap.style.setProperty("--pointer-x", `${percentX}%`);
      wrap.style.setProperty("--pointer-y", `${percentY}%`);
      wrap.classList.add("active");
    },
    [enableTilt]
  );

  const handlePointerLeave = () => {
    const wrap = wrapRef.current;
    wrap.classList.remove("active");
    wrap.style.setProperty("--rotate-x", `0deg`);
    wrap.style.setProperty("--rotate-y", `0deg`);
  };

  const cardStyle = useMemo(
    () => ({
      "--behind-gradient": "radial-gradient(circle, #00ffaac4 0%, #073aff00 100%)",
      "--inner-gradient": "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
    }),
    []
  );

  return (
    <div
      ref={wrapRef}
      className="pc-card-wrapper"
      style={cardStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div ref={cardRef} className="pc-card">
        <div className="pc-inside" />
      </div>
    </div>
  );
};

export default ProfileCard;
