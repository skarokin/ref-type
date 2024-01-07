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
        axios.post(`${process.env.REACT_APP_FIRE_CLOUD}/register`, values)
        .then(res => {
            if (res.data.Status === "Success") {
                console.log("Registration success");
                onSuccess();
            } else {
                console.log(res.data.Error);
                setError(true);
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="absolute flex flex-col items-center justify-center w-64">
          <form onSubmit={handleSubmit} className="w-full max-w-sm bg-bgColor ring-2 ring-inset ring-subColor/50 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-textCorrect text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-subColor leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Enter username" 
                name="username" 
                onChange={e => setValues({...values, username: e.target.value})}
              />          
            </div>
            <div className="mb-6">
              <label className="block text-textCorrect text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-subColor mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                className="bg-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Register
              </button>
              <button 
                className="absolute top-0 right-0 block rounded px-4 py-2 transition-colors duration-300 ease-in-out text-subColor hover:text-mainColor"
                onClick={onCancel}
                style={{fontSize: '1.5rem'}}
              >
                  &times;
              </button>
            </div>
          </form>
        </div>
    );

}