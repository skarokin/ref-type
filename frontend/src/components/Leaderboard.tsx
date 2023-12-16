import { FaCrown } from "react-icons/fa";

export default function Leaderboard({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div className={className}>
            <FaCrown size={40} className={"m-4 text-slate-500 hover:text-slate-300"}/> 
        </div>
    )
}