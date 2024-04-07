import myApp from "./feedback2.mjs";

const app = new myApp();
const port = 3000;

app.listen(port);

app.get("/assignment1", (req, res) => {
  // HTTP 상태 코드 200 : success
  res.writeHead(200, { "Content-Type": "application/json" }); // 응답 유형 지정
  res.end(JSON.stringify({ message: "헬로우 월드 🤗" }));
});
