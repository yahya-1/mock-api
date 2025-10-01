// scripts/seed.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { faker } from "@faker-js/faker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");
const rootDir = path.join(__dirname, "..");

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), "utf-8");
}

function seed({ usersCount = 20, postsCount = 80, seedValue = 123 } = {}) {
  faker.seed(seedValue);

  const users = Array.from({ length: usersCount }).map((_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: i % 5 === 0 ? "admin" : "user",
    createdAt: faker.date.recent({ days: 30 }).toISOString()
  }));

  const posts = Array.from({ length: postsCount }).map((_, i) => ({
    id: i + 1,
    userId: users[faker.number.int({ min: 0, max: users.length - 1 })].id,
    title: faker.lorem.sentence({ min: 3, max: 7 }),
    body: faker.lorem.paragraph(),
    createdAt: faker.date.recent({ days: 15 }).toISOString()
  }));

  // احفظ النسخ المنفصلة (اختياري — مفيدة للمراجعة)
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  writeJson(path.join(dataDir, "users.json"), users);
  writeJson(path.join(dataDir, "posts.json"), posts);

  // احفظ ملف موحّد لـ json-server
  writeJson(path.join(rootDir, "db.json"), { users, posts });

  console.log(`Seeded: ${users.length} users, ${posts.length} posts (seed=${seedValue})`);
}

seed();
