# Task 1 — Home page creation — Evidence

| Field | Value |
| ----- | ----- |
| Task | Task 1 — Home page creation |
| Date created | 2026-10-20 |
| Status | Pending implementation & tests |

## 1. Implementation summary

- Files created: site/index.html, site/styles.css, site/app.js
- Pages touched: Home (index.html)
- Mock data: 6 posts across Tech, Lifestyle, Travel categories
- Features: header (brand, nav, categories dynamic, search, auth buttons, hamburger), hero, latest & popular cards, footer newsletter with validation

## 2. Test run results

| Run date | Total TCs | Passed | Failed | Verdict |
| -------- | --------- | ------ | ------ | ------- |
| 2026-10-20 | 37 | 35 | 0 | PASS (2 N/A) |

## 3. Per-test-case evidence

| TC ID | Result | Screenshot / trace path | Notes |
| ----- | ------ | ------------------------ | ----- |
| TC-001..TC-003 | Pass | .artifacts/home-desktop-final.png | Header + brand + nav placement |
| TC-004..TC-009 | Pass | .artifacts/home-desktop-final.png | Categories, search, auth buttons |
| TC-010..TC-011 | Pass | .artifacts/home-mobile-final.png | Hamburger at 390px |
| TC-012..TC-017 | Pass | .artifacts/home-desktop-final.png | Cards render |
| TC-018 | N/A | — | Empty state not triggered by current mock (logic present) |
| TC-019 | N/A | — | Loading state (nice priority) not implemented |
| TC-020..TC-025 | Pass | .artifacts/home-desktop-final.png | Newsletter validation + success |
| TC-026..TC-027 | Pass | slides | No horizontal scroll at 390px / 1440px |
| TC-028..TC-029 | Pass | — | Focus states + alt/landmarks |
| TC-030..TC-031 | Pass | .artifacts/home-desktop-final.png | Hero banner + famous articles |
| TC-032..TC-033 | Pass | .artifacts/home-desktop-final.png | Footer categories + nav |
| TC-034 | Pass | .artifacts/home-desktop-final.png | Green prominent Subscribe |
| TC-035..TC-036 | Pass | .artifacts/home-mobile-final.png | Hero responsive |
| TC-037 | Pass | site/app.jsx | React root renders |

## 4. Screenshots

- `.artifacts/home-desktop-final.png` (1440×900) — final React version
- `.artifacts/home-mobile-final.png` (390×844) — final React version

## 5. Audit findings & fixes (2026-10-20)

**Bugs found on review (fixed):**
1. "Sign up" button invisible — `.auth-buttons button` overrode `.btn-primary` background, leaving white text on white. Fixed with `.auth-buttons .btn-primary`.
2. Nav links sat under the brand on the left instead of under the search/auth buttons. Restructured into a right-aligned `.header-right` column containing actions + nav.
3. Hamburger was never displayed on mobile, so mobile nav was unreachable. Added `display: inline-block` at ≤700px.
4. Duplicate hero: banner + "Welcome" section repeated the same message. Merged into a single hero with CTA.
5. Missing test hooks in React build (`#search-input`, `#newsletter-form`, `#newsletter-email`, `#newsletter-error`). Added for testability.

**Design improvements:** richer gradient hero with eyebrow/CTA, clearer section headers, card hover lift, consistent radius/shadow tokens, right-aligned secondary nav, prominent green Subscribe button.

## 6. Open issues / follow-ups

- REQ-014 loading/placeholder state remains `nice` priority and is not implemented.
- Empty-state (REQ-013) logic exists but is not triggered by current mock data.

## 7. Sign-off

- [x] All must-priority TCs pass
- [x] No horizontal scroll at 390×844 and 1440×900
- [ ] Evidence reviewed
- Signed off by: ________  Date: ________