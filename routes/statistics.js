// const express = require("express");
// const router = express.Router();
// const conn = require("../config/database");
// const bcrypt = require('bcrypt');
// const { Connection } = require("mysql2/typings/mysql/lib/Connection");

// router.get("/statistics", (req, res) => {
//     conn.query("SELECT * FROM sensordata", (err, rows, fields) => {
//         if (err) {
//             console.log("Database error: " + err);
//             return res.status(500).json({ error: "데이터베이스 오류" });
//         }

//         if (rows.length > 0) {
//             res.json({ data: rows }); // 데이터를 JSON 형식으로 클라이언트에 반환
//         } else {
//             res.json({ data: [] }); // 빈 배열 반환 또는 다른 처리
//         }
//     });
// });

// // router.post('/checkUsername', (req, res) => {
// //     const { username } = req.body;
// //     // 데이터베이스에서 중복 확인
// //     const sql = 'select * from users where userId=?';
// //     conn.query(sql, [username], (err, rows) => {
// //       if (username.length >= 5){
// //         if (rows.length > 0){
// //           res.json({ message: '이미 사용 중인 ID입니다.' })  
// //         }
// //         else{
// //           res.json({ message: '사용 가능한 ID입니다.' })
// //         }
// //       }else{
// //         res.json({ message: '5글자 이상 입력해주세요.' })
// //       }
// //     });
// //   });


// module.exports = router;

// 10-14 데이터 연결 시험
const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const bcrypt = require('bcrypt');

// 통계데이터 연결
router.post('/userstatistics', (req, res) => {
    const { selDate } = req.body;
    const pattern = '%' + selDate + '%';
    const sql = 'SELECT COUNT(*) AS count FROM sensordata WHERE createdAt LIKE ?'; // COUNT(*)를 사용하여 레코드 수를 가져옴
    console.log(selDate)
    conn.query(sql, [pattern], (err, rows) => {
        if (!err) {
            const count = rows[0].count; // 레코드 수는 rows[0].count에 저장됨
            if (count > 0) {
                res.json({ sensorCount: '정보 있음.', count: count });
                
            } else {
                res.json({ sensorCount: '정보 없음.', count: 0 });
            }
        } else {
            // 오류 처리
            res.status(500).json({ error: '데이터베이스 오류.' });
        }
    });
  });
  
  //user정보 bmi 변환 
  

  module.exports = router;