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
  try {
    console.log("fetching high score...")
    const res = await axios.get("https://us-central1-steam-link-409216.cloudfunctions.net/api/userinfo");

    if (res.data.Status === "Success") {
      console.log("high score fetched...");
      return {
        auth: true,
        username: res.data.username,
        highScore: res.data.top15_wpm,
      };
    } else {
      console.log("user not logged in...");
      return {
        auth: false,
      };
    }
  } catch (error) {
    console.error("Error fetching high score:", error);
    return {
      auth: false,
      error: "Failed to fetch high score",
    };
  }
};

// updates high score
export const updateHighScore = async (username: string, wpm: number, accuracy: number) => {
  try {
    const res = await axios.post("https://us-central1-steam-link-409216.cloudfunctions.net/api/update", {
      username: username,
      top15_wpm: wpm,
      top15_accuracy: accuracy,
    });

    return res.data.Status === "Success";
  } catch (error) {
      console.error("Error updating high score:", error);
      return false; 
  }
};