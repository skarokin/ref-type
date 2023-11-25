/*
*  A panel for displaying user information
*  If user is not logged in, display a login button
*  Else, display user information and a logout button
*/
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function UserPanel({
    className = "text-lg font-bold hover:bg-slate-700/50 text-slate-500 py-1 px-2 rounded",
}: {
    className?: string;
}) {
    // if authorized, display user info and logout button
    // else, display login button
    const [auth, setAuth] = useState<boolean>(false);

    // the actual forms for login and register are in a separate component
    // those components will also handle sending and retrieving data from the server
    const [displayLogin, setDisplayLogin] = useState(true);
    const [displayRegister, setDisplayRegister] = useState(true);

    return (
        <div className={"fixed top-10 left-20 m-10 flex flex-col items-start"}>
            <FaUserCircle size={40} className={"m-4 text-slate-500"}/>
            { true
            ? 
            <div className={"flex flex-col items-start space-y-4"}>
                <button className={className}>
                    Username</button>
                <button className={className}>
                    Logout 
                </button>
            </div>
            :
            <div className="flex flex-col items-start space-y-4">    
                <button className={className}>
                        Login
                </button>  
                <button className={className}>
                    Register
                </button>
            </div>
            }
        </div>
    )
}