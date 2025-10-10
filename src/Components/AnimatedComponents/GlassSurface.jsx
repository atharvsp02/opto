// src/Components/GlassSurfaceBackground.jsx
import React from "react";

export default function GlassSurfaceBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Base gradient (dark foundation) */}
            <div className="absolute inset-0 " />

            {/* Frosted glass surface */}
            <div className="absolute inset-0 bg-transparent backdrop-blur-3xl" />


            {/* Aurora-style animated light sweep */}


            {/* Optional faint noise texture */}

        </div>
    );
}
