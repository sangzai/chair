const express = require("express");
const router = express.Router();

// 메인화면
router.get("/", (req, res) => {
  res.render("main");
});

// 마이페이지 화면
router.get("/mypage", (req, res) => {
  res.render('mypage');
});

// 로그인 화면
router.get("/login", (req, res) => {
  res.render('login');
});

// 회원탈퇴 화면
router.get("/delete", (req, res) => {
  res.render('delete');
});

// 회원가입 화면
router.get("/join", (req, res) => {
  res.render("join");
});

// 건강정보 화면
router.get("/info", (req, res) => {
  res.render("infomation");
});

// 방석관리 화면
router.get("/seat", (req, res) => {
  res.render("seat");
});

// 유저상태 화면
router.get("/userstate", (req, res) => {
  res.render("userstate");
});

// 환경설정 화면
router.get("/option", (req, res) => {
  res.render("option");
});



module.exports = router;
