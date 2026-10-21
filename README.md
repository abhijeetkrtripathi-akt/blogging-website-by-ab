# Re-Vision Blogger

A blogging website built step by step, with a documented RFP (requirements + test cases + evidence) per task.

**Live:** https://re-vision-blogger.web.app — see [`DEPLOYMENT.md`](./DEPLOYMENT.md)

## Stack

- **Frontend:** React 18 via CDN + Babel (no build step)
- **Backend:** Node.js + Express
- **Storage:** `data/db.json` (auto-seeded on first run)
- **Auth:** email + password, `express-session` cookies, bcrypt hashes

## Run locally

```bash
npm install
npm start
```

Open <http://localhost:3000>.

The database is created automatically at `data/db.json` with seed content on first start.

## Demo accounts

| Email | Password |
| ----- | -------- |
| alice@example.com | password123 |
| bob@example.com | password123 |
| carol@example.com | password123 |

## Project structure

```
server.js              Express API + static hosting
site/
  index.html           Home page
  app.jsx              Home React app
  shared.jsx           Header + auth modal
  article.jsx          Shared article template
  articles/*.html      One file per article
  styles.css
tests/api.test.mjs     API tests (node --test)
RFP/
  Task 1 - Home page creation/
  Task 2 - Individual article page/
```

## Tests

```bash
npm run test:api
```

## Permission model

| Action | Guest | Member |
| ------ | ----- | ------ |
| Read / share / view comments | Yes | Yes |
| Like / bookmark / comment | No (401) | Yes |
