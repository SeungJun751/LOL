const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./db/config");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 데이터베이스 연결
connectDB();

// 라우터 설정
const championsRouter = require("./routes/champions");
const recommendRouter = require("./routes/recommend");

app.use("/api/champions", championsRouter);
app.use("/api/recommend", recommendRouter);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
