// 외부 DB와 연결하려면 npm 모듈이 필요함 - mysql2
// 1) 설치 : npm i mysql2
// 2) require
const mysql = require("mysql2");

// 3) 나의 DB 정보 기재
let conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  port: 3306,
  database: "nodejs",
});

conn.connect();

module.exports = conn;
// 내 mysql 정보를 가지고 연결한 conn을 모듈화하겠다!
