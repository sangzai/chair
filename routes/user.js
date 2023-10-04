const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 회원가입 기능
router.post('/handleJoin',(req,res)=>{
    console.log('handleJoin',req.body);
    let { userid, userpw, username,radiogroup,em,bloodType,birthdate, cm, kg} = req.body;
    let email = em+'@'+bloodType
    // 1) 내가 사용할 sql 쿼리문 작성
    let sql = "insert into u_member values(?,?,?,?,?,?,?,?)";
  
    // 2) DB 연동
    // conn.query(sql구문, sql구문 속 가변데이터(선택),연동 됐을 때 실행될 콜백함수)
    conn.query(sql, [userid, userpw, username, radiogroup,email,birthdate, cm, kg], (err, rows)=>{
      if (rows){
        console.log('rows : ', rows)
        res.send('<script>alert("가입을 축하합니다!");location.href="/"</script>')
      }else{
        console.log('err : ', err)
        res.send('<script>alert("회원가입에 실패했습니다..");location.href="/join"</script>')
      }
    });
  
  })
  router.post('/checkid',(req,res)=>{
    console.log('/checkid',req.body);
  })
module.exports = router;
