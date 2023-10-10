const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 회원가입 기능
router.post('/handleJoin', (req, res) => {
  console.log('handleJoin', req.body);
  let { userId, userPw, userName, gender, em, bloodType, birth, cm, kg } = req.body;
  let email = em + '@' + bloodType
  let height = parseFloat(cm)
  let weight = parseFloat(kg)
  // 1) 내가 사용할 sql 쿼리문 작성
  let sql = "insert into USERS values(?,?,?,?,?,?,?,?)";
  // 2) DB 연동
  // conn.query(sql구문, sql구문 속 가변데이터(선택),연동 됐을 때 실행될 콜백함수)
  conn.query(sql, [userId, userPw, userName, email, gender, birth, weight, height], (err, rows) => {
    if (rows) {
      console.log('rows : ', rows)
      res.send('<script>alert("가입을 축하합니다!");location.href="/"</script>')
    } else {
      console.log('err : ', err)
      res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
    }
  });

})
router.post('/checkid', (req, res) => {
  console.log('/checkid', req.body);
})
// 로그인 기능
router.post('/handleLogin', (req, res) => {
  let { userId, userPw } = req.body
  console.log(userId + ',' + userPw)

  // SQL 정의
  let sql = 'select * from USERS where userId=? and userPw=?'
  conn.query(sql, [userId, userPw], (err, rows) => {

    console.log('rows ', rows)
    if (rows.length > 0) {  // rows -> 배열 배열.length -> 배열안에 몇개의 데이터가 있는지
      req.session.u_id = rows[0].id
      req.session.save(() => {
        res.send('<script>alert("환영합니다!");location.href="/"</script>')
      })
    } else {
      console.log('로그인 실패')
      res.send('<script>alert("아이디 혹은 비밀번호를 잘못입력하셨습니다!");location.href="/login"</script>')
    }
  })
})

module.exports = router;
