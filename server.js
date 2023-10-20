const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const statisicsRouter = require("./routes/statistics");
const path = require('path');
const cors = require("cors");
const http = require('http');
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.set("port", process.env.PORT || 3333);

app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
// 웹 소켓 서버 포트 : 3334
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3334 });

wss.on('listening', () => {
    console.log('웹 소켓 서버 시작!');
});

wss.on('connection', (ws) => {
    console.log('클라이언트가 연결되었습니다.');

    ws.on('message', (message) => {
        console.log(`수신한 메시지: ${message}`);
        ws.send('반가워요'+message);
    });
    ws.on('close', () => {
        console.log('클라이언트가 연결을 종료했습니다.');
    });
});



app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use(
  session({
    httpOnly: true,
    resave: false,
    secret: "secret",
    store: new fileStore(),
    saveUninitialized: false,
  })
);


app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/statistics", statisicsRouter);
app.listen(app.get("port"), () => {
  console.log(app.get("port") + "번 포트에서 대기 중..");
});