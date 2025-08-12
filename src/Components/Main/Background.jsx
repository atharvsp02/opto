import React from "react"

const Background = ({ children }) => {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Large Grid overlay */}
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(96,165,250,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.4) 1px, transparent 1px)
          `,
                    backgroundSize: "120px 120px",
                    willChange: "transform",
                }}
            />

            {/* Center spotlight with softer fade to black */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 900px 700px at center, transparent 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.85) 100%)",
                    willChange: "transform",
                }}
            />

            {/* Gentler vignette effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)",
                    willChange: "transform",
                }}
            />

            {/* Subtle animated glow effect */}
            <div
                className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2"
                style={{ animationDuration: "8s" }}
            ></div>

            {/* Content */}
            <div className="relative z-10 transform-gpu">{children}</div>
        </div>
    )
}

export default Background