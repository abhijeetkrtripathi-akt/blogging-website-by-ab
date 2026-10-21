// Seed Firestore from data/db.json using the Firebase CLI access token.
// Usage: node scripts/seed-firestore.mjs
import fs from "fs";
import path from "path";
import os from "os";

const PROJECT = "re-vision-blogger";
const DB = "(default)";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/${DB}/documents`;

const configPath = path.join(os.homedir(), ".config", "configstore", "firebase-tools.json");
const token = JSON.parse(fs.readFileSync(configPath, "utf8")).tokens.access_token;
if (!token) throw new Error("No Firebase access token. Run: npx firebase-tools login");

const db = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "db.json"), "utf8"));

function v(val) {
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") return { integerValue: String(val) };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(v) } };
  if (val && typeof val === "object") {
    const fields = {};
    for (const [k, x] of Object.entries(val)) fields[k] = v(x);
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

function doc(obj) {
  const fields = {};
  for (const [k, x] of Object.entries(obj)) fields[k] = v(x);
  return { fields };
}

async function put(collection, id, obj) {
  const url = `${BASE}/${collection}/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(doc(obj)),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${collection}/${id} -> ${res.status} ${text}`);
  }
  return res.json();
}

const uidMap = { u1: "hBpk0qZ7fOMxWfKGtxfXkvMfpM32", u2: "TsobccfUGZaikP6bRhdicgap5NQ2", u3: "hoEwfLRxA0O1m3iqaUhI85j3Wm32" };
const nameMap = { u1: "Alice Sharma", u2: "Bob Mehta", u3: "Carol Iyer" };

let count = 0;
for (const a of db.articles) {
  await put("articles", a.slug, a);
  count++;
}
console.log(`seeded ${count} articles`);

let cCount = 0;
for (const c of db.comments) {
  await put("comments", c.id, {
    articleSlug: c.articleSlug,
    userId: uidMap[c.userId] || c.userId,
    userName: nameMap[c.userId] || "Reader",
    text: c.text,
    createdAt: c.createdAt,
  });
  cCount++;
}
console.log(`seeded ${cCount} comments`);

let lCount = 0;
for (const l of db.likes) {
  const uid = uidMap[l.userId] || l.userId;
  await put("likes", `${l.articleSlug}_${uid}`, { articleSlug: l.articleSlug, userId: uid });
  lCount++;
}
console.log(`seeded ${lCount} likes`);

let bCount = 0;
for (const b of db.bookmarks) {
  const uid = uidMap[b.userId] || b.userId;
  await put("bookmarks", `${uid}_${b.articleSlug}`, { articleSlug: b.articleSlug, userId: uid });
  bCount++;
}
console.log(`seeded ${bCount} bookmarks`);