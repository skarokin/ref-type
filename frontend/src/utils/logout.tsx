import axios from 'axios';

export default function handleLogout(setAuth: React.Dispatch<React.SetStateAction<boolean>>) {
    axios.post('https://us-central1-steam-link-409216.cloudfunctions.net/api/logout')
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