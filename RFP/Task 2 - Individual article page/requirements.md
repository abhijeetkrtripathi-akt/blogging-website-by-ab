# Task 2 — Individual article page — Requirements

| Field | Value |
| ----- | ----- |
| Task | Task 2 — Individual article page |
| Slug | individual-article-page |
| Status | Confirmed |
| Version | 1.0 |
| Date | 2026-10-21 |
| Owner | Abhijeet Tripathi |
| Scope | Backend + frontend (Node/Express, db.json, session auth) |
| Test cases | [`test-cases.md`](./test-cases.md) |
| Evidence | [`evidence.md`](./evidence.md) |

## 1. Overview

Every article has its own page. Pages are separate HTML files at `site/articles/<slug>.html`, all rendered by one shared React article template. Article content lives in `data/db.json` and is served by a Node/Express API. Signed-in members can like, bookmark, and comment; guests can read, share, copy the link, and view comments.

## 2. Problem statement

The home page currently shows cards but has no real article pages, and no persistence for engagement. Readers cannot open an article, follow its structure, share it, save it, or discuss it.

## 3. Goals

- Give every article its own URL/file with full content.
- Render rich content (headings, paragraphs, images, links, lists, video).
- Add TOC, category/tags, sharing, likes, bookmarks, comments, author bio, related articles.
- Enforce a guest/member permission model on the server.

## 4. Non-goals

- No public deployment, email verification, or password reset.
- No admin CMS or article editor.
- No real social OAuth integrations (share buttons are plain share links).
- No real-time comments.

## 5. Actors

| Actor | Description | Permissions |
| ----- | ----------- | ----------- |
| Guest | Anonymous visitor | Read, share, copy link, view comments |
| Member | Signed-in user | Guest rights + like, bookmark, comment, delete own comment |

## 6. Permission matrix

| Action | Guest | Member |
| ------ | ----- | ------ |
| Read article | ✅ | ✅ |
| Share / Copy link | ✅ | ✅ |
| View comments | ✅ | ✅ |
| Like / unlike | ❌ 401 → sign-in prompt | ✅ |
| Bookmark / unbookmark | ❌ 401 → sign-in prompt | ✅ |
| Comment | ❌ 401 → sign-in prompt | ✅ |
| Delete own comment | ❌ | ✅ |

## 7. Functional requirements

| ID | Requirement | Priority | Notes |
| -- | ----------- | -------- | ----- |
| REQ-001 | Each article has its own page at `site/articles/<slug>.html`; home cards link to it | must | separate file per article |
| REQ-002 | Article page shows the article title | must | |
| REQ-003 | Article page shows the cover image with alt text | must | |
| REQ-004 | Article page shows the author name | must | |
| REQ-005 | Article page shows publication date and updated date | must | |
| REQ-006 | Content renders headings, paragraphs, images, links, and lists | must | HTML in DB |
| REQ-007 | Optional video renders when present; absent when not | should | |
| REQ-008 | Long articles show a Table of Contents built from headings with working anchor links | must | |
| REQ-009 | TOC is hidden for short articles | should | |
| REQ-010 | Article shows its category | must | |
| REQ-011 | Article shows its tags | must | |
| REQ-012 | Share buttons (X, Facebook, LinkedIn) and Copy Link are present | must | |
| REQ-013 | Copy Link copies the URL and shows confirmation | must | |
| REQ-014 | Author introduction/bio section is shown | must | |
| REQ-015 | Related articles section shows cards for other articles | must | |
| REQ-016 | Clicking a related article opens its own page | should | |
| REQ-017 | Member can like/unlike; count updates | must | server-side |
| REQ-018 | Member can bookmark/unbookmark; state persists | must | server-side |
| REQ-019 | Comments list shows author, date, text | must | |
| REQ-020 | Member can submit a non-empty comment; empty/whitespace rejected | must | |
| REQ-021 | Guest sees a sign-in prompt instead of like/bookmark/comment controls | must | |
| REQ-022 | Empty comments state is shown when there are no comments | should | |
| REQ-023 | Invalid article shows a not-found state with a link home | must | |
| REQ-024 | No horizontal scroll at 390×844 and 1440×900 | must | |
| REQ-025 | Headings, alt text, labels, keyboard operation, and focus states are accessible | should | |
| REQ-026 | Permission matrix is enforced server-side (401 for guests) | must | |
| REQ-027 | Session persists across article pages | should | cookie session |
| REQ-028 | Sign-up with name, email, password; duplicate email rejected; password ≥ 8 chars | must | |
| REQ-029 | Likes, bookmarks, and comments persist in db.json across reload/restart | must | |
| REQ-030 | API returns correct status codes (200/201/400/401/404) | must | |

