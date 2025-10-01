const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  static: null, // ما بدنا ملفات ستاتيك
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// تقدر تقلّب الباث إذا بدك: /api/* أو بدون /api
server.use("/api", (req, res, next) => next(), router);

module.exports = server;
