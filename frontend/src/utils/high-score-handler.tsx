/*
*  This file is used to update and fetch high scores from the database
*  RETURNS:
*   - auth: boolean (whether or not the user is authenticated)
*   - username: string (the username of the user)
*   - highScore: number (the high score of the user)
*   - Status: string (whether or not request to server was successful)
*/

import axios from "axios";

// retrieves high score
export const fetchHighScore = async () => {
    return axios.get("http://localhost:8081/")
      .then((res) => {
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
      });
};

// updates high score
export const updateHighScore = (username: string, wpm: number, accuracy: number) => {
    return axios.post("http://localhost:8081/", {
      requestType: "update",
      username: username,
      top15_wpm: wpm,
      top15_accuracy: accuracy
    })
    .then((res) => {
      if (res.data.Status === "Success") {
        return true;
      } else {
        return false;
      }
    });
}