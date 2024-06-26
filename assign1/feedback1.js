// class형으로 변경
const http = require("http");
const url = require("url");

class MyApp {
  constructor() {
    this.routes = {
      GET: {},
    };
  }

  handleRequest = (req, res) => {
    const method = req.method; // HTTP 메소드
    const path = url.parse(req.url).pathname; // 클라이언트가 요청한 URL 경로

    if (this.routes[method][path]) {
      this.routes[method][path](req, res); // 해당 요청에 대한 핸들러가 있으면 그 핸들러로
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  };

  listen = (port) => {
    const server = http.createServer(this.handleRequest);
    server.listen(port, () => {
      console.log(`listen port: ${port}`);
    });
  };

  get = (path, handler) => {
    this.routes["GET"][path] = handler;
  };
}

module.exports = MyApp;
