const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const bcrypt = require('bcrypt');

// 회원가입 기능
router.post('/handleJoin', (req, res) => {
  console.log('handleJoin', req.body);
  const Pw = req.body.userPw
  const rePw = req.body.repw
  if (Pw != rePw){
    res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
  }else{
    const emi = req.body.em
    const blood = req.body.bloodType
    const mail = req.body.ail
    if (emi !=''&& mail==''&& blood!='none'){
      let { userId, userPw,repw, userName, userGender, em, bloodType, userBirthdate, cm, kg } = req.body;
      let userEmail = em + '@' + bloodType
      let userHeight = parseFloat(cm)
      let userWeight = parseFloat(kg)
      const createdAt = new Date();
      let sql = "insert into users values(?,MD5(?),?,?,?,?,?,?,?)";
      conn.query(sql, [userId, userPw, userName, userEmail, userGender, userBirthdate, userWeight, userHeight,createdAt], (err, rows) => {
        if (rows) {
          console.log('rows : ', rows)
          res.send('<script>alert("가입을 축하합니다!");location.href="/"</script>')
          console.log('blood')
        } else {
          console.log('err : ', err)
          res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
        }
      });
    }else if(emi !=''&& mail !=''&& blood=='none'){
      let { userId, userPw,repw, userName, userGender, em, ail, userBirthdate, cm, kg } = req.body;
      let userEmail = em + '@' + ail
      let userHeight = parseFloat(cm)
      let userWeight = parseFloat(kg)
      const createdAt = new Date();
      let sql = "insert into users values(?,MD5(?),?,?,?,?,?,?,?)";
      conn.query(sql, [userId, userPw, userName, userEmail, userGender, userBirthdate, userWeight, userHeight,createdAt], (err, rows) => {
        if (rows) {
          console.log('rows : ', rows)
          console.log('mail')
          res.send('<script>alert("가입을 축하합니다!");location.href="/"</script>')
        } else {
          console.log('err : ', err)
          console.log('mail실패')

          res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
        }
      });
    }else{
      console.log('최종단계실패')
      res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
    }

  // 1) 내가 사용할 sql 쿼리문 작성
  
  // 2) DB 연동
}
})

// 로그인 기능
router.post('/handleLogin', (req, res) => {
  let { userId, userPw } = req.body
  console.log(userId + ',' + userPw)
  // SQL 정의
  let sql = 'select * from users where userId=? and userPw=MD5(?)'
  conn.query(sql, [userId, userPw], (err, rows) => {
    if (rows.length > 0) {  // rows -> 배열 배열.length -> 배열안에 몇개의 데이터가 있는지
      req.session.user= {
        'userId': rows[0].userId,
        'userName': rows[0].userName,
        'userEmail': rows[0].userEmail,
        'userGender': rows[0].userGender,
        'userBirthdate': rows[0].userBirthdate,
        'userWeight': rows[0].userWeight,
        'userHeight': rows[0].userHeight,
        'createdAt': rows[0].createdAt
      }
      
      req.session.save(() => {
        res.send('<script>alert("환영합니다!");location.href="/"</script>')
      })
    } else {
      console.log('로그인 실패')
      res.send('<script>alert("아이디 혹은 비밀번호를 잘못입력하셨습니다!");location.href="/login"</script>')
    }
  })
})

// 마이페이지 회원정보
// router.get("/searchmypage", (req, res) => {
//   // console.log(req.session.user);
//   //  
//   let sql = 'select * from users where userId=?'
//   conn.query(sql, [req.session.user], (err, rows)=>{
//     if(rows.length>0){   
//       console.log("검색 성공",{list:rows});
//       // res.render('mypage') // 데이터 포함
//       res.send('<script>location.href="/mypage"</script>')
//       // res.send('<script>alert("환영합니다!");location.href="/mypage"</script>')
      
//     }else{
//       console.log('검색 실패!!!')
//       // res.render('select') //데이터 포함 X
//     }
//   })
//   console.log('mypage접속')
// });
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
const app = express();


// // ID 중복 확인 엔드포인트
router.post('/checkUsername', (req, res) => {
  const { username } = req.body;

  // 데이터베이스에서 중복 확인
  const sql = 'select * from users where userId=?';
  conn.query(sql, [username], (err, rows) => {
    if (username.length >= 5){
      if (rows.length > 0){
        res.json({ message: '이미 사용 중인 ID입니다.' })  
      }
      else{
        res.json({ message: '사용 가능한 ID입니다.' })
      }
    }else{
      res.json({ message: '5글자 이상 입력해주세요.' })
    }

    // if (err) {
    //   console.error(err);
    //   res.status(500).json({ error: 'Internal server error' });
    //   return;
    // }

    // if (rows.length > 0) {
    //   res.json({ message: '이미 사용 중인 ID입니다.' });
    // } else {
    //   console.log(rows)
    //   res.json({ message: '사용 가능한 ID입니다.' });
    // }
  });
});


// 서버 시작
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


module.exports = router;
