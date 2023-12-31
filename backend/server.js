import express from 'express';
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const salt = 10;

const app = express();
app.use(express.json());

// allow http://localhost:3000 to access this server 
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
}));
app.use(cookieParser());

// create a connection to the mysql database    
const db = mysql.createConnection({ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});

// run server on port 8081
app.listen(8081, () => {
    console.log("Server is running on port 8081");
});

/* 
*  ================================================================================
*  FUNCTIONS FOR GET REQUESTS (they are up here because they are middleware functions)
*  ================================================================================
*/

// function to verify user is logged in
const verifyUser = (req, res, next) => {
    // read the JWT token form the cookies sent with the request
    console.log("verifyUser is running...")
    const token = req.cookies.token;
    if (!token) {
        return res.json({Error: "User not authenticated"});
    } 
    // verify the JWT token using the secret key (stored in .env file)
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({Error: "Token is not valid"});
        }

        if (!decoded.username || decoded.username.trim() === "") {
            return res.json({Error: "Invalid username"});
        }
        // if token is valid, username from the decoded payload is attached to request object
        // this allows subseqeuent middleware functions and route handlers to access the username
        req.username = decoded.username;
        // pass control to the next middleware function in the stack
        next();
    });
};

// function to fetch top15/top60 scores from database
// when control is passed from verifyUser to this function, username is attached to the request object
const fetchTopScores = (req, res, next) => {
    // if user is not logged in, we can't fetch scores
    console.log("fetchTopScores is running...")
    if (!req.username) {
        return res.json({Error: "User not authenticated"});
    }

    const sqlFetchTopScores = "SELECT top15_wpm, top15_accuracy FROM userinfo WHERE username = ?";
    db.query(sqlFetchTopScores, [req.username], (err, data) => {
        if (err) {
            return res.json({Error: "Error querying database"});
        }
        // if user exists
        if (data.length > 0) {
            req.top15_wpm = data[0].top15_wpm;
            req.top15_accuracy = data[0].top15_accuracy;
            next();
        } else {
            return res.json({Error: "User does not exist"});
        }
    });
};

// GET api for user verification and fetching wpm/accuracy of top15/top60
// uses middleware verifyUser and fetchTopScores
app.get('/userinfo', verifyUser, fetchTopScores, (req, res) => {
    return res.json({
        Status: "Success", 
        username: req.username,
        top15_wpm: req.top15_wpm,
        top15_accuracy: req.top15_accuracy
    });
});

// leaderboard function; fetches top 10 scores from database every 5 minutes
// and stores it as an array 
let leaderboard = [];
let lastUpdate = Date.now();
const updateInterval = 5*60*1000;

function updateLeaderboard() {
    const sqlFetchTopScores = "SELECT username, top15_wpm, top15_accuracy FROM userinfo ORDER BY top15_wpm DESC LIMIT 10";
    db.query(sqlFetchTopScores, (err, data) => {
        if (err) {
            console.error("Error querying database", err);
            return;
        } 

        leaderboard = data;
        lastUpdate = Date.now();

        setTimeout(updateLeaderboard, updateInterval); // update leaderboard every 5 minutes
    });
};

updateLeaderboard();

// GET api for fetching current leaderboard status 
app.get('/leaderboard', (req, res ) => {
    return res.json({Status: "Success", leaderboard: leaderboard});
});

app.get('/timeLeft', (req, res) => {
    return res.json({Status: "Success", timeLeft: updateInterval - (Date.now() - lastUpdate)})
});

/*
*  ================================================================================
*  POST APIS FOR LOGIN, REGISTER, LOGOUT, UPDATE
*  ================================================================================
*/

app.post('/login', (req, res) => {
    loginHandler(req, res);
});

app.post('/register', (req, res) => {
    registerHandler(req, res);
});

app.post('/logout', (req, res) => {
    logoutHandler(req, res);
});

app.post('/update', (req, res) => {
    updateScoresHandler(req, res);
})

/* 
*  ================================================================================
*  FUNCTIONS FOR POST REQUESTS
*  ================================================================================
*/

const registerHandler = (req, res) => {

    if (!req.body.username || !req.body.password) {
        return res.json({Error: "Missing username or password"});
    }
    
    const sqlCheckExistingUser = "SELECT * FROM userinfo WHERE username = ?";

    db.query(sqlCheckExistingUser, [req.body.username], (err, data) => {
        if (err) {
            return res.json({Error: "Error querying database"});
        }
        // if user already exists
        if (data.length > 0) {
            return res.json({Error: "Username already exists"});
        }
        // create user
        const sqlCreateUser = "INSERT INTO userinfo (`username`, `password`, `top15_wpm`, `top15_accuracy`) VALUES (?, ?, ?, ?)";
        bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
            if (err) {
                return res.json({Error: "Error hashing password"});
            }
            const values = [
                req.body.username,
                hash,
                0,
                0,
            ];
            db.query(sqlCreateUser, values, (err, data) => {
                if (err) {
                    console.error(err);
                    return res.json({Error: "Error creating user"});
                }
                return res.json({Status: "Success"});
            });
        });
    });

}

const loginHandler = (req, res) => {
    const sqlAuthenticateUser = "SELECT * FROM userinfo WHERE username = ?";

    db.query(sqlAuthenticateUser, [req.body.username],  (err, data) => {
        if (err) {
            return res.json({Error: "Error querying database"});
        }
        // if username exists
        if (data.length > 0) {
            // compute the inputted password
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) {
                    return res.json({Error: "Error comparing passwords"});
                }
                if (response) {
                    // generate a token (in real app, secret key should be an environment variable)
                    const username = data[0].username;
                    const token = jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
                    // store the token in a cookie
                    res.cookie("token", token);
                    return res.json({Status: "Success"});
                } else {
                    return res.json({Error: "Wrong password"});
                }
            });
        } else {
            return res.json({Error: "Username does not exist"});
        }
    });
}

const logoutHandler = (req, res) => {
    res.clearCookie("token");
    return res.json({Status: "Success"});
}

const updateScoresHandler = (req, res) => {
    const sqlUpdateScores = "UPDATE userinfo SET top15_wpm = ?, top15_accuracy = ? WHERE username = ?";
    const values = [
        req.body.top15_wpm,
        req.body.top15_accuracy,
        req.body.username
    ];
    db.query(sqlUpdateScores, values, (err, data) => {
        if (err) {
            return res.json({Error: "Error updating scores"});
        }
        return res.json({Status: "Success"});
    });
}