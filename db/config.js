const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // MSSQL on Azure requires this
    trustServerCertificate: true, // Development only
  },
};

const connectDB = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Connected to MSSQL");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, sql };
