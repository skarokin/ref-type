/*
*  Both displays the registration form and 
*  sends the registration request to the server.
*/
import { useState } from "react";
import axios from "axios";

export default function LoginForm({
    onSuccess,  
    onCancel
}: {
    onSuccess: () => void;
    onCancel: () => void;
}) {
    const [values, setValues] = useState({
        username: "",
        password: "",
        requestType: "register"
    });
    const [error, setError] = useState<boolean>(false);

    const displayError = () => {
      if (error) {
        return <p className="text-red-400 text-sm font-bold mb-2">User already exists</p>
      }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // call our server to log the user in
        axios.post("http://localhost:8081/", values)
        .then(res => {
            if (res.data.Status === "Success") {
                console.log("Registration success");
                onSuccess();
            } else {
                setError(true);
            }
        })
        .then(err => console.log(err));
    }

    return (
        <div className="flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-sm bg-slate-500 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Enter username" 
                name="username" 
                onChange={e => setValues({...values, username: e.target.value})}
              />          
            </div>
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-300 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Enter password" 
                name="password" 
                onChange={e => setValues({...values, password: e.target.value})}
              />
            </div>
            <div>
              {error && (
                <div>
                  {displayError()}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Register
              </button>
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
    );

}