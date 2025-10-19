import React from "react"

const Background = ({ children }) => {
    return (
        <>
           
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="min-h-screen bg-[#020313] relative">
                    
                    <div
                        className="absolute inset-0 opacity-20 sm:opacity-25"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(96,165,250,0.4) 2px, transparent 1px),
                linear-gradient(90deg, rgba(96,165,250,0.4) 2px, transparent 1px)
              `,
                            backgroundSize: "60px 60px",
                            willChange: "transform",
                        }}
                    />

                   
                    <div
                        className="hidden sm:block absolute inset-0 opacity-0 sm:opacity-25"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(96,165,250,0.4) 2px, transparent 1px),
                linear-gradient(90deg, rgba(96,165,250,0.4) 2px, transparent 1px)
              `,
                            backgroundSize: "90px 90px",
                            willChange: "transform",
                        }}
                    />

                    
                    <div
                        className="hidden lg:block absolute inset-0 opacity-0 lg:opacity-25"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(96,165,250,0.4) 2px, transparent 1px),
                linear-gradient(90deg, rgba(96,165,250,0.4) 2px, transparent 1px)
              `,
                            backgroundSize: "120px 120px",
                            willChange: "transform",
                        }}
                    />

                    
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(ellipse 400px 300px at center, transparent 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.85) 100%)",
                            willChange: "transform",
                        }}
                    />


                    <div
                        className="hidden sm:block absolute inset-0 opacity-0 sm:opacity-100"
                        style={{
                            background:
                                "radial-gradient(ellipse 650px 500px at center, transparent 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.85) 100%)",
                            willChange: "transform",
                        }}
                    />

                    
                    <div
                        className="hidden lg:block absolute inset-0 opacity-0 lg:opacity-100"
                        style={{
                            background:
                                "radial-gradient(ellipse 900px 700px at center, transparent 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.85) 100%)",
                            willChange: "transform",
                        }}
                    />

                    
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)",
                            willChange: "transform",
                        }}
                    />

                   
                    <div
                        className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-500/5 rounded-full blur-xl sm:blur-2xl animate-pulse -translate-x-1/2 -translate-y-1/2"
                        style={{ animationDuration: "8s" }}
                    />
                </div>
            </div>

            
            <div className="relative z-10">{children}</div>
        </>
    );
};

export default Background