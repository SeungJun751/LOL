const express = require("express");
const router = express.Router();
const { connectDB, sql } = require("../db/config");

router.post("/", async (req, res) => {
  const { mainRole, subRole, playstyle, difficulty } = req.body;

  // 필수 항목 체크
  if (!mainRole || !playstyle || !difficulty) {
    return res.status(400).send("모든 옵션을 선택하세요.");
  }

  try {
    const pool = await connectDB();

    // 기본 쿼리 설정
    let query = `
      SELECT C.name, C.main_role, C.sub_role, PS.difficulty, PS.play_tendency, PS.meta_tier
      FROM Champions C
      JOIN Play_Style PS ON C.champion_id = PS.champion_id
      WHERE C.main_role = @mainRole
      AND PS.play_tendency = @playstyle
      AND PS.difficulty = @difficulty
    `;

    // subRole이 있을 경우 쿼리 수정
    if (subRole) {
      query += " AND (C.sub_role = @subRole OR C.sub_role IS NULL)";
    } else {
      query += " AND (C.sub_role IS NULL)";
    }

    // 메타 티어 필터링 추가
    query += " AND PS.meta_tier BETWEEN 1 AND 2"; // 메타 티어 1~2

    // 쿼리 실행
    const result = await pool
      .request()
      .input("mainRole", sql.VarChar, mainRole)
      .input("subRole", sql.VarChar, subRole || null)  // subRole이 없다면 null 처리
      .input("playstyle", sql.VarChar, playstyle)
      .input("difficulty", sql.VarChar, difficulty)
      .query(query);

    console.log("Query result:", result.recordset); // 쿼리 결과 확인

    // 결과가 없으면 404 에러 처리
    if (result.recordset.length === 0) {
      return res.status(404).send("조건에 맞는 챔피언이 없습니다.");
    }

    res.json(result.recordset); // 챔피언 데이터 반환
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).send("서버 오류: 추천 데이터를 가져올 수 없습니다.");
  }
});

module.exports = router;
