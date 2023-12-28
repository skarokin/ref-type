import { FaCrown } from "react-icons/fa";
import fetchLeaderboard from "../utils/fetch-leaderboard";
import { useState, useEffect } from "react";

export default function Leaderboard({
    leaderboardOpened,
    setLeaderboardOpened,
    className = "",
}: {
    leaderboardOpened: boolean;
    setLeaderboardOpened: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}) {
    const [displayLeaderboard, setDisplayLeaderboard] = useState<boolean>(false);

    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    const handleLeaderboardClick = () => {
        setDisplayLeaderboard(true);
        setLeaderboardOpened(true);
        fetchLeaderboard()
        .then(res => {
            if (res && res.Status === "Success") {
                setLeaderboard(res.leaderboard.map((user: any) => {
                    return {
                        username: user.username,
                        top15_wpm: user.top15_wpm,
                        top15_accuracy: user.top15_accuracy,
                    }
                }));
            }
        }).catch(err => console.log(err));
    };

    const handleCancelClick = () => {
        setDisplayLeaderboard(false);
        setLeaderboardOpened(false);
    }

    return (
        <div className={`${className} flex items-center`}>
            <button 
            className={"block rounded px-4 py-2 mt-1 text-subColor transition-colors duration-300 ease-in-out hover:text-mainColor"}
            onClick={handleLeaderboardClick}
            >
                <FaCrown size={25}/>
            </button> 
            {displayLeaderboard && (
                <>
                <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
                <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 bg-subColor shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{ top: '500%' }}>
                    <h1 className="text-xl m-4">Time 15 Leaderboard</h1>
                    <span className="text-sm m-4">*updates every 5 minutes</span>
                    <table className="m-4 border-separate rounded-xl">
                        <thead>
                            <tr>    
                                <th className="w-20 text-left text-l border-black rounded-xl">Rank</th>
                                <th className="w-40 text-left text-l border-black rounded-xl">Username</th>
                                <th className="w-20 text-left text-l border-black rounded-xl">WPM</th>
                                <th className="w-20 text-left text-l border-black rounded-xl">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((user: any, rank: number) => {
                                return (
                                    <tr key={user.username} className={rank % 2 === 0 ? 'bg-bgColor/50': ''}>
                                        <td className="border-transparent rounded-xl">{ rank + 1 }</td>
                                        <td className="border-transparent rounded-xl">{ user.username }</td>
                                        <td className="border-transparent rounded-xl">{ user.top15_wpm }</td>
                                        <td className="border-transparent rounded-xl">{ user.top15_accuracy }</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <button 
                        className="bg-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleCancelClick}>
                        Cancel
                        </button>
                </div>
                </>
            )}
        </div>
    );
}