const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_DIR = path.join(__dirname, "site");
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

app.use(express.json({ limit: "2mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "re-vision-blogger-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_PATH)) return;
  const now = new Date().toISOString();
  const pw = bcrypt.hashSync("password123", 10);
  const db = {
    users: [
      { id: "u1", name: "Alice Sharma", email: "alice@example.com", passwordHash: pw, bio: "Frontend engineer writing about JavaScript, React, and the web.", avatar: "https://i.pravatar.cc/120?img=47" },
      { id: "u2", name: "Bob Mehta", email: "bob@example.com", passwordHash: pw, bio: "Productivity nerd and lifestyle writer. Coffee first, words second.", avatar: "https://i.pravatar.cc/120?img=12" },
      { id: "u3", name: "Carol Iyer", email: "carol@example.com", passwordHash: pw, bio: "Travel photographer chasing light and cheap flights.", avatar: "https://i.pravatar.cc/120?img=32" },
    ],
    articles: [
      {
        id: "a1",
        slug: "getting-started-with-javascript",
        title: "Getting Started with JavaScript",
        excerpt: "A beginner-friendly guide to JS fundamentals, from variables to functions.",
        coverImage: "https://picsum.photos/seed/js/1200/600",
        category: "Tech",
        tags: ["JavaScript", "Beginners", "Web Dev"],
        authorName: "Alice Sharma",
        authorId: "u1",
        authorBio: "Frontend engineer writing about JavaScript, React, and the web. I believe the best way to learn is to build.",
        authorAvatar: "https://i.pravatar.cc/120?img=47",
        publishedAt: "2026-10-10T09:00:00.000Z",
        updatedAt: "2026-10-15T12:30:00.000Z",
        famous: true,
        featured: true,
        tocEnabled: true,
        videoUrl: "",
        content: `
          <p>JavaScript is the language of the web. It runs in every browser and powers everything from small interactions to full applications.</p>
          <h2 id="why-javascript">Why JavaScript?</h2>
          <p>It is the only language browsers understand natively, and it has a huge ecosystem. You can build websites, servers, mobile apps, and more.</p>
          <p>Start with the basics: <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener">MDN</a> is the best reference.</p>
          <h2 id="variables">Variables and types</h2>
          <p>Use <code>const</code> by default and <code>let</code> when the value must change.</p>
          <ul>
            <li><strong>String</strong> — text such as "hello"</li>
            <li><strong>Number</strong> — values like 42 or 3.14</li>
            <li><strong>Boolean</strong> — true or false</li>
          </ul>
          <img src="https://picsum.photos/seed/code/900/450" alt="A laptop showing code on screen" />
          <h2 id="functions">Functions</h2>
          <p>Functions let you reuse logic. They can take arguments and return values.</p>
          <pre><code>function greet(name) {
  return "Hello, " + name;
}</code></pre>
          <h2 id="loops">Loops and arrays</h2>
          <p>Arrays hold ordered lists. Use <code>map</code>, <code>filter</code>, and <code>forEach</code> to work with them.</p>
          <ol>
            <li>Create an array</li>
            <li>Loop over it</li>
            <li>Transform it</li>
          </ol>
          <h2 id="next-steps">Next steps</h2>
          <p>Build a small project, then learn the DOM and fetch. Practice beats theory every time.</p>
        `,
      },
      {
        id: "a2",
        slug: "lifestyle-habits-better-focus",
        title: "10 Lifestyle Habits for Better Focus",
        excerpt: "Small, repeatable changes that improve daily productivity and attention.",
        coverImage: "https://picsum.photos/seed/ls/1200/600",
        category: "Lifestyle",
        tags: ["Focus", "Habits", "Productivity"],
        authorName: "Bob Mehta",
        authorId: "u2",
        authorBio: "Productivity nerd and lifestyle writer. I test habits for 30 days before writing about them.",
        authorAvatar: "https://i.pravatar.cc/120?img=12",
        publishedAt: "2026-10-12T08:00:00.000Z",
        updatedAt: "2026-10-13T10:00:00.000Z",
        famous: true,
        featured: true,
        tocEnabled: true,
        videoUrl: "",
        content: `
          <p>Focus is not a talent; it is a set of habits. These are the ten that made the biggest difference for me.</p>
          <h2 id="sleep">1. Protect your sleep</h2>
          <p>No screen for thirty minutes before bed. Keep the room dark and cool.</p>
          <h2 id="morning">2. Start with one clear task</h2>
          <p>Decide the night before what the first task is. Do it before email.</p>
          <h2 id="breaks">3. Take real breaks</h2>
          <p>Stand up, walk, look outside. A five-minute break every hour beats a two-hour crash.</p>
          <ul>
            <li>Water nearby</li>
            <li>Phone in another room</li>
            <li>One tab at a time</li>
          </ul>
          <img src="https://picsum.photos/seed/focus/900/450" alt="A tidy desk with a notebook and coffee" />
          <h2 id="environment">4. Design your environment</h2>
          <p>Make the good habit easy and the bad habit hard. Put the book on the pillow.</p>
          <h2 id="review">5. Review weekly</h2>
          <p>Ask what worked, what failed, and what you will change. Keep it to five minutes.</p>
        `,
      },
      {
        id: "a3",
        slug: "top-travel-destinations-2026",
        title: "Top 5 Travel Destinations 2026",
        excerpt: "Five places worth planning a trip around this year.",
        coverImage: "https://picsum.photos/seed/tr/1200/600",
        category: "Travel",
        tags: ["Travel", "2026", "Destinations"],
        authorName: "Carol Iyer",
        authorId: "u3",
        authorBio: "Travel photographer chasing light and cheap flights. I have visited 34 countries and still pack too much.",
        authorAvatar: "https://i.pravatar.cc/120?img=32",
        publishedAt: "2026-10-14T07:30:00.000Z",
        updatedAt: "2026-10-14T07:30:00.000Z",
        famous: true,
        featured: true,
        tocEnabled: true,
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        content: `
          <p>These five destinations balance cost, food, and scenery. Each one rewards slow travel.</p>
          <h2 id="japan">1. Japan</h2>
          <p>Spring for the blossoms, autumn for the colours. Rail passes make it easy.</p>
          <h2 id="portugal">2. Portugal</h2>
          <p>Lisbon and Porto are affordable, beautiful, and full of pastries.</p>
          <h2 id="vietnam">3. Vietnam</h2>
          <p>Street food, motorbikes, and landscapes that change every hundred kilometres.</p>
          <ul>
            <li>Best value: northern mountains</li>
            <li>Best food: Hoi An</li>
            <li>Best coast: Da Nang</li>
          </ul>
          <img src="https://picsum.photos/seed/travel/900/450" alt="A mountain lake at sunrise" />
          <h2 id="morocco">4. Morocco</h2>
          <p>Marrakech for the medina, the Atlas for the quiet.</p>
          <h2 id="iceland">5. Iceland</h2>
          <p>Expensive but unforgettable. Rent a car and drive the ring road.</p>
        `,
      },
      {
        id: "a4",
        slug: "understanding-async-await",
        title: "Understanding Async/Await",
        excerpt: "A practical deep dive into asynchronous JavaScript.",
        coverImage: "https://picsum.photos/seed/async/1200/600",
        category: "Tech",
        tags: ["JavaScript", "Async", "Promises"],
        authorName: "Alice Sharma",
        authorId: "u1",
        authorBio: "Frontend engineer writing about JavaScript, React, and the web. I believe the best way to learn is to build.",
        authorAvatar: "https://i.pravatar.cc/120?img=47",
        publishedAt: "2026-10-16T11:00:00.000Z",
        updatedAt: "2026-10-17T09:15:00.000Z",
        famous: false,
        featured: false,
        tocEnabled: true,
        videoUrl: "",
        content: `
          <p>Async/await makes promises readable. Under the hood it is still promises.</p>
          <h2 id="promises">Promises recap</h2>
          <p>A promise represents a value that will exist later. It can resolve or reject.</p>
          <h2 id="syntax">Async functions</h2>
          <p>Mark a function <code>async</code> and it always returns a promise.</p>
          <pre><code>async function load() {
  const res = await fetch("/api/articles");
  return res.json();
}</code></pre>
          <h2 id="errors">Error handling</h2>
          <p>Use <code>try/catch</code>. Do not swallow errors silently.</p>
          <ul>
            <li>Wrap network calls</li>
            <li>Show a user-friendly message</li>
            <li>Log the real error</li>
          </ul>
          <h2 id="parallel">Parallel work</h2>
          <p><code>Promise.all</code> runs independent tasks together.</p>
          <h2 id="pitfalls">Common pitfalls</h2>
          <p>Forgetting <code>await</code> is the most common bug. Lint for it.</p>
        `,
      },
      {
        id: "a5",
        slug: "morning-routines-that-work",
        title: "Morning Routines That Work",
        excerpt: "Build a routine you can actually stick to.",
        coverImage: "https://picsum.photos/seed/mr/1200/600",
        category: "Lifestyle",
        tags: ["Morning", "Routine"],
        authorName: "Bob Mehta",
        authorId: "u2",
        authorBio: "Productivity nerd and lifestyle writer. I test habits for 30 days before writing about them.",
        authorAvatar: "https://i.pravatar.cc/120?img=12",
        publishedAt: "2026-10-18T06:45:00.000Z",
        updatedAt: "2026-10-18T06:45:00.000Z",
        famous: false,
        featured: false,
        tocEnabled: false,
        videoUrl: "",
        content: `
          <p>The best morning routine is the one you repeat. Keep it short and boring.</p>
          <h2 id="simple">Keep it simple</h2>
          <p>Three steps: water, light, movement. That is enough to start.</p>
          <p>Add coffee only after you have moved.</p>
        `,
      },
      {
        id: "a6",
        slug: "budget-travel-tips",
        title: "Budget Travel Tips",
        excerpt: "See the world without breaking the bank.",
        coverImage: "https://picsum.photos/seed/bt/1200/600",
        category: "Travel",
        tags: ["Budget", "Travel"],
        authorName: "Carol Iyer",
        authorId: "u3",
        authorBio: "Travel photographer chasing light and cheap flights. I have visited 34 countries and still pack too much.",
        authorAvatar: "https://i.pravatar.cc/120?img=32",
        publishedAt: "2026-10-19T10:00:00.000Z",
        updatedAt: "2026-10-19T10:00:00.000Z",
        famous: false,
        featured: false,
        tocEnabled: false,
        videoUrl: "",
        content: `
          <p>Travel cheaply by being flexible and cooking some of your own meals.</p>
          <h2 id="flights">Book flights early</h2>
          <p>Set alerts and travel midweek. Avoid school holidays.</p>
          <h2 id="food">Eat like a local</h2>
          <p>Markets and small restaurants cost less and taste better.</p>
        `,
      },
    ],
    comments: [
      { id: "c1", articleSlug: "getting-started-with-javascript", userId: "u2", text: "This is the clearest intro I have read. Bookmarked!", createdAt: "2026-10-15T10:00:00.000Z" },
      { id: "c2", articleSlug: "getting-started-with-javascript", userId: "u3", text: "The loops section finally made arrays click for me.", createdAt: "2026-10-16T14:20:00.000Z" },
      { id: "c3", articleSlug: "lifestyle-habits-better-focus", userId: "u1", text: "The one-tab rule is brutal but effective.", createdAt: "2026-10-14T09:10:00.000Z" },
    ],
    likes: [
      { userId: "u1", articleSlug: "lifestyle-habits-better-focus" },
      { userId: "u2", articleSlug: "getting-started-with-javascript" },
      { userId: "u3", articleSlug: "getting-started-with-javascript" },
    ],
    bookmarks: [{ userId: "u1", articleSlug: "top-travel-destinations-2026" }],
    createdAt: now,
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDb(db) {
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
}

function publicUser(u) {
  if (!u) return null;
  return { id: u.id, name: u.name, email: u.email, bio: u.bio, avatar: u.avatar };
}

function currentUser(req) {
  if (!req.session.userId) return null;
  const db = readDb();
  return db.users.find((u) => u.id === req.session.userId) || null;
}

function requireAuth(req, res, next) {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: "Sign in required" });
  req.user = user;
  next();
}

