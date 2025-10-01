// server.cjs
const jsonServer = require("json-server");
const path = require("path");

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(jsonServer.bodyParser);

// نحط الـ API تحت /api
app.use("/api", router);

// ✅ في Vercel لازم نصدّر handler (دالة) تتلقى req/res
module.exports = (req, res) => app(req, res);
