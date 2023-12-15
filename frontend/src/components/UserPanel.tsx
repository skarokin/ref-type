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
    className = "text-lg font-bold hover:bg-slate-700/50 text-slate-500 py-1 px-2 rounded",
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
    // check if user is logged in
    useEffect(() => {
        axios.get("http://localhost:8081/")
        .then(res => {
            if (res.data.Status === "Success") {
                setAuth(true);
                setUsername(res.data.username);
                setUserStats([res.data.top15_wpm, res.data.top15_accuracy])
            } else {
                setAuth(false);
            }
        });
    });

    useEffect(() => {
      if (displayLogin || displayRegister) {
        setUserPanelOpened(true);
      } else {
        setUserPanelOpened(false);
      }
    }, [displayLogin, displayRegister, userPanelOpened, setUserPanelOpened]);

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
    
      const handleLoginSuccess = () => {
        setDisplayLogin(false);
        setDisplayRegister(false);
      }
    
      const handleRegisterSuccess = () => {
        setDisplayLogin(true);
        setDisplayRegister(false);
      }

      const handleUserStatsClick = () => {
        setDisplayStats(true);
      }

    
      return (
        <div className={"fixed top-10 left-20 m-10 flex flex-col items-start"}>
          <FaUserCircle size={40} className={"m-4 text-slate-500"}/>
          {auth ? (
            <div className={"flex flex-col items-start space-y-4"}>
              {!displayStats && <button className={className} onClick={handleUserStatsClick}>{username}</button>}
              {displayStats && (
                <div style={{ marginLeft: '20px' }}>
                  <UserStats 
                    userStats={userStats}
                    onCancel={() => setDisplayStats(false)}
                  />
                </div>
              )}
              <button className={className} onClick={() => handleLogout(setAuth)}>Hi {username}, Logout?</button>
            </div>
          ) : (
            <div className="flex flex-col items-start space-y-4">
              {!displayRegister && <button className={className} onClick={handleLoginClick}>Login</button>}
              {displayLogin && (
                <div style={{ marginLeft: '20px' }}>
                  <LoginForm 
                    onSuccess={handleLoginSuccess} 
                    onCancel={() => setDisplayLogin(false)}
                  />
                </div>
              )}
              {!displayLogin && <button className={className} onClick={handleRegisterClick}>Register</button>}
              {displayRegister && (
                <div style={{ marginLeft: '20px' }}>
                   <RegisterForm onSuccess={handleRegisterSuccess} onCancel={() => setDisplayRegister(false)}/> 
                </div>
              )}
            </div>
          )}
        </div>
      );
};