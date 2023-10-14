const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const bcrypt = require('bcrypt');

// 회원가입 기능
router.post('/handleJoin', (req, res) => {
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
          res.send('<script>alert("가입을 축하합니다!");location.href="/"</script>')
        } else {
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
          res.send('<script>alert("가입을 축하합니다!");location.href="/"</script>')
        }else {
          res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
        }
      });
    }else{
      res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
    }
}
})
// // ID 중복 확인 
router.post('/checkUsername', (req, res) => {
  const { username } = req.body;
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
  });
});
// 로그인 기능
router.post('/handleLogin', (req, res) => {
  let { userId, userPw } = req.body
  let sql = 'select * from users where userId=? and userPw=MD5(?)'
  conn.query(sql, [userId, userPw], (err, rows) => {
    if (rows.length > 0) {
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
      req.session.user.userBirthdate = req.session.user.userBirthdate.toLocaleDateString()
      req.session.user.createdAt = req.session.user.createdAt.toLocaleDateString()
      req.session.save(() => {
        res.send('<script>alert("환영합니다!");location.href="/"</script>')
      })
    } else {
      res.send('<script>alert("아이디 혹은 비밀번호를 잘못입력하셨습니다!");location.href="/login"</script>')
    }
  })
})

// 회원탈퇴 + 정보수정 비밀번호 확인
router.post("/searchmypage", (req, res) => {
  let {userPw} = req.body
  let sql = 'select * from users where userId=? and userPw=MD5(?)'
  conn.query(sql, [req.session.user.userId,userPw], (err, rows)=>{
    if(rows.length>0){   
      res.send('<script>location.href="/updatemypage"</script>')
    }else{
      res.send('<script>alert("비밀번호가 다릅니다.");location.href="/pwCheck?button=1"</script>')
    }
  })
})
// 회원정보 수정
router.post("/updateuser", (req, res) => {
  let { upuserName, upuserEmail, upuserHeight, upuserWeight } = req.body;
  let sql = "UPDATE users SET userName = ?, userEmail = ?, userWeight = ?, userHeight = ?  WHERE userId = ?";
  conn.query(sql, [upuserName, upuserEmail, upuserWeight, upuserHeight, req.session.user.userId], (err, rows) => {
    if (err) {
      res.status(500).send('수정 실패!!!');
    } else {
      if (rows.affectedRows > 0) {
        req.session.user.userName = upuserName
        req.session.user.userEmail = upuserEmail
        req.session.user.userWeight= upuserWeight
        req.session.user.userHeight = upuserHeight 
        req.session.save(() => {
          res.send('<script>location.href="/mypage"</script>')
        })
      } else {
        res.status(400).send('수정 실패!!!');
      }
    }
  });
});
// 회원탈퇴
router.post("/deleteinfo", (req, res) => {
  let { userPw } = req.body;
  let sql = 'delete from users where userId=? and userPw=MD5(?)';
  conn.query(sql, [req.session.user.userId, userPw], (err, rows) => {
    if (err) {   
      console.error('데이터베이스 오류:', err);
      res.redirect('/');
    } else if (rows.affectedRows > 0) {
      req.session.destroy(err => {
        if (err) {
          console.error('세션 삭제 오류:', err);
          res.redirect('/');
        } else {
          console.log('세션 삭제 성공');
          res.redirect('/');
        }
      });
    } else {
      console.log('삭제실패');
      res.send('<script>alert("비밀번호가 다릅니다.");location.href="/pwCheck?button=2"</script>')
    }
  });
});
// 로그아웃
router.get("/logout", (req, res) => {
  req.session.user = "";
  req.session.save(()=>{
    res.send('<script>location.href="http://localhost:3333/"</script>')
  })
});

router.get("/iot",(req,res)=>{
  console.log(req.session.user)
  console.log('iot 버튼 클릭')
  // 먼저 데이터 베이스를 카운트 시키고 이걸 내가 가지고 온다
  // 이걸 다 더해서 시간을 표현하는 걸 적용시킨다
  // 
  req.session.user.userId
  let sql = 'select createdAt from sensordata where userId=?';
conn.query(sql, [req.session.user.userId], (err, rows) => {
    if (rows.length > 0) {
      console.log('데이터 연결 성공',rows)
    }else{
      console.log('데이터 못가져옴',err)
    }
  })

})


const app = express();
module.exports = router;