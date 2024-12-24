const express = require("express");
const router = express.Router();
const { connectDB, sql } = require("../db/config");

router.get("/", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Champions");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching champions:", error);
    res.status(500).send("Error fetching data");
  }
});

module.exports = router;
