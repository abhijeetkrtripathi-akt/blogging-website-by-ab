# Task 1 — Home page creation — Requirements

| Field | Value |
| ----- | ----- |
| Task | Task 1 — Home page creation |
| Slug | home-page-creation |
| Status | Confirmed |
| Version | 1.0 |
| Date | 2026-10-20 |
| Owner | Abhijeet Tripathi |
| Scope | Frontend only (mock/static data) |
| Test cases | [`test-cases.md`](./test-cases.md) |
| Evidence | [`evidence.md`](./evidence.md) |

## 1. Overview

Frontend-only landing/home page for "Re-Vision Blogger", a blogging platform. It acts as a summary of the whole site: a header with navigation, categories, search and auth buttons; latest and popular article cards; and a footer newsletter subscription. No backend or real data — mock/static content only.

## 2. Problem statement

There is no landing page today to introduce the blog, surface content, or capture newsletter subscribers. Users have no entry point to browse articles or sign up.

## 3. Goals

- Provide a clear, readable home page that summarizes the site.
- Surface latest and popular articles via cards.
- Let visitors search, browse categories, and subscribe to the newsletter.
- Provide sign in / sign up entry points.

## 4. Non-goals

- No backend, database, or real authentication.
- No article detail page implementation (placeholder route only).
- No real email/newsletter delivery.
- No admin or authoring UI.

## 5. Actors

| Actor | Description | Permissions |
| ----- | ----------- | ----------- |
| Visitor | Anonymous user browsing the site | View, search, subscribe |
| Registered user | Signed-in reader/author | View, search, subscribe (auth via placeholder) |

## 6. User flows

### Browse home page
1. Visitor opens the site.
2. Sees header with brand, nav, categories, search, auth buttons.
3. Scrolls to latest and popular article cards.
4. Clicks a card to open article (placeholder).

### Subscribe to newsletter
1. Visitor enters email in footer form.
2. Submits.
3. Sees success or validation error.

### Search
1. Visitor types a query in the header search.
2. Submits via Enter/button.
3. Sees search UI feedback (no real results required for this task).

## 7. Functional requirements

| ID | Requirement | Priority | Notes |
| -- | ----------- | -------- | ----- |
| REQ-001 | Page renders a top header bar on load | must | |
| REQ-002 | Header shows brand name "Re-Vision Blogger" on the left | must | |
| REQ-003 | Header no longer shows nav links beside the brand; nav links (Home, About, Contact, Write) appear (a) just below the Sign in/up + search buttons in the header, and (b) in the footer | must | moved from beside brand |
| REQ-004 | Header shows a Categories menu listing only categories that contain at least one blog post (dynamic; empty categories omitted) | must | Mock data drives this |
| REQ-005 | A search input is placed in the top-right area of the header | must | |
| REQ-006 | Typing in search and pressing Enter/button triggers a search action with UI feedback | should | |
| REQ-007 | Header shows "Sign in" and "Sign up" buttons | must | |
| REQ-008 | On small screens (≤390px) header collapses nav into a hamburger menu that opens/closes | should | |
| REQ-009 | Hero section: first hero is a banner showing the website name "Re-Vision Blogger"; below it, a "Famous/Highlighted articles" block featuring selected articles | must | new |
| REQ-010 | "Latest articles" section renders article cards (image, title, excerpt, author, date) | must | |
| REQ-011 | "Popular articles" section renders article cards | must | |
| REQ-012 | Article cards are clickable and navigate to an article detail route (placeholder) | should | |
| REQ-013 | An empty state is shown when a section has no articles | should | |
| REQ-014 | A loading/placeholder state is shown while articles load | nice | |
| REQ-015 | Footer contains a newsletter subscription form with an email input | must | |
| REQ-016 | Newsletter form validates email format and shows an error for invalid input | must | |
| REQ-017 | Newsletter form shows success feedback after valid submit | should | |
| REQ-018 | Footer shows copyright and basic links | nice | |
| REQ-022 | Categories menu stays in header AND is also listed in the footer | should | new |
| REQ-023 | Newsletter "Subscribe" button is visually prominent (bold color, larger, high contrast) | must | new |
| REQ-024 | Site is built with React (frontend) | must | stack change |
| REQ-025 | Nav links in footer are clickable and route to sections/pages | should | new |
| REQ-026 | Hero banner is responsive at 390×844 and 1440×900 | must | new |

## 8. Non-functional requirements

| ID | Category | Requirement | Priority |
| -- | -------- | ----------- | -------- |
| REQ-019 | Responsive | Layout works at 390×844 and 1440×900 with no horizontal scroll and readable text | must |
| REQ-020 | Accessibility | Interactive elements have visible focus states and are keyboard operable | should |
| REQ-021 | Accessibility | Images have alt text; semantic landmarks (header/main/footer) are used | should |

## 9. Out of scope

- Backend, database, authentication, real email delivery.
- Article detail page content (placeholder route only).
- Admin/authoring tools.

## 10. Assumptions & open questions

| ID | Question / Assumption | Impact | Status |
| -- | --------------------- | ------ | ------ |
| Q-001 | Article data is mock/static (no backend) | High | Resolved — mock data |
| Q-002 | Categories are derived dynamically from mock posts (only non-empty categories shown) | Medium | Resolved |
| Q-003 | Brand name "Re-Vision Blogger" | Low | Resolved |
| Q-004 | Newsletter submit is frontend-only (no real email service) | Medium | Resolved — frontend only |

## 11. Acceptance criteria

| ID | Criterion | Covers |
| -- | --------- | ------ |
| AC-001 | Home page loads and shows header, hero, latest, popular, footer sections | REQ-001, REQ-009, REQ-010, REQ-011, REQ-015 |
| AC-002 | Categories menu lists only categories with posts | REQ-004 |
| AC-003 | Newsletter rejects invalid email with visible error | REQ-016 |
| AC-004 | Layout has no horizontal scroll at 390px and 1440px | REQ-019 |

## 12. Change log

| Date | Version | Change | By |
| ---- | ------- | ------ | -- |
| 2026-10-20 | 1.0 | Initial confirmed requirements | Agent |