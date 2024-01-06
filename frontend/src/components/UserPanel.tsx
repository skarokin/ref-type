/*
*  Displays user panel
*  - Registration (button; opens a form)
*  - Login (button; opens a form)
*  - Logout (button; removes the token)
*  - Username (button; opens typing stats)
*/
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import LoginForm from "../utils/login-form";
import RegisterForm from "../utils/register-form";
import handleLogout from "../utils/logout";
import UserStats from "../utils/user-stats";
import axios from "axios";

export default function UserPanel({
    userPanelOpened,
    setUserPanelOpened,
    className = "text-lg font-bold transition-colors duration-300 ease-in-out hover:text-mainColor text-subColor block rounded px-4 py-2",
}: {
    userPanelOpened: boolean;
    setUserPanelOpened: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}) {
    const [auth, setAuth] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [userStats, setUserStats] = useState<string[]>([]);

    // the actual forms for login and register are in a separate component
    // those components also handle sending and retrieving data from the server
    const [displayLogin, setDisplayLogin] = useState<boolean>(false);
    const [displayRegister, setDisplayRegister] = useState<boolean>(false);
    const [displayStats, setDisplayStats] = useState<boolean>(false);

    axios.defaults.withCredentials = true;

    // fetch user info from server if user panel opened and user is authenticated
    useEffect(() => {
      if (userPanelOpened && auth) {
        axios.get("https://us-central1-steam-link-409216.cloudfunctions.net/api/userinfo")
        .then(res => {
            if (res.data.Status === "Success") {
                setAuth(true);
                setUsername(res.data.username);
                setUserStats([res.data.top15_wpm, res.data.top15_accuracy])
            } else {
                setAuth(false);
            }
        })
        .catch(err => console.log(err));
      }
    }, [userPanelOpened, auth]);

    useEffect(() => {
      if (displayLogin || displayRegister || displayStats) {
        setUserPanelOpened(true);
      } else {
        setUserPanelOpened(false);
      }
    }, [displayLogin, displayRegister, displayStats, userPanelOpened, setUserPanelOpened]);

    const handleLoginClick = () => {
      setDisplayLogin(true);
      setDisplayRegister(false);
      setDisplayStats(false);
    };
      
    const handleRegisterClick = () => {
      setDisplayLogin(false);
      setDisplayRegister(true);
      setDisplayStats(false);
    };
    
    // if login success, auth set to true and userPanel closed
    const handleLoginSuccess = () => {
      setDisplayLogin(false);
      setDisplayRegister(false);
      setAuth(true);
    };
    
    const handleRegisterSuccess = () => {
      setDisplayLogin(true);
      setDisplayRegister(false);
    };

    const handleUserStatsClick = () => {
      setDisplayStats(true);
    };

    return (
      <div className={"z-10"} tabIndex={-1}>
        <FaUserCircle size={30} className={"block my-2 ml-4 text-subColor"}/>
        {auth ? (
          <div className={"flex flex-col items-start space-y-4"}>
            {(
              <div className={"space-y-4"}>
                <button tabIndex={-1} className={className} onClick={handleUserStatsClick}>{username}</button>
                <button tabIndex={-1} className={className} onClick={() => handleLogout(setAuth)}>Logout</button>
              </div>
              )}
            {displayStats && (
              <div className={"ml-5"}>
                <UserStats 
                  userStats={userStats}
                  onCancel={() => setDisplayStats(false)}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-start space-y-4">
            {<button tabIndex={-1} className={className} onClick={handleLoginClick}>Login</button>}
            {displayLogin && (
              <div className={"ml-5"}>
                <LoginForm 
                  onSuccess={handleLoginSuccess} 
                  onCancel={() => setDisplayLogin(false)}
                />
              </div>
            )}
            {<button tabIndex={-1} className={className} onClick={handleRegisterClick}>Register</button>}
            {displayRegister && (
              <div className={"ml-5"}>
                  <RegisterForm onSuccess={handleRegisterSuccess} onCancel={() => setDisplayRegister(false)}/> 
              </div>
            )}
          </div>
        )}
      </div>
    );
};