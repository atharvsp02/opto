import React, { useContext } from "react";
import { Context } from "../../context/context";
import GlassSurfaceBackground from "../AnimatedComponents/GlassSurface";

const symbolToName = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    SOL: "Solana",
    DOGE: "Dogecoin",
    ADA: "Cardano",
    BNB: "Binance Coin",
    POL: "Polygon",
    XRP: "Ripple",
};

function Portfolio({ predictions = [] }) {
    const { user } = useContext(Context);

    if (!user) {
        return <p className="p-4 text-center text-sm sm:text-base">Login to see your portfolio</p>;
    }

    const groups = {};
    for (const p of predictions) {
        (groups[p.round_id] ||= []).push(p);
    }
    const sortedRoundIds = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

    if (sortedRoundIds.length === 0) {
        return <p className="p-4 text-center text-sm sm:text-base">No opinions yet!</p>;
    }

    return (
        <div className="relative h-full max-h-[100vh] overflow-y-auto px-4 sm:px-6 lg:px-11 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <h2 className="text-lg sm:text-xl font-bold mb-4 relative flex justify-center top-0 bg-transparent p-4 pt-6 sm:pt-9 rounded-md z-10">
                Your Prediction History
            </h2>

            {sortedRoundIds.map((roundId) => {
                const roundData = groups[roundId];
                const roundTimestamp = new Date(roundData[0].created_at).toLocaleString();

                return (
                    <div
                        key={roundId}
                        className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-black/30 backdrop-blur-lg shadow-[0_0_25px_rgba(255,255,255,0.06)] transition-all duration-500"
                    >
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3">{roundTimestamp}</h3>

                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[400px]">
                                <thead>
                                    <tr>
                                        <th className="border-b border-white/20 p-2 text-sm">Crypto</th>
                                        <th className="border-b border-white/20 p-2 text-sm">Opinion</th>
                                        <th className="border-b border-white/20 p-2 text-sm">Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roundData.map((p) => (
                                        <tr key={p.id}>
                                            <td className="border-b border-white/10 p-2 text-sm">{symbolToName[p.crypto] || p.crypto}</td>
                                            <td className="border-b border-white/10 p-2 text-sm">{p.answer ? p.answer.toUpperCase() : "—"}</td>
                                            <td
                                                className={`border-b border-white/10 p-2 text-sm font-bold ${p.status === "correct"
                                                    ? "text-green-400"
                                                    : p.status === "wrong"
                                                        ? "text-red-400"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                {p.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="block sm:hidden space-y-3">
                            {roundData.map((p) => (
                                <div
                                    key={p.id}
                                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-sm">{symbolToName[p.crypto] || p.crypto}</span>
                                        <span
                                            className={`text-xs font-bold px-2 py-1 rounded ${p.status === "correct"
                                                ? "bg-green-500/20 text-green-400"
                                                : p.status === "wrong"
                                                    ? "bg-red-500/20 text-red-400"
                                                    : "bg-gray-500/20 text-gray-400"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-300">
                                        Opinion: <span className="font-semibold">{p.answer ? p.answer.toUpperCase() : "—"}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Portfolio;