import React, { useContext } from "react";
import { Context } from "../../context/context";
import GlassSurfaceBackground from "../AnimatedComponents/GlassSurface";



function Portfolio({ responses, idToName }) {
    console.log("Props received by Portfolio:", responses);

    const { user } = useContext(Context);

    if (!user) {
        return <p className="p-4">Login to see your portfolio</p>;
    }

    const sortedRoundIds = Object.keys(responses)
        .filter(key => key.startsWith('round_'))
        .sort((a, b) => b.localeCompare(a));


    console.log("Portfolio found these round IDs:", sortedRoundIds);

    if (sortedRoundIds.length === 0) {
        return <p className="p-4">No opinions yet!</p>;
    }

    return (
        <div className="relative h-full max-h-[100vh] overflow-y-auto px-11 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <h2 className="text-xl font-bold mb-4 relative flex justify-center  top-0 bg-transparent  p-4 pt-9 rounded-md z-10">
                Your Prediction History
            </h2>

            {sortedRoundIds.map((roundId) => {
                const roundData = responses[roundId];
                const roundTimestamp = new Date(parseInt(roundId.split('_')[1])).toLocaleString();

                return (
                    <div
                        key={roundId}
                        className="mb-6 p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-lg shadow-[0_0_25px_rgba(255,255,255,0.06)]  transition-all duration-500"
                    >
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">{roundTimestamp}</h3>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b p-2">Crypto</th>
                                    <th className="border-b p-2">Opinion</th>
                                    <th className="border-b p-2">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roundData &&
                                    Object.entries(roundData).map(([qid, data]) => (
                                        <tr key={`${roundId}-${qid}`}>
                                            <td className="border-b p-2">{idToName[qid] || qid.toUpperCase()}</td>
                                            <td className="border-b p-2">{data.answer ? data.answer.toUpperCase() : "—"}</td>
                                            <td
                                                className={`border-b p-2 font-bold ${data.status === "correct"
                                                    ? "text-green-400"
                                                    : data.status === "wrong"
                                                        ? "text-red-400"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                {data.status}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );

};

export default Portfolio;