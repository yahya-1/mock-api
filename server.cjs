// server.cjs
const jsonServer = require("json-server");
const path = require("path");

const app = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(jsonServer.bodyParser);

// ---------- Public Resolve ----------
app.get("/api/slider:resolve", (req, res) => {
    const db = router.db; // lowdb
    const areaId = req.query.areaId ? Number(req.query.areaId) : null;
    const lang = (req.query.lang || "ar").toLowerCase();
    const now = new Date();

    const inWindow = (item) =>
        (!item.publishAt || new Date(item.publishAt) <= now) &&
        (!item.expireAt || new Date(item.expireAt) > now);

    const scopeFilter = (item) =>
        areaId != null ? item?.scope?.areaId === areaId : !!item?.scope?.season;

    const items = db.get("sliderItems").filter((i) => !!i).value() || [];

    const enabled = items.filter(
        (i) => i.enabled && inWindow(i) && scopeFilter(i)
    );

    // أولوية الفيديو
    const videos = enabled
        .filter((i) => i.type === "video")
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    if (videos.length) {
        const v = videos[0];
        return res.json({
            mode: "video",
            item: {
                id: v.id,
                title: v?.content?.title?.[lang] ?? v?.content?.title?.ar ?? "",
                subtitle: v?.content?.subtitle?.[lang] ?? v?.content?.subtitle?.ar ?? "",
                cta: {
                    label: v?.content?.cta?.label?.[lang] ?? v?.content?.cta?.label?.ar ?? "",
                    url: v?.content?.cta?.url ?? ""
                },
                video: v?.media?.video || null
            }
        });
    }

    // صور إن مافيش فيديو
    const images = enabled
        .filter((i) => i.type === "image")
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((i) => ({
            id: i.id,
            title: i?.content?.title?.[lang] ?? i?.content?.title?.ar ?? "",
            description: i?.content?.description?.[lang] ?? i?.content?.description?.ar ?? "",
            cta: {
                label: i?.content?.cta?.label?.[lang] ?? i?.content?.cta?.label?.ar ?? "",
                url: i?.content?.cta?.url ?? ""
            },
            image: i?.media?.image || null,
            order: i.order || 0
        }));

    return res.json({ mode: "image", items: images });
});

// ---------- Admin CRUD & other routes ----------
app.use("/api", router);

// Vercel handler
module.exports = (req, res) => app(req, res);
