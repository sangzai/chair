const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const bcrypt = require('bcrypt');

// 통계데이터 연결
router.post('/userstatistics', (req, res) => {
  const { selDate } = req.body;
  const pattern = '%' + selDate + '%';
  const sql = 'SELECT COUNT(*) AS count FROM sensordata WHERE createdAt LIKE ? and userId = ?';

  console.log(selDate);

  conn.query(sql, [pattern, req.session.user.userId], (err, rows) => {
      if (!err) {
          const count = rows[0].count;
          if (count > 0) {
              res.json({ sensorCount: '정보 있음.', count: count });
          } else {
              res.json({ sensorCount: '정보 없음.', count: 0 });
          }
      } else {
          res.status(500).json({ error: '데이터베이스 오류.' });
      }
  });
});

// 실시간 연결
router.get('/data', (req, res) => {
    const userId = req.session.user.userId; // 원하는 userID로 설정
    
    conn.query('SELECT * FROM sensordata WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId], (err, result) => {
      if (err) {
        console.error('데이터베이스 쿼리 오류:', err);
        return res.status(500).json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' });
      }
      res.json(result[0]);
    });
  });

  module.exports = router; 

