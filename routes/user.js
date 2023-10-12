const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const bcrypt = require('bcrypt');

// 회원가입 기능
router.post('/handleJoin', (req, res) => {
  console.log('handleJoin', req.body);
  let { userId, userPw, userName, userGender, em, bloodType, userBirthdate, cm, kg } = req.body;
  let userEmail = em + '@' + bloodType
  let userHeight = parseFloat(cm)
  let userWeight = parseFloat(kg)
  const createdAt = new Date();
  
  // const saltRounds = 10;
  // const salt = bcrypt.genSaltSync(saltRounds);
  // const hashedPassword = bcrypt.hashSync(userPw, salt);
  // 1) 내가 사용할 sql 쿼리문 작성
  let sql = "insert into users values(?,MD5(?),?,?,?,?,?,?,?)";
  // 2) DB 연동
  // conn.query(sql구문, sql구문 속 가변데이터(선택),연동 됐을 때 실행될 콜백함수)
  conn.query(sql, [userId, userPw, userName, userEmail, userGender, userBirthdate, userWeight, userHeight,createdAt], (err, rows) => {
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
  let sql = 'select * from users where userId=? and userPw=MD5(?)'
  conn.query(sql, [userId, userPw], (err, rows) => {

    console.log('rows ', rows)
    if (rows.length > 0) {  // rows -> 배열 배열.length -> 배열안에 몇개의 데이터가 있는지
      req.session.user= rows[0].userId
      req.session.save(() => {
        res.send('<script>alert("환영합니다!");location.href="/"</script>')
      })
    } else {
      console.log('로그인 실패')
      res.send('<script>alert("아이디 혹은 비밀번호를 잘못입력하셨습니다!");location.href="/login"</script>')
    }
  })
})
// router.post('/handleLogin', (req, res) => {
//   let { userId, userPw } = req.body
//   console.log(userId + ',' + userPw)

//   // SQL 정의
//   let sql = 'select * from users where userId=?'
//   conn.query(sql, [userId], (err, rows) => {

//     console.log('rows ', rows)
//     if (rows.length > 0) {  // rows -> 배열 배열.length -> 배열안에 몇개의 데이터가 있는지 
//       const userPassword = userPw
//       const storedHashedPassword = rows.userPw
//       bcrypt.compare(userPassword, storedHashedPassword, (err, result) => {
//         if (result === true) {
//             // 비밀번호 일치, 로그인 승인
//             req.session.user= rows[0]
//             req.session.save(() => {
//               res.send('<script>alert("환영합니다!");location.href="/"</script>')
//             })
//         } else {
//             // 비밀번호 불일치, 로그인 거부
//         }
//     });

//     } else {
//       console.log('로그인 실패')
//       res.send('<script>alert("아이디 혹은 비밀번호를 잘못입력하셨습니다!");location.href="/login"</script>')
//     }
//   })
// })
router.get("/logout", (req, res) => {

  // 1. 세션 삭제
  // 2. 메인페이지에 다시 접근
  req.session.user = "";

  req.session.save(()=>{
    res.send('<script>location.href="http://localhost:3333/"</script>')
  })
});
// const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
// const mysql = require('mysql');

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // MySQL 연결 설정
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'your_mysql_user',
//   password: 'your_mysql_password',
//   database: 'your_database_name',
// });

// db.connect(err => {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }
//   console.log('Connected to the database');
// });

// // ID 중복 확인 엔드포인트
// app.post('/checkUsername', (req, res) => {
//   const { username } = req.body;

//   // 데이터베이스에서 중복 확인
//   const sql = 'SELECT * FROM users WHERE username = ?';
//   db.query(sql, [username], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }

//     if (results.length > 0) {
//       res.json({ message: '이미 사용 중인 ID입니다.' });
//     } else {
//       res.json({ message: '사용 가능한 ID입니다.' });
//     }
//   });
// });
// 한명의 회원 정보 검색
router.get('/mypage',(req,res)=>{
  // req.session.user
  // let id = req.query.userId
  console.log('mypage접속'+req.session.user)
  let sql = 'select id from nodejs_member where id=?'
  conn.query(sql, [req.session.user], (err, rows)=>{
    if(rows.length>0){
      console.log('검색 성공!')
      res.render('select',{list:rows}) // 데이터 포함
    }else{
      console.log('검색 실패!!!')
      res.render('select') //데이터 포함 X
    }
  })
})

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = router;
