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
import axios from "axios";

export default function UserPanel({
    className = "text-lg font-bold hover:bg-slate-700/50 text-slate-500 py-1 px-2 rounded",
}: {
    className?: string;
}) {
    const [auth, setAuth] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");

    // the actual forms for login and register are in a separate component
    // those components will also handle sending and retrieving data from the server
    const [displayLogin, setDisplayLogin] = useState(true);
    const [displayRegister, setDisplayRegister] = useState(true);

    axios.defaults.withCredentials = true;

    // check if user is logged in
    // useEffect(() => {
    //     axios.get("http://localhost:1337/")
    //     .then(res => {
    //         if (res.data.Status === "Success") {
    //             setAuth(true);
    //             setUsername(res.data.Username);
    //         } else {
    //             setAuth(false);
    //         }
    //     });
    // });

    const handleLoginClick = () => {
        setDisplayLogin(true);
        setDisplayRegister(false);
      };
      
      const handleRegisterClick = () => {
        setDisplayLogin(false);
        setDisplayRegister(true);
      };
    
      const handleLoginSuccess = () => {
        setDisplayLogin(false);
        setDisplayRegister(false);
      }
    
      const handleRegisterSuccess = () => {
        setDisplayLogin(true);
        setDisplayRegister(false);
      }
    
      return (
        <div className={"fixed top-10 left-20 m-10 flex flex-col items-start"}>
          <FaUserCircle size={40} className={"m-4 text-slate-500"}/>
          {false ? (
            <div className={"flex flex-col items-start space-y-4"}>
              <button className={className}>Username</button>
              <button className={className}>Logout</button>
            </div>
          ) : (
            <div className="flex flex-col items-start space-y-4">
              {!displayRegister && <button className={className} onClick={handleLoginClick}>Login</button>}
              {displayLogin && (
                <div style={{ marginLeft: '20px' }}>
                  <LoginForm onSuccess={handleLoginSuccess} onCancel={() => setDisplayLogin(false)}/>
                </div>
              )}
              {!displayLogin && <button className={className} onClick={handleRegisterClick}>Register</button>}
              {displayRegister && (
                <div style={{ marginLeft: '20px' }}>
                  { <RegisterForm onSuccess={handleRegisterSuccess} onCancel={() => setDisplayRegister(false)}/> }
                </div>
              )}
            </div>
          )}
        </div>
      );
}