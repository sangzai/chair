const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const nunjucks = require("nunjucks");
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
// 5-1. 리액트 프로젝트 경로 설정

const path = require('path');
// app.use(express.static(path.join(__dirname, 
//      'react-chair', 'build')));
// app.use(express.json());


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

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
// app.use(express.static(__dirname + "/react-chair/build"));
-
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
// app.use( '/react', express.static( path.join(__dirname, 'react-chair/build') ))
app.use("/user", userRouter);

app.listen(app.get("port"), () => {
  console.log(app.get("port") + "번 포트에서 대기 중..");
});
