const express = require("express");
const router = express.Router();
const path = require('path');



// 메인화면
router.get("/", (req, res) => {
  res.render("main",{obj : req.session.user});
});

// 회원가입 화면
router.get("/join", (req, res) => {
  res.render("join");
});

// 로그인 화면
router.get("/login", (req, res) => {
  res.render('login');
});

// 마이페이지 화면
router.get("/mypage", (req, res) => {
  res.render("mypage",{obj : req.session.user});
});

// 회원정보수정 + 탈퇴 비밀번호 입력
router.get("/pwCheck", (req, res) => {
  console.log("정보수정");
  console.log(req.session.user);
  res.render("pwCheck",{obj : req.session.user});
});

// 회원정보수정
router.get("/updatemypage",(req,res)=>{
  res.render("updatemypage",{obj:req.session.user})
})

// 회원탈퇴 화면
router.get("/delete", (req, res) => {
  res.render("delete",{obj : req.session.user});
});

// 건강정보 화면
router.get("/healthinfo", (req, res) => {
  res.render("healthinfo",{obj : req.session.user});
});

// 유저상태 화면
router.get("/userstate", (req, res) => {
  res.render("userstate",{obj : req.session.user});
});

// 유저 통계 화면
router.get("/statistics", (req, res) => {
  res.render("statistics",{obj : req.session.user});
});

// 환경설정 화면
router.get("/option", (req, res) => {
  res.render("option",{obj : req.session.user});
});

// ID 찾기
router.get("/idSearch",(req, res) => {
  res.render("idSearch");
});
// 방석관리 화면
// router.get("/iot", (req, res) => {
//   res.render("iot",{obj : req.session.user});
// });

router.get("/buyitem",(req, res) => {
  res.render("buyitem",{obj : req.session.user});
});

router.get("/order",(req, res) => {
  res.render("order",{obj : req.session.user});
});
module.exports = router;
