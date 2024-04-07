// Goal: build simple Node.js library like express.js (by using only standard library)
// TODO1: can handle ‘GET’ request
// TODO2: can listen on port given as parameter

const myApp = require("./feedback1");

const app = new myApp();
const port = 3000;

app.listen(port);

app.get("/assignment1", (req, res) => {
  // HTTP 상태 코드 200 : success
  res.writeHead(200, { "Content-Type": "application/json" }); // 응답 유형 지정
  res.end(JSON.stringify({ message: "헬로우 월드 🤗" }));
});
