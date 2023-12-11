const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/// Database connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "exandb"
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });


  app.post('/signup', (req, res) => {

    const sql = "INSERT INTO registration (name, email, password) VALUES (?, ?, ?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
      
    ];

    connection.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.json("Error");
        }
        console.log("Data inserted:", data);
        return res.json(data);
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM registration WHERE email = ? AND password = ?";
    const values = [email, password];

    connection.query(sql, values, (err, results) => {
        console.log(results);
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json({ error: "Error querying database" });
        }

        if (results.length === 1) {
            return res.status(200).json({ message: "Login successful" });
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    });
});



app.listen(8081, ()=>{
    console.log("listening");
})
