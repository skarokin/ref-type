import { FaCrown, FaUserCircle } from "react-icons/fa";
import { fetchLeaderboard, fetchTimeLeft } from "../utils/fetch-leaderboard";
import { useState, useEffect, useCallback } from "react";
import { formatPercentage, formatTime } from "../utils/helpers";

export default function Leaderboard({
    setLeaderboardOpened,
}: {
    setLeaderboardOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [displayLeaderboard, setDisplayLeaderboard] = useState<boolean>(false);
    const [timeToNextUpdate, setTimeToNextUpdate] = useState<number>(0);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    const handleLeaderboardClick = useCallback(() => {
        const cachedLeaderboard = localStorage.getItem("leaderboard");
        const cachedTimeLeft = localStorage.getItem("timeLeft");

        // if cached leaderboard is available and time left greater than 1000ms,
        // use cached leaderboard and cached time left
        if (cachedLeaderboard && cachedTimeLeft && Number(cachedTimeLeft) > 1000) {
            setLeaderboard(JSON.parse(cachedLeaderboard));
            console.log("using cached leaderboard and time");
        // else, fetch new leaderboard and time left from server (time left is called to keep in sync)
        } else {
            fetchLeaderboard()
            .then(res => {
                if (res && res.Status === "Success") {
                    const leaderboardData = res.leaderboard.map((user: any) => {
                        return {
                            username: user.username,
                            top15_wpm: user.top15_wpm,
                            top15_accuracy: user.top15_accuracy,
                        }
                    });
                    setLeaderboard(leaderboardData);
                    localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
                }
            }).catch(err => console.log(err));

            fetchTimeLeft()
            .then(res => {
                if (res && res.Status === "Success") {
                    setTimeToNextUpdate(res.timeLeft);
                    localStorage.setItem("timeLeft", res.timeLeft);
                }
            }).catch(err => console.log(err));

            console.log("fetching new leaderboard and time");
        }
    }, [setLeaderboardOpened]);
    
    useEffect(() => {
        // decrement time locally instead of having to call server every second
        if (timeToNextUpdate > 0) {
            const timer = setInterval(() => {
                // update cached time left
                localStorage.setItem("timeLeft", String(timeToNextUpdate));
                setTimeToNextUpdate((prevTime => prevTime - 1000));
            }, 1000);
    
            return () => {
                clearInterval(timer); // cleanup on unmount
                // update cached time left
                localStorage.setItem("timeLeft", String(timeToNextUpdate));
            }
        }
    
        // if timer is up, fetch new leaderboard and reset timer to 4:59
        if (timeToNextUpdate <= 0) {   
            setTimeToNextUpdate((4*60*1000)+(59*1000));
            handleLeaderboardClick();
        }

    }, [timeToNextUpdate, handleLeaderboardClick]);

    const handleCancelClick = () => {
        setDisplayLeaderboard(false);
        setLeaderboardOpened(false);
    }

    return (
        <div tabIndex={-1}>
            <button 
                className={"block rounded px-4 py-2 mt-1 text-subColor transition-colors duration-300 ease-in-out hover:text-mainColor"}
                onClick={() => {
                    handleLeaderboardClick();
                    setDisplayLeaderboard(true);
                    setLeaderboardOpened(true);
                }}
                tabIndex={-1}
            >
                <FaCrown size={25}/>
            </button> 
            {displayLeaderboard && (
                <>
                    <div className="fixed inset-0 bg-black opacity-50 z-20"></div>
                    <div className="absolute transform -translate-x-1/2 z-20 bg-bgColor shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h1 className="text-3xl ml-4 mt-4 text-mainColor">Time 15 Leaderboard</h1>
                        <span className="text-s m-4 text-subColorAlt/50">next update in: {formatTime(timeToNextUpdate)}</span>
                        <div className="overflow-x-auto">
                            <div className="align-middle inline-block min-w-full shadow overflow-hidden bg-bgColor rounded px-8 pt-3 pb-4">
                                <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 border-subColor text-left text-xl leading-4 text-subColorAlt/50">#</th>
                                        <th className="pr-48 py-3 border-b-2 border-subColor text-left text-xl leading-4 text-subColorAlt/50">name</th>
                                        <th className="px-12 py-3 border-b-2 border-subColor text-left text-xl leading-4 text-subColorAlt/50">wpm</th>
                                        <th className="px-12 py-3 border-b-2 border-subColor text-left text-xl leading-4 text-subColorAlt/50">accuracy</th>
                                    </tr>
                                    <tr className="h-1"></tr> {/* spacer row since body is rounded*/}
                                </thead>
                                <tbody className="bg-bgColor">
                                    {leaderboard.map((user: any, rank: number) => (
                                        <tr key={user.username} 
                                            className={rank % 2 === 0 ? 'bg-subColorDark rounded ring-2 ring-subColorDark': ''}
                                        >
                                            <td className="px-6 py-4 whitespace-no-wrap text-white text-l text-left">{rank + 1}</td>
                                            <td className="py-4 whitespace-no-wrap text-white text-l text-left">
                                                <FaUserCircle size={15} className={"inline mr-2 text-subColor"}/>
                                                {user.username}
                                            </td>
                                            <td className="px-12 py-4 whitespace-no-wrap text-white text-l text-left">{user.top15_wpm}</td>
                                            <td className="px-12 py-4 whitespace-no-wrap text-white text-l text-left">{formatPercentage(user.top15_accuracy)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                        <button 
                            className="absolute top-0 right-0 block rounded px-4 py-2 transition-colors duration-300 ease-in-out text-subColor hover:text-mainColor"
                            onClick={handleCancelClick}
                            style={{fontSize: '1.5rem'}}
                        >
                            &times;
                        </button>
                    </div>
                    </div>
                </>
            )}
        </div>
    );
}