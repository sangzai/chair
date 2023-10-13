const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const bcrypt = require('bcrypt');

// 회원가입 기능
router.post('/handleJoin', (req, res) => {
  console.log('handleJoin', req.body);
  const Pw = req.body.userPw
  const rePw = req.body.repw
  if (Pw != rePw) {
    res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
  } else {
    const emi = req.body.em
    const blood = req.body.bloodType
    const mail = req.body.ail
    if (emi != '' && mail == '' && blood != 'none') {
      let { userId, userPw, repw, userName, userGender, em, bloodType, userBirthdate, cm, kg } = req.body;
      let userEmail = em + '@' + bloodType
      let userHeight = parseFloat(cm)
      let userWeight = parseFloat(kg)
      const createdAt = new Date();
      let sql = "insert into users values(?,MD5(?),?,?,?,?,?,?,?)";
      conn.query(sql, [userId, userPw, userName, userEmail, userGender, userBirthdate, userWeight, userHeight, createdAt], (err, rows) => {
        if (rows) {
          console.log('rows : ', rows)
          res.send('<script>alert("가입을 축하합니다!");location.href="/"</script>')
          console.log('blood')
        } else {
          console.log('err : ', err)
          res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
        }
      });
    } else if (emi != '' && mail != '' && blood == 'none') {
      let { userId, userPw, repw, userName, userGender, em, ail, userBirthdate, cm, kg } = req.body;
      let userEmail = em + '@' + ail
      let userHeight = parseFloat(cm)
      let userWeight = parseFloat(kg)
      const createdAt = new Date();
      let sql = "insert into users values(?,MD5(?),?,?,?,?,?,?,?)";
      conn.query(sql, [userId, userPw, userName, userEmail, userGender, userBirthdate, userWeight, userHeight, createdAt], (err, rows) => {
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
    } else {
      console.log('최종단계실패')
      res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
    }
  }
})

// 로그인 기능
router.post('/handleLogin', (req, res) => {
  let { userId, userPw } = req.body
  console.log(userId + ',' + userPw)
  let sql = 'select * from users where userId=? and userPw=MD5(?)'
  conn.query(sql, [userId, userPw], (err, rows) => {
    if (rows.length > 0) {  // rows -> 배열 배열.length -> 배열안에 몇개의 데이터가 있는지
      req.session.user = {
        'userId': rows[0].userId,
        'userName': rows[0].userName,
        'userEmail': rows[0].userEmail,
        'userGender': rows[0].userGender,
        'userBirthdate': rows[0].userBirthdate,
        'userWeight': rows[0].userWeight,
        'userHeight': rows[0].userHeight,
        'createdAt': rows[0].createdAt
      }
      req.session.user.userBirthdate = req.session.user.userBirthdate.toLocaleDateString()
      req.session.user.createdAt = req.session.user.createdAt.toLocaleDateString()
      req.session.save(() => {
        res.send('<script>alert("환영합니다!");location.href="/"</script>')
      })
    } else {
      console.log('로그인 실패')
      res.send('<script>alert("아이디 혹은 비밀번호를 잘못입력하셨습니다!");location.href="/login"</script>')
    }
  })
})

// 비밀번호 확인
router.post("/searchmypage", (req, res) => {
  // console.log(req.session.user);
  let { userPw } = req.body
  let sql = 'select * from users where userId=? and userPw=MD5(?)'
  conn.query(sql, [req.session.user.userId, userPw], (err, rows) => {
    if (rows.length > 0) {
      res.send('<script>location.href="/updatemypage"</script>')
    } else {
      console.log('검색 실패!!!')
    }
  })
})
// 마이페이지 회원정보 수정
// router.post("/updateuser",(req,res)=>{
// let {userName,userEmail,userHeight,userWeight} = req.body;
// let sql = "UPDATE users SET userName = ?, userEmail = ?, userHeight = ?, userWeight = ? WHERE userId = ?";

// conn.query(sql, [userName,userEmail,userHeight,userWeight,req.session.user.userId], (err, rows)=>{
//   if (rows.affectedRows > 0){   
//     console.log('수정 성공!')
//   }else{
//     console.log('수정 실패!!!')
//   }
// })
// })
router.post("/updateuser", (req, res) => {
  let { upuserName, upuserEmail, upuserHeight, upuserWeight } = req.body;
  console.log(req.body);
  let sql = "UPDATE users SET userName = ?, userEmail = ?, userWeight = ?, userHeight = ?  WHERE userId = ?";
  conn.query(sql, [upuserName, upuserEmail, upuserWeight, upuserHeight, req.session.user.userId], (err, rows) => {
    if (err) {
      console.error('수정 실패!!!', err);
      res.status(500).send('수정 실패!!!');
    } else {
      if (rows.affectedRows > 0) {
        console.log('수정 성공!');

        req.session.user.userName = upuserName
        req.session.user.userEmail = upuserEmail
        req.session.user.userWeight = upuserWeight
        req.session.user.userHeight = upuserHeight
        req.session.save(() => {
          res.send('<script>location.href="/mypage"</script>')
        })

      } else {
        console.log('수정 실패!!!');
        res.status(400).send('수정 실패!!!');
      }
    }
  });
});




// 로그아웃
router.get("/logout", (req, res) => {
  req.session.user = "";

  req.session.save(() => {
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
    if (username.length >= 5) {
      if (rows.length > 0) {
        res.json({ message: '이미 사용 중인 ID입니다.' })
      }
      else {
        res.json({ message: '사용 가능한 ID입니다.' })
      }
    } else {
      res.json({ message: '5글자 이상 입력해주세요.' })
    }
  });
});

// 통계


module.exports = router;
