import React, { useContext } from "react";
import { Context } from "../../context/context";

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
        <div className="p-4 overflow-y-auto h-full">
            <h2 className="text-xl font-bold mb-4">Your Prediction History</h2>

            {sortedRoundIds.map((roundId) => {
                const roundData = responses[roundId];
                const roundTimestamp = new Date(parseInt(roundId.split('_')[1])).toLocaleString();

                
                console.log(`Rendering data for ${roundId}:`, roundData);

                return (
                    <div key={roundId} className="mb-6 p-3 bg-white/10 rounded-lg">
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
                                
                                {roundData && Object.entries(roundData).map(([qid, data]) => (
                                    <tr key={`${roundId}-${qid}`}>
                                        <td className="border-b p-2">{idToName[qid] || qid.toUpperCase()}</td>
                                        <td className="border-b p-2">{data.answer ? data.answer.toUpperCase() : "—"}</td>
                                        <td className={`border-b p-2 font-bold ${data.status === "correct" ? "text-green-400"
                                            : data.status === "wrong" ? "text-red-400"
                                                : "text-gray-400"
                                            }`}>
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