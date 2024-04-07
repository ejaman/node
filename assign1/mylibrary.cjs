const http = require("http"); // 웹 서버 생성 & HTTP 요청 처리
const url = require("url"); // URL 파싱 & 분석

function myApp() {
  // 각 메소드에 대한 경로와 핸들러 함수 저장
  const routes = {
    GET: {},
  };

  // 클라이언트에서 요청이 오면 이 함수 호출
  function app(req, res) {
    const method = req.method; // HTTP 메소드
    const path = url.parse(req.url).pathname; // 클라이언트가 요청한 URL 경로

    if (routes[method][path]) {
      routes[method][path](req, res); // 해당 요청에 대한 핸들러가 있으면 핸들러를
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" }); // 없으면 404 not found
      res.end("Not Found");
    }
  }

  app.listen = function (port) {
    // createServer: 서버를 생성 & 지정된 포트에서 서버를 실행
    http.createServer(app).listen(port, () => {
      console.log(`listen port: ${port}`);
    });
  };

  // get 요청 처리
  // 요청된 경로에 대한 핸들러 routes에 등록
  app.get = function (path, handler) {
    routes["GET"][path] = handler;
  };

  return app;
}

module.exports = myApp;
