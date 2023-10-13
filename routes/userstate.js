const conn = require("../config/database");
const express = require("express");
const router = express.Router();
const userstate = require("../userstate.js"); // userstate 모듈 불러오기

router.get("/userstate", (req, res) => {
  userstate.conn((error, dataFromDatabase) => {
    if (error) {
      // 오류 처리
      res.status(500).send("Database error");
      return;
    }
    // 데이터를 렌더링
    res.render("userstate", { data: dataFromDatabase }); // 예시: 렌더링 템플릿 사용
  });
});





module.exports = router;
