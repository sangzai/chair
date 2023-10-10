// 외부 DB와 연결하려면 npm 모듈이 필요함 - mysql2
// 1) 설치 : npm i mysql2
// 2) require
const mysql = require("mysql2");

// 3) 나의 DB 정보 기재
let conn = mysql.createConnection({
  host: "project-db-campus.smhrd.com",
  user: "campus_23IS_IoT1_hack_1",
  password: "smhrd1",
  port: 3307,
  database: "campus_23IS_IoT1_hack_1",
});

conn.connect();

module.exports = conn;
// 내 mysql 정보를 가지고 연결한 conn을 모듈화하겠다!
