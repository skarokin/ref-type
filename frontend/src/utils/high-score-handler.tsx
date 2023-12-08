/*
*  This file is used to update and fetch high scores from the database
*  RETURNS:
*   - auth: boolean (whether or not the user is authenticated)
*   - username: string (the username of the user)
*   - highScore: number (the high score of the user)
*/

import axios from "axios";

// retrieves high score
export const fetchHighScore = async () => {
    const res = await axios.get("http://localhost:8081/");
    if (res.data.Status === "Success") {
        return {
            auth: true,
            username: res.data.username,
            highScore: res.data.top15_wpm,
        };
    } else {
        return {
            auth: false
        }
    }
};

// updates high score
export const updateHighScore = async (username: string, wpm: number, accuracy: number) => {
    const res = await axios.post("http://localhost:8081/", {
        requestType: "update",
        username: username,
        top15_wpm: wpm,
        top15_accuracy: accuracy
    });
    return res.data.Status === "Success";
}