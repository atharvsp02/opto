import React, { useState, useEffect } from 'react';

// This component now accepts a 'children' prop.
export default function FuturisticBackground({ children }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        delay: Math.random() * 5,
        duration: Math.random() * 5 + 5,
      }));
    };
    setParticles(generateParticles());
  }, []);

  return (
    <>
      {/* This <style> tag contains all the CSS needed for the background */}
      <style>{`
        .bg-container {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          background-color: #000;
        }
        .bg-visuals {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0; /* Background layer */
        }
        .bg-gradient {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to bottom right, #111827, #000000, #312e81);
        }
        // .bg-grid {
        //   position: absolute;
        //   inset: 0;
        //   background-image: linear-gradient(rgba(120, 119, 198, 0.3) 1px, transparent 1px),
        //                     linear-gradient(90deg, rgba(120, 119, 198, 0.3) 1px, transparent 1px);
        //   background-size: 50px 50px;
        //   mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%);
        // }
        .particle {
          position: absolute;
          background-color: #22d3ee; /* cyan-400 */
          border-radius: 9999px;
          animation-name: pulse;
          animation-iteration-count: infinite;
        }
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(70px);
          animation-name: pulse;
          animation-iteration-count: infinite;
        }
        .content-area {
          position: relative;
          z-index: 10; /* Content layer, appears on top */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.95); }
        }
      `}</style>

      <div className="bg-container">
        {/* All Background Layers */}
        <div className="bg-visuals">
          <div className="bg-gradient"></div>
          <div className="bg-grid"></div>
          {/* Particles */}
          <div>
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                  animationDelay: `${p.delay}s`,
                  animationDuration: `${p.duration}s`,
                }}
              />
            ))}
          </div>
          {/* Orbs */}
          <div>
            <div className="orb" style={{ top: '5rem', left: '2.5rem', width: '18rem', height: '18rem', background: 'linear-gradient(to right, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))', animationDuration: '8s' }}></div>
            <div className="orb" style={{ bottom: '5rem', right: '2.5rem', width: '24rem', height: '24rem', background: 'linear-gradient(to right, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))', animationDuration: '10s', animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {children}
        </div>
      </div>
    </>
  );
}

