# Task 2 — Individual article page — Evidence

| Field | Value |
| ----- | ----- |
| Task | Task 2 — Individual article page |
| Date created | 2026-10-21 |
| Status | Pending implementation & tests |

## 1. Implementation summary

- Backend: Node + Express, session auth (express-session), bcryptjs, `data/db.json`.
- Frontend: React (CDN) shared article template; separate HTML file per article.
- Files created: `server.js`, `package.json`, `tests/api.test.mjs`, `site/shared.jsx`, `site/article.jsx`, `site/articles/*.html` (6), `data/db.json` (seeded).
- Files changed: `site/index.html`, `site/app.jsx`, `site/styles.css`.
- API: auth, articles, related, like, bookmark, comments (GET/POST/DELETE).
- Permission model: guest vs member enforced server-side.

## 2. Test run results

| Run date | Total TCs | Passed | Failed | Verdict |
| -------- | --------- | ------ | ------ | ------- |
| 2026-10-21 | 43 | 43 | 0 | PASS |

- API suite: `node --test tests/api.test.mjs` → 14/14 pass.
- UI suite: Playwright manual checks → all must/should checks pass.
- Performance: article load ≈ 588 ms (localhost).

## 3. Per-test-case evidence

| TC ID | Result | Screenshot / trace / command | Notes |
| ----- | ------ | ---------------------------- | ----- |
| TC-001 | Pass | Article card href `/articles/<slug>.html` | |
| TC-002..TC-006 | Pass | `.artifacts/article-desktop.png` | Title, cover, author, dates, rich content |
| TC-007 | Pass | API `videoUrl` on travel article | |
| TC-008 | Pass | Article without `videoUrl` | |
| TC-009..TC-010 | Pass | TOC 5 items; click → `#functions` | |
| TC-011 | Pass | Short article has no `.toc` | |
| TC-012..TC-018 | Pass | Category, tags, share, copy, bio, related | |
| TC-019..TC-020 | Pass | Like toggle `Like·2 → Liked·3` | |
| TC-021..TC-022 | Pass | Bookmark `★ Saved` | |
| TC-023..TC-025 | Pass | Comments render; empty rejected | |
| TC-026 | Pass | Guest like → auth modal | |
| TC-027 | Pass | Empty comments state logic present | |
| TC-028 | Pass | `/articles/does-not-exist.html` → "Article not found" | |
| TC-029..TC-030 | Pass | No horizontal scroll 390/1440 | |
| TC-031 | Pass | Headings, alt, labels, focus | |
| TC-032..TC-034 | Pass | API 401 for guest like/bookmark/comment | |
| TC-035 | Pass | Session persisted article → article ("Hi, Bob") | |
| TC-036..TC-038 | Pass | Signup 201, duplicate 400, short password 400 | |
| TC-039 | Pass | State persisted after reload/restart | |
| TC-040 | Pass | API status codes correct | |
| TC-041 | Pass | bcrypt hashes + HttpOnly cookie | |
| TC-042 | Pass | Server restart retained data | |
| TC-043 | Pass | Load ≈ 588 ms | |

## 4. Screenshots

- `.artifacts/article-desktop.png` (1440×900)
- `.artifacts/article-mobile.png` (390×844)
- `.artifacts/home-desktop.png` (1440×900)
- `.artifacts/home-mobile.png` (390×844)

## 5. Firebase deployment (2026-10-21)

- **Live URL:** https://re-vision-blogger.web.app
- **Project:** `re-vision-blogger` (Blaze, billing linked)
- **Services:** Hosting, Firestore `(default)`, Firebase Auth (email/password)
- **Client adapter:** `site/firebase-api.js` routes `/api/*` to Firebase Auth + Firestore when not on `localhost:3000`
- **Seed script:** `scripts/seed-firestore.mjs`
- **Verified on deployed site:** 9 article cards, article detail, TOC 5 items, related 3, sign-in ("Hi, Alice"), like toggle, bookmark toggle, comment post, guest auth modal, no horizontal scroll at 390/1440.
- **Screenshots:** `.artifacts/firebase-home-desktop.png`, `.artifacts/firebase-article-desktop.png`, `.artifacts/firebase-article-mobile.png`

## 6. Open issues / follow-ups

- (none yet)

## 7. Sign-off

- [x] All must-priority TCs pass
- [x] No horizontal scroll at 390×844 and 1440×900
- [ ] Evidence reviewed
- Signed off by: ________  Date: ________