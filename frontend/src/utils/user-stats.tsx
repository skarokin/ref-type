import { formatPercentage } from "./helpers";

export default function UserStats({
    userStats,
    onCancel,
}: {
    userStats: string[],
    onCancel: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-slate-500 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <p className="block text-slate-300 text-sm font-bold mb-2">Top 15 Test:</p>
                    <ul>
                        <li>WPM: {userStats[0]}</li>
                        <li>Accuracy: {formatPercentage(Number(userStats[1]))}</li>
                    </ul>
                    <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                onClick={onCancel}>
                Cancel
              </button>
            </div>
        </div>
)};