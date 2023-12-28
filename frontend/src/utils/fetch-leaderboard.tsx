/*
*  This file fetches leaderboard data and displays it
*/

import axios from "axios";

export default async function FetchLeaderboard() {

    try {
        console.log("fetching leaderboard...");
        const res = await axios.get("http://localhost:8081/leaderboard");

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