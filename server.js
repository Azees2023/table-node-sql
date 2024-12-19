const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();

const connection = mysql.createConnection({
    host: 'mysql-2b4e55a1-azeesrahmaann77-eb6a.l.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_0ZPMmt3lCVXCnkBfR1j',
    database: 'defaultdb',
    port: 19677,
    ssl: {
        rejectUnauthorized: false // Enable SSL if required
    }
});

// MySQL Connection
/* const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sys",
}); */

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database.");
  }
});

// Routes
// 1. Create a new record
app.post("/api/synonyms", (req, res) => {
  const { synonym, altsynonyms, techword } = req.body;
  const sql = "INSERT INTO synonyms (synonym, altsynonyms, techword) VALUES (?, ?, ?)";
  db.query(sql, [synonym, altsynonyms, techword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Record added successfully." });
  });
});

// 2. Read all records
app.get("/api/synonyms", (req, res) => {
  const sql = "SELECT * FROM synonyms";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. Update a record
app.put("/api/synonyms", (req, res) => {
  const { oldSynonym, oldAltSynonyms, oldTechWord, synonym, altsynonyms, techword } = req.body;
  const sql = `
    UPDATE synonyms
    SET synonym = ?, altsynonyms = ?, techword = ?
    WHERE synonym = ? AND altsynonyms = ? AND techword = ?
  `;
  db.query(
    sql,
    [synonym, altsynonyms, techword, oldSynonym, oldAltSynonyms, oldTechWord],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Record updated successfully." });
    }
  );
});

// 4. Delete a record
app.delete("/api/synonyms", (req, res) => {
  const { synonym, altsynonyms, techword } = req.body;
  const sql = "DELETE FROM synonyms WHERE synonym = ? AND altsynonyms = ? AND techword = ?";
  db.query(sql, [synonym, altsynonyms, techword], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Record deleted successfully." });
  });
});

// Start the server
const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
