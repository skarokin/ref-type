/*
*  This file fetches leaderboard data and displays it
*/

import axios from "axios";

export async function fetchLeaderboard() {

    try {
        const res = await axios.get(`${process.env.REACT_APP_FIRE_CLOUD}/leaderboard`);

        if (res.data.Status === "Success") {
            return {
                Status: res.data.Status,
                leaderboard: res.data.leaderboard,
            }
        } else {
            console.log("Error fetching leaderboard...");
            return;
        }
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        return {
            error: "Failed to fetch leaderboard",
        };
    }

}

export async function fetchTimeLeft() {

    try {
        const res = await axios.get(`${process.env.REACT_APP_FIRE_CLOUD}/timeLeft`);

        if (res.data.Status === "Success") {
            return {
                Status: res.data.Status,
                timeLeft: res.data.timeLeft,
            }
        } else {
            console.log("Error fetching time left...");
            return;
        }
    } catch (err) {
        console.error("Error fetching time left:", err);
        return {
            error: "Failed to fetch time left",
        };
    }

}