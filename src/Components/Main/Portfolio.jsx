import React, { useContext } from "react";
import { Context } from "../../context/context";

function Portfolio({ responses, idToName }) {
    const { user } = useContext(Context);

    console.log("Portfolio responses:", responses);


    if (!user) {
        return <p className="p-4">Login to see your portfolio</p>;
    }

    const entries = Object.entries(responses);

    if (entries.length === 0) {
        return <p className="p-4">No opinions yet!</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border-b p-2">Crypto</th>
                        <th className="border-b p-2">Your Opinion</th>
                        <th className="border-b p-2">Result</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map(([qid, data]) => (
                        <tr key={qid}>
                            {/* 🔹 use full crypto name */}
                            <td className="border-b p-2">
                                {idToName[qid] || qid.toUpperCase()}
                            </td>
                            <td className="border-b p-2">
                                {data.answer ? data.answer.toUpperCase() : "—"}
                            </td>
                            <td
                                className={`border-b p-2 ${
                                    data.status === "correct"
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
}


export default Portfolio;