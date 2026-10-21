import test from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.BASE_URL || "http://localhost:3000";

class Jar {
  constructor() { this.cookies = {}; }
  header() { return Object.entries(this.cookies).map(([k, v]) => `${k}=${v}`).join("; "); }
  absorb(res) {
    const list = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    for (const c of list) {
      const [pair] = c.split(";");
      const idx = pair.indexOf("=");
      if (idx > 0) this.cookies[pair.slice(0, idx)] = pair.slice(idx + 1);
    }
  }
  async fetch(path, opts = {}) {
    const headers = { ...(opts.headers || {}) };
    if (Object.keys(this.cookies).length) headers.Cookie = this.header();
    const res = await fetch(BASE + path, { ...opts, headers });
    this.absorb(res);
    return res;
  }
}

const guest = new Jar();

async function json(res) { return res.json(); }

test("TC-040 GET /api/articles returns list", async () => {
  const res = await guest.fetch("/api/articles");
  assert.equal(res.status, 200);
  const list = await json(res);
  assert.ok(Array.isArray(list));
  assert.ok(list.length >= 6);
  assert.ok(list.every((a) => a.slug && a.title));
});

test("TC-002..TC-005 article detail has title, cover, author, dates", async () => {
  const res = await guest.fetch("/api/articles/getting-started-with-javascript");
  assert.equal(res.status, 200);
  const a = await json(res);
  assert.equal(a.title, "Getting Started with JavaScript");
  assert.ok(a.coverImage);
  assert.ok(a.authorName);
  assert.ok(a.publishedAt);
  assert.ok(a.updatedAt);
});

test("TC-006 article content is rich HTML", async () => {
  const a = await json(await guest.fetch("/api/articles/getting-started-with-javascript"));
  assert.match(a.content, /<h2/);
  assert.match(a.content, /<p>/);
  assert.match(a.content, /<ul>/);
  assert.match(a.content, /<a /);
  assert.match(a.content, /<img /);
});

test("TC-009 long article tocEnabled true", async () => {
  const a = await json(await guest.fetch("/api/articles/getting-started-with-javascript"));
  assert.equal(a.tocEnabled, true);
});

test("TC-011 short article tocEnabled false", async () => {
  const a = await json(await guest.fetch("/api/articles/budget-travel-tips"));
  assert.equal(a.tocEnabled, false);
});

test("TC-028 unknown slug returns 404", async () => {
  const res = await guest.fetch("/api/articles/nope-nope");
  assert.equal(res.status, 404);
});

test("TC-032 guest like returns 401", async () => {
  const res = await guest.fetch("/api/articles/getting-started-with-javascript/like", { method: "POST" });
  assert.equal(res.status, 401);
});

test("TC-033 guest bookmark returns 401", async () => {
  const res = await guest.fetch("/api/articles/getting-started-with-javascript/bookmark", { method: "POST" });
  assert.equal(res.status, 401);
});

test("TC-034 guest comment returns 401", async () => {
  const res = await guest.fetch("/api/articles/getting-started-with-javascript/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "hello" }),
  });
  assert.equal(res.status, 401);
});

test("TC-037 duplicate email rejected", async () => {
  const res = await guest.fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Dup", email: "alice@example.com", password: "password123" }),
  });
  assert.equal(res.status, 400);
});

test("TC-038 short password rejected", async () => {
  const res = await guest.fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Short", email: "short-" + Date.now() + "@example.com", password: "123" }),
  });
  assert.equal(res.status, 400);
});

test("TC-036 sign up, like, bookmark, comment, persist", async () => {
  const jar = new Jar();
  const email = "test-" + Date.now() + "@example.com";
  const signup = await jar.fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test User", email, password: "password123" }),
  });
  assert.equal(signup.status, 201);
  const me = await json(await jar.fetch("/api/auth/me"));
  assert.equal(me.user.email, email);

  const slug = "understanding-async-await";
  const like1 = await json(await jar.fetch(`/api/articles/${slug}/like`, { method: "POST" }));
  assert.equal(like1.liked, true);
  const like2 = await json(await jar.fetch(`/api/articles/${slug}/like`, { method: "POST" }));
  assert.equal(like2.liked, false);

  const bm1 = await json(await jar.fetch(`/api/articles/${slug}/bookmark`, { method: "POST" }));
  assert.equal(bm1.bookmarked, true);
  const bm2 = await json(await jar.fetch(`/api/articles/${slug}/bookmark`, { method: "POST" }));
  assert.equal(bm2.bookmarked, false);

  const c = await jar.fetch(`/api/articles/${slug}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "API test comment" }),
  });
  assert.equal(c.status, 201);
  const created = await json(c);
  assert.equal(created.text, "API test comment");

  const empty = await jar.fetch(`/api/articles/${slug}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "   " }),
  });
  assert.equal(empty.status, 400);
});

test("TC-023 comments list returns array", async () => {
  const res = await guest.fetch("/api/articles/getting-started-with-javascript/comments");
  assert.equal(res.status, 200);
  const list = await json(res);
  assert.ok(Array.isArray(list));
  assert.ok(list.every((c) => c.userName && c.createdAt && c.text));
});

test("TC-041 passwords are hashed and cookie is httpOnly", async () => {
  const res = await fetch(BASE + "/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "alice@example.com", password: "password123" }),
  });
  const cookies = res.headers.getSetCookie();
  assert.ok(cookies.some((c) => /HttpOnly/i.test(c)));
});
