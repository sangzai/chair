const express = require("express");
const router = express.Router();
const conn = require("../config/database");
const bcrypt = require('bcrypt');

// 통계데이터 연결 
router.post('/userstatistics', (req, res) => {
    const { selDate } = req.body;
    const pattern = '%' + selDate + '%';
    const sql = 'SELECT postureInfo FROM postureclassification WHERE postureDate LIKE ? AND userId = ?';

    conn.query(sql, [pattern, req.session.user.userId], (err, rows) => {
        if (err) {
            console.error('데이터베이스 쿼리 오류:', err);
            return res.status(500).json({ error: '데이터베이스 치우친오류.' });
        }

        const postureInfoList = rows.map(row => row.postureInfo);

        const postureTypes = {
            'correct': 'correct',
            'left': 'left',
            'right': 'right',
            'turtle': 'turtle',
            'bent': 'bent',
            'unflat': 'unflat',
        };
        // Initialize posture type counts
        const postureCounts = {
            'correct': 0, 
            'left': 0, 
            'right': 0, 
            'turtle': 0, 
            'bent': 0, 
            'unflat': 0,
        };

        // Parse and classify posture information
        for (const posture of postureInfoList) {
            postureCounts[postureTypes[posture]]++;
        }

        const totalSeconds = Object.values(postureCounts).reduce((acc, count) => acc + count, 0);

        // 전체 시간을 시, 분, 초로 변환
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;


        console.log('43 line',  Object.values(postureCounts).reduce((acc, count) => acc + count, 0))

        res.json({
            // sensorCount: '정보 있음.',
            postureCounts: postureCounts,
            // totalTime: `${hours}시간 ${minutes}분 ${seconds}초`
        });
        console.log(postureCounts);
    });
});

// 실시간 연결
router.get('/data', (req, res) => {
    const userId = req.session.user.userId;
    conn.query('SELECT * FROM sensordata WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId], (err, result) => {
        if (err) {
            console.error('데이터베이스 쿼리 오류:', err);
            return res.status(500).json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' });
        }
        res.json(result[0]);
    });
});

module.exports = router;
