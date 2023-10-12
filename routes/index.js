const express = require("express");
const router = express.Router();
const path = require('path');

// 메인화면
router.get("/", (req, res) => {
  console.log('main')
  res.render("main",{obj : req.session.user});
});
// 리액트 + 유저 실시간 상태
router.get('/userstate', (req,res)=>{
  res.sendFile( path.join(__dirname, '../react-chair/build/index.html') )
  // res.sendFile(path.join(__dirname, 'react-chair', 
  // 'build', 'index.html'))
})

// 마이페이지 화면
router.get("/mypage", (req, res) => {
  console.log('mypage')
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