## 8. API / interface

| Method | Path | Purpose | Auth | Errors |
| ------ | ---- | ------- | ---- | ------ |
| POST | `/api/auth/signup` | Create account | No | 400 invalid/duplicate |
| POST | `/api/auth/signin` | Sign in | No | 400 invalid credentials |
| POST | `/api/auth/signout` | Sign out | Yes | — |
| GET | `/api/auth/me` | Current user | No | 200 `{user:null}` |
| GET | `/api/articles` | List articles (cards) | No | — |
| GET | `/api/articles/:slug` | Article + counts + user state | No | 404 |
| GET | `/api/articles/:slug/related` | Related articles | No | 404 |
| POST | `/api/articles/:slug/like` | Toggle like | Yes | 401 |
| POST | `/api/articles/:slug/bookmark` | Toggle bookmark | Yes | 401 |
| GET | `/api/articles/:slug/comments` | List comments | No | 404 |
| POST | `/api/articles/:slug/comments` | Add comment | Yes | 400/401 |
| DELETE | `/api/comments/:id` | Delete own comment | Yes | 401/403/404 |

## 9. Data model

| Entity | Field | Type | Constraints |
| ------ | ----- | ---- | ----------- |
| User | id, name, email, passwordHash, bio, avatar | string | email unique |
| Article | id, slug, title, excerpt, coverImage, content, category, tags[], videoUrl, authorId, publishedAt, updatedAt, famous, featured | mixed | slug unique |
| Comment | id, articleSlug, userId, text, createdAt | mixed | text 1–1000 chars |
| Like | userId, articleSlug | string | unique pair |
| Bookmark | userId, articleSlug | string | unique pair |

## 10. Non-functional requirements

| ID | Category | Requirement | Priority |
| -- | -------- | ----------- | -------- |
| REQ-031 | Security | Passwords hashed with bcrypt; session cookie httpOnly; server enforces permissions | must |
| REQ-032 | Reliability | db.json reads/writes are atomic enough for local single-user demo | should |
| REQ-033 | Performance | Article page renders under 2s on localhost | should |

## 11. Out of scope

- Deployment, OAuth, email verification, password reset.
- Admin CMS, article editor, moderation.
- Real-time updates.

## 12. Assumptions & open questions

| ID | Question / Assumption | Impact | Status |
| -- | --------------------- | ------ | ------ |
| Q-001 | Separate HTML file per article, shared React template | High | Resolved |
| Q-002 | All content stored in db.json | High | Resolved |
| Q-003 | Guest vs member permissions as in section 6 | High | Resolved |
| Q-004 | Local-only hosting at localhost:3000 | Medium | Resolved |
| Q-005 | Mock seeded users: `alice@example.com` / `bob@example.com` (password `password123`) | Low | Assumption |

## 13. Acceptance criteria

| ID | Criterion | Covers |
| -- | --------- | ------ |
| AC-001 | Home card opens `/articles/<slug>.html` with full content | REQ-001..REQ-006 |
| AC-002 | Long article shows working TOC | REQ-008 |
| AC-003 | Guest gets sign-in prompt for like/bookmark/comment | REQ-021, REQ-026 |
| AC-004 | Member like/bookmark/comment persists after reload | REQ-017..REQ-020, REQ-029 |
| AC-005 | Invalid slug shows not-found state | REQ-023 |

## 14. Change log

| Date | Version | Change | By |
| ---- | ------- | ------ | -- |
| 2026-10-21 | 1.0 | Initial confirmed requirements | Agent |