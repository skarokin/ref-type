import express from 'express';
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

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
// in real app, the password should be stored in .env file
const db = mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "",
    database: "ref_type",
});

// run server on port 8081
app.listen(8081, () => {
    console.log("Server is running on port 8081");
});

/* 
*  ================================================================================
*  FUNCTIONS FOR GET REQUESTS
*  ================================================================================
*/

// function to verify user is logged in
const verifyUser = (req, res, next) => {
    // read the JWT token form the cookies sent with the request
    const token = req.cookies.token;
    if (!token) {
        return res.json({Error: "User not authenticated"});
    } 
    // verify the JWT token using the secret key
    // in practice, the secret key should be stored in .env file
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.json({Error: "Token is not valid"});
        }
        // if token is valid, username from the decoded payload is attached to request object
        // this allows subseqeuent middleware functions and route handlers to access the username
        req.username = decoded.username;
        // passes control to the next middleware function in the stack
        next();
    });
};

// GET api for user verification and fetching top15/top60
// uses middleware verifyUser and fetchTopScores
app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", username: req.username});
});

// POST api for registration, login, logout, and updating top15/top60
app.post('/', (req, res) => {
    const requestType = req.body.requestType;
    switch(requestType) {
        case "register":
            registerHandler(req, res);
            break;
        case "login":
            loginHandler(req, res);
            break;
        case "logout":
            logoutHandler(req, res);
            break;
        case "update":
            updateScoresHandler(req, res);
            break;
        default:
            return res.json({Error: "Invalid request type"});
    }
});

/* 
*  ================================================================================
*  FUNCTIONS FOR POST REQUESTS
*  ================================================================================
*/

const registerHandler = (req, res) => {
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
        const sqlCreateUser = "INSERT INTO userinfo (`username`, `password`) VALUES (?, ?)";
        bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
            if (err) {
                return res.json({Error: "Error hashing password"});
            }
            const values = [
                req.body.username,
                hash
            ];
            db.query(sqlCreateUser, values, (err, data) => {
                if (err) {
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
                    const token = jwt.sign({username}, "jwt-secret-key", {expiresIn: '1d'});
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