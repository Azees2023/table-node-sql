const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// MySQL Connection
/* const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sys",
}); */

db.connect((err) => {
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
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
