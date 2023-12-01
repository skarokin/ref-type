import axios from 'axios';

export default function handleLogout(setAuth: React.Dispatch<React.SetStateAction<boolean>>) {
    axios.post('http://localhost:8081/', { requestType: 'logout' })
    .then(res => {
        if(res.data.Status === 'Success') {
            console.log('Successfully logged out');
            setAuth(false);
        } else {
            console.log('Error logging out');
        }
    })
    .catch(err => console.log(err));
}