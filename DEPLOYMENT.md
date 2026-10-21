# Deployment — Firebase

## Live URL

https://re-vision-blogger.web.app

## Firebase project

| Field | Value |
| ----- | ----- |
| Project ID | `re-vision-blogger` |
| Project number | `202186016469` |
| Hosting site | `re-vision-blogger.web.app` |
| Firestore database | `(default)` |
| Auth provider | Email / password |
| Plan | Blaze (billing linked to "Firebase Payment") |

## How the deployed app works

- **Hosting** serves the static React site from `site/`.
- **Firestore** stores articles, comments, likes, and bookmarks.
- **Firebase Auth** handles sign-up / sign-in sessions.
- `site/firebase-api.js` is a small adapter that redirects `/api/*` calls to Firebase Auth + Firestore when the site is not running on `localhost:3000`.
- Local development keeps using the Express API + `data/db.json` (`node server.js`).

## Demo accounts

| Email | Password |
| ----- | -------- |
| alice@example.com | password123 |
| bob@example.com | password123 |
| carol@example.com | password123 |

## Deploy

```bash
npx firebase-tools deploy --only hosting,firestore:rules --project re-vision-blogger
```

## Seed Firestore from the local database

```bash
node scripts/seed-firestore.mjs
```

This pushes `data/db.json` articles, comments, likes, and bookmarks into the `(default)` Firestore database using the Firebase CLI access token.

## Security rules

`firestore.rules` enforces:

- Articles: public read, no client writes.
- Comments: public read; signed-in create; author-only delete.
- Likes: public read; signed-in users manage their own like.
- Bookmarks: private to the owner.

## Cost note

The project is on the Blaze plan. Firebase includes a free usage tier; usage beyond it is billed to the linked "Firebase Payment" account. Monitor usage in the Firebase console.
