const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname)));


// ========================================
// MYSQL CONNECTION
// ========================================

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "real_estate project"
});


db.connect((err) => {

    if (err) {

        console.log("Database Error:", err);

    } else {

        console.log("MySQL Connected");

    }

});


// ========================================
// GET ALL PROPERTIES
// ========================================

app.get("/api/properties", (req, res) => {

    db.query(
        "SELECT * FROM properties",
        (err, results) => {

            if (err) {

                res.status(500).json({
                    message: "Failed to get properties"
                });

            } else {

                res.json(results);

            }

        }
    );

});


// ========================================
// ADD PROPERTY
// ========================================

app.post("/api/properties", (req, res) => {

    const { title, location, price } = req.body;


    const sql =
        "INSERT INTO properties (title, location, price) VALUES (?, ?, ?)";


    db.query(
        sql,
        [title, location, price],

        (err, results) => {

            if (err) {

                console.log("Add Property Error:", err);

                res.status(500).json({
                    message: "Failed to add property"
                });

            } else {

                res.json({
                    message: "Property added successfully"
                });

            }

        }
    );

});


// ========================================
// USER REGISTRATION
// ========================================

app.post("/register", (req, res) => {

    const { name, email, password } = req.body;


    // Check whether all fields are entered

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please enter all fields"
        });

    }


    // Check whether email already exists

    const checkSql =
        "SELECT * FROM users WHERE email = ?";


    db.query(
        checkSql,
        [email],

        (err, results) => {

            if (err) {

                console.log("Check User Error:", err);

                return res.status(500).json({
                    message: "Database Error"
                });

            }


            // Email already exists

            if (results.length > 0) {

                return res.status(400).json({
                    message: "Email already registered"
                });

            }


            // Insert new user

            const insertSql =
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";


            db.query(
                insertSql,
                [name, email, password],

                (err, results) => {

                    if (err) {

                        console.log("Registration Error:", err);

                        return res.status(500).json({
                            message: "Registration Failed"
                        });

                    }


                    res.json({
                        message: "Registration Successful"
                    });

                }
            );

        }
    );

});
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, results) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Server error"
            });
        }

        if (results.length > 0) {
            res.json({
                message: "Login successful"
            });
        } else {
            res.json({
                message: "Invalid email or password"
            });
        }

    });
});


// ========================================
// START SERVER
// ========================================

app.listen(3000, () => {

    console.log(
        "Server running on http://localhost:3000"
    );

});

