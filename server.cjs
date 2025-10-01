// server.cjs
const jsonServer = require("json-server");
const path = require("path");
const fs = require("fs");

// 1) جهّز ملف /tmp/db.json
const SRC_DB = path.join(__dirname, "db.json");
const TMP_DIR = "/tmp";
const TMP_DB = path.join(TMP_DIR, "db.json");

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
if (!fs.existsSync(TMP_DB)) {
    // انسخ نسخة البداية من db.json إلى /tmp
    fs.copyFileSync(SRC_DB, TMP_DB);
}

// 2) json-server على ملف /tmp
const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const router = jsonServer.router(TMP_DB); // ← هنا

app.use(middlewares);
app.use(jsonServer.bodyParser);

// (اختياري) مسار resolve إن كنت ضايفه
// app.get("/api/slider:resolve", ...);

app.use("/api", router);

// Vercel handler
module.exports = (req, res) => app(req, res);
