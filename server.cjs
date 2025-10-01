// server.cjs  (CommonJS middleware for json-server)
module.exports = function (req, res, next) {
  // ?delay=200 → يحاكي تأخير الشبكة
  const delay = Number(req.query.delay || 0);
  if (delay) return setTimeout(next, delay);

  // ?error=503 → يرجّع كود خطأ مقصود
  if (req.query.error) {
    return res.status(Number(req.query.error)).json({ message: "forced error (mock)" });
  }

  // مثال توكين (اختياري – معطّل افتراضياً):
  // if (req.path.startsWith("/api") && req.headers.authorization !== "Bearer mock-token-123") {
  //   return res.status(401).json({ message: "unauthorized (mock)" });
  // }

  next();
};