function articleSummary(db, a, userId) {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    category: a.category,
    tags: a.tags,
    authorName: a.authorName,
    authorAvatar: a.authorAvatar,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    famous: !!a.famous,
    featured: !!a.featured,
    tocEnabled: !!a.tocEnabled,
    likesCount: db.likes.filter((l) => l.articleSlug === a.slug).length,
    commentsCount: db.comments.filter((c) => c.articleSlug === a.slug).length,
    liked: userId ? db.likes.some((l) => l.articleSlug === a.slug && l.userId === userId) : false,
    bookmarked: userId ? db.bookmarks.some((b) => b.articleSlug === a.slug && b.userId === userId) : false,
  };
}

ensureDb();

app.use(express.static(SITE_DIR, { extensions: ["html"] }));

// Fallback for unknown article files so the page can show a proper not-found state.
app.get("/articles/:file", (req, res, next) => {
  if (!req.params.file.endsWith(".html")) return next();
  const slug = req.params.file.replace(/\.html$/, "");
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Article — Re-Vision Blogger</title>
  <link rel="stylesheet" href="../styles.css" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>window.__ARTICLE_SLUG__ = ${JSON.stringify(slug)};</script>
  <script type="text/babel" src="../shared.jsx"></script>
  <script type="text/babel" src="../article.jsx"></script>
</body>
</html>`);
});

// ---------------- Auth ----------------
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password are required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Invalid email address" });
  if (String(password).length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
  const db = readDb();
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) return res.status(400).json({ error: "Email already registered" });
  const user = {
    id: "u" + crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    passwordHash: bcrypt.hashSync(String(password), 10),
    bio: "",
    avatar: "https://i.pravatar.cc/120?u=" + encodeURIComponent(email),
  };
  db.users.push(user);
  writeDb(db);
  req.session.userId = user.id;
  res.status(201).json({ user: publicUser(user) });
});

app.post("/api/auth/signin", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
  const db = readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !bcrypt.compareSync(String(password), user.passwordHash)) return res.status(400).json({ error: "Invalid email or password" });
  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

app.post("/api/auth/signout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/auth/me", (req, res) => {
  res.json({ user: publicUser(currentUser(req)) });
});

// ---------------- Articles ----------------
app.get("/api/articles", (req, res) => {
  const db = readDb();
  const userId = req.session.userId;
  res.json(db.articles.map((a) => articleSummary(db, a, userId)));
});

app.get("/api/articles/:slug", (req, res) => {
  const db = readDb();
  const article = db.articles.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: "Article not found" });
  const userId = req.session.userId;
  res.json({
    ...articleSummary(db, article, userId),
    content: article.content,
    videoUrl: article.videoUrl,
    authorBio: article.authorBio,
    authorId: article.authorId,
  });
});

app.get("/api/articles/:slug/related", (req, res) => {
  const db = readDb();
  const article = db.articles.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: "Article not found" });
  const userId = req.session.userId;
  const same = db.articles.filter((a) => a.slug !== article.slug && a.category === article.category);
  const others = db.articles.filter((a) => a.slug !== article.slug && a.category !== article.category);
  const related = [...same, ...others].slice(0, 3);
  res.json(related.map((a) => articleSummary(db, a, userId)));
});

app.post("/api/articles/:slug/like", requireAuth, (req, res) => {
  const db = readDb();
  const article = db.articles.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: "Article not found" });
  const idx = db.likes.findIndex((l) => l.articleSlug === article.slug && l.userId === req.user.id);
  let liked;
  if (idx >= 0) { db.likes.splice(idx, 1); liked = false; }
  else { db.likes.push({ userId: req.user.id, articleSlug: article.slug }); liked = true; }
  writeDb(db);
  res.json({ liked, likesCount: db.likes.filter((l) => l.articleSlug === article.slug).length });
});

app.post("/api/articles/:slug/bookmark", requireAuth, (req, res) => {
  const db = readDb();
  const article = db.articles.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: "Article not found" });
  const idx = db.bookmarks.findIndex((b) => b.articleSlug === article.slug && b.userId === req.user.id);
  let bookmarked;
  if (idx >= 0) { db.bookmarks.splice(idx, 1); bookmarked = false; }
  else { db.bookmarks.push({ userId: req.user.id, articleSlug: article.slug }); bookmarked = true; }
  writeDb(db);
  res.json({ bookmarked });
});

app.get("/api/articles/:slug/comments", (req, res) => {
  const db = readDb();
  const article = db.articles.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: "Article not found" });
  const comments = db.comments
    .filter((c) => c.articleSlug === article.slug)
    .map((c) => {
      const u = db.users.find((x) => x.id === c.userId);
      return { id: c.id, text: c.text, createdAt: c.createdAt, userId: c.userId, userName: u ? u.name : "Unknown", avatar: u ? u.avatar : "" };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(comments);
});

app.post("/api/articles/:slug/comments", requireAuth, (req, res) => {
  const db = readDb();
  const article = db.articles.find((a) => a.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: "Article not found" });
  const text = String((req.body && req.body.text) || "").trim();
  if (!text) return res.status(400).json({ error: "Comment cannot be empty" });
  if (text.length > 1000) return res.status(400).json({ error: "Comment is too long (max 1000 characters)" });
  const comment = { id: "c" + crypto.randomUUID(), articleSlug: article.slug, userId: req.user.id, text, createdAt: new Date().toISOString() };
  db.comments.push(comment);
  writeDb(db);
  res.status(201).json({ id: comment.id, text: comment.text, createdAt: comment.createdAt, userId: req.user.id, userName: req.user.name, avatar: req.user.avatar });
});

app.delete("/api/comments/:id", requireAuth, (req, res) => {
  const db = readDb();
  const idx = db.comments.findIndex((c) => c.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "Comment not found" });
  if (db.comments[idx].userId !== req.user.id) return res.status(403).json({ error: "You can only delete your own comments" });
  db.comments.splice(idx, 1);
  writeDb(db);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log("Re-Vision Blogger running at http://localhost:" + PORT);
});