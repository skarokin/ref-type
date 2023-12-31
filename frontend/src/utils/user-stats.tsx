import { formatPercentage } from "./helpers";

export default function UserStats({
    userStats,
    onCancel,
}: {
    userStats: string[],
    onCancel: () => void;
}) {
    return (
        <div className="absolute flex flex-col items-center justify-center w-64">
            <div className="w-full max-w-sm bg-bgColor ring-2 ring-inset ring-subColor/50 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <p className="block text-mainColor text-xl mb-2">top 15s test:</p>
                    <ul>
                        <li>WPM: {userStats[0]}</li>
                        <li>Accuracy: {formatPercentage(Number(userStats[1]))}</li>
                    </ul>
                    <button 
                        className="absolute top-0 right-0 block rounded px-4 py-2 transition-colors duration-300 ease-in-out text-subColor hover:text-mainColor"
                        onClick={onCancel}
                        style={{fontSize: '1.5rem'}}
                    >
                        &times;
                    </button>
            </div>
        </div>
)};