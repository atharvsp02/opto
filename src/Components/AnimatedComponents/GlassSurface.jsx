// src/Components/GlassSurfaceBackground.jsx
import React from "react";

export default function GlassSurfaceBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Base gradient (dark foundation) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#060616] via-[#0a0a20] to-[#060616]" />

            {/* Frosted glass surface */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />

            {/* Enhanced color glow layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,180,255,0.35),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,50,180,0.3),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(255,200,100,0.15),transparent_70%)]" />

            {/* Aurora-style animated light sweep */}
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0.08),transparent_75%)] animate-[spin_12s_linear_infinite]" />

            {/* Gentle pulsing light for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_60%)] animate-pulse" />

            {/* Optional faint noise texture */}
            <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
        </div>
    );
}
