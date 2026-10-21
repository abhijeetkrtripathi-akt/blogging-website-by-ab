# Task 2 — Individual article page — Test Cases

| Field | Value |
| ----- | ----- |
| Requirements | [`requirements.md`](./requirements.md) |
| Task | Task 2 — Individual article page |
| Date | 2026-10-21 |
| Author | Agent |
| Requirements ver | 1.0 |

## 1. Test strategy

- **Levels in scope:** API tests (Node `node:test` + fetch), E2E UI tests (Playwright), manual visual checks.
- **Out of scope:** Deployment, OAuth, email delivery, real-time comments.
- **Environment:** `http://localhost:3000`, seeded `data/db.json`.
- **Test data:** 6 articles; users `alice@example.com` / `bob@example.com` (password `password123`); long article `understanding-async-await`; short article `budget-travel-tips`.
- **Entry/exit criteria:** All must TCs pass; no horizontal scroll at both breakpoints.

## 2. Traceability matrix

| Req ID | Test cases | Notes |
| ------ | ---------- | ----- |
| REQ-001 | TC-001 | |
| REQ-002 | TC-002 | |
| REQ-003 | TC-003 | |
| REQ-004 | TC-004 | |
| REQ-005 | TC-005 | |
| REQ-006 | TC-006 | |
| REQ-007 | TC-007, TC-008 | |
| REQ-008 | TC-009, TC-010 | |
| REQ-009 | TC-011 | |
| REQ-010 | TC-012 | |
| REQ-011 | TC-013 | |
| REQ-012 | TC-014 | |
| REQ-013 | TC-015 | |
| REQ-014 | TC-016 | |
| REQ-015 | TC-017 | |
| REQ-016 | TC-018 | |
| REQ-017 | TC-019, TC-020 | |
| REQ-018 | TC-021, TC-022 | |
| REQ-019 | TC-023 | |
| REQ-020 | TC-024, TC-025 | |
| REQ-021 | TC-026 | |
| REQ-022 | TC-027 | |
| REQ-023 | TC-028 | |
| REQ-024 | TC-029, TC-030 | |
| REQ-025 | TC-031 | |
| REQ-026 | TC-032, TC-033, TC-034 | |
| REQ-027 | TC-035 | |
| REQ-028 | TC-036, TC-037, TC-038 | |
| REQ-029 | TC-039 | |
| REQ-030 | TC-040 | |
| REQ-031 | TC-041 | |
| REQ-032 | TC-042 | |
| REQ-033 | TC-043 | |

## 3. Functional test cases

### Navigation & content

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-001 | REQ-001 | Home card opens separate article file | E2E | must | Home loaded | Click a card | URL is `/articles/<slug>.html` |
| TC-002 | REQ-002 | Title displayed | E2E | must | Article page | Open article | `h1` shows title |
| TC-003 | REQ-003 | Cover image displayed with alt | E2E | must | Article page | Open article | Cover img visible and has alt |
| TC-004 | REQ-004 | Author name displayed | E2E | must | Article page | Open article | Author name visible |
| TC-005 | REQ-005 | Published and updated dates displayed | E2E | must | Article page | Open article | Both dates visible |
| TC-006 | REQ-006 | Rich content renders | E2E | must | Article page | Open article | Headings, paragraphs, images, links, lists present |
| TC-007 | REQ-007 | Video renders when present | E2E | should | Article with videoUrl | Open article | Video/iframe visible |
| TC-008 | REQ-007 | No video when absent | E2E | should | Article without videoUrl | Open article | No video element |
| TC-009 | REQ-008 | TOC shown for long article | E2E | must | Long article | Open article | TOC list visible |
| TC-010 | REQ-008 | TOC anchor links scroll to heading | E2E | must | Long article | Click TOC link | Target heading in view / hash updates |
| TC-011 | REQ-009 | TOC hidden for short article | E2E | should | Short article | Open article | No TOC |
| TC-012 | REQ-010 | Category displayed | E2E | must | Article page | Open article | Category text visible |
| TC-013 | REQ-011 | Tags displayed | E2E | must | Article page | Open article | All tags visible |
| TC-014 | REQ-012 | Share + Copy Link buttons present | E2E | must | Article page | Open article | X, Facebook, LinkedIn, Copy Link present |
| TC-015 | REQ-013 | Copy Link shows confirmation | E2E | must | Article page | Click Copy Link | Confirmation message appears |
| TC-016 | REQ-014 | Author bio shown | E2E | must | Article page | Open article | Bio text visible |
| TC-017 | REQ-015 | Related articles shown | E2E | must | Article page | Open article | Related cards visible |
| TC-018 | REQ-016 | Related card opens its article | E2E | should | Article page | Click related card | Navigates to that article file |

### Engagement (member)

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-019 | REQ-017 | Member like increments count | API | must | Signed in | POST like | 200; count +1; liked=true |
| TC-020 | REQ-017 | Member unlike decrements count | API | must | Liked | POST like again | 200; count -1; liked=false |
| TC-021 | REQ-018 | Member bookmark ON | API | must | Signed in | POST bookmark | 200; bookmarked=true |
| TC-022 | REQ-018 | Member bookmark OFF | API | must | Bookmarked | POST bookmark again | 200; bookmarked=false |
| TC-023 | REQ-019 | Comments list shows author/date/text | E2E | must | Seeded comments | Open article | Comment rows visible |
| TC-024 | REQ-020 | Member submits valid comment | API | must | Signed in | POST comment | 201; comment listed |
| TC-025 | REQ-020 | Empty/whitespace comment rejected | API | must | Signed in | POST "   " | 400 |
| TC-026 | REQ-021 | Guest sees sign-in prompt for gated action | E2E | must | Guest | Click Like | Auth modal/prompt shown |
| TC-027 | REQ-022 | Empty comments state | E2E | should | Article with no comments | Open article | Empty message visible |

### Errors & permissions

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-028 | REQ-023 | Invalid article shows not-found | E2E | must | — | Open `/articles/nope.html` | Not-found state + home link |
| TC-029 | REQ-024 | No horizontal scroll at 390px | E2E | must | Mobile viewport | Open article | No overflow |
| TC-030 | REQ-024 | No horizontal scroll at 1440px | E2E | must | Desktop viewport | Open article | No overflow |
| TC-031 | REQ-025 | Accessibility basics | Manual | should | — | Inspect | Heading order, alt, labels, focus |
| TC-032 | REQ-026 | Guest like returns 401 | API | must | Guest | POST like | 401 |
| TC-033 | REQ-026 | Guest bookmark returns 401 | API | must | Guest | POST bookmark | 401 |
| TC-034 | REQ-026 | Guest comment returns 401 | API | must | Guest | POST comment | 401 |
| TC-035 | REQ-027 | Session persists across pages | E2E | should | Signed in | Open another article | Still signed in |

### Auth & persistence

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-036 | REQ-028 | Sign up creates account | API | must | New email | POST signup | 201; session set |
| TC-037 | REQ-028 | Duplicate email rejected | API | must | Existing email | POST signup | 400 |
| TC-038 | REQ-028 | Short password rejected | API | must | — | POST signup with 4 chars | 400 |
| TC-039 | REQ-029 | Engagement persists after reload | E2E | must | Member liked/bookmarked/commented | Reload | State retained |
| TC-040 | REQ-030 | API status codes correct | API | must | — | Call endpoints | 200/201/400/401/404 as specified |
| TC-041 | REQ-031 | Passwords hashed; cookie httpOnly | API | must | — | Inspect db + cookie | No plaintext; httpOnly |
| TC-042 | REQ-032 | db.json survives restart | API | should | Data written | Restart server | Data intact |
| TC-043 | REQ-033 | Article loads under 2s locally | Manual | should | — | Time load | < 2000 ms |

## 4. Negative & edge cases

| TC ID | Req ID | Scenario | Expected result |
| ----- | ------ | -------- | --------------- |
| TC-008 | REQ-007 | Article without video | No video element |
| TC-011 | REQ-009 | Short article | No TOC |
| TC-025 | REQ-020 | Whitespace comment | 400 |
| TC-028 | REQ-023 | Unknown slug | Not-found state |
| TC-032..TC-034 | REQ-026 | Guest gated actions | 401 |
| TC-037 | REQ-028 | Duplicate email | 400 |
| TC-038 | REQ-028 | Weak password | 400 |

## 5. Non-functional test cases

| TC ID | Req ID | Category | Check | Pass criteria |
| ----- | ------ | -------- | ----- | ------------- |
| TC-029 | REQ-024 | Responsive | 390×844 | No horizontal scroll |
| TC-030 | REQ-024 | Responsive | 1440×900 | No horizontal scroll |
| TC-031 | REQ-025 | Accessibility | Headings/alt/labels/focus | All present |
| TC-041 | REQ-031 | Security | bcrypt + httpOnly | Verified |
| TC-043 | REQ-033 | Performance | Local load time | < 2s |

## 6. BDD scenarios

```gherkin
Feature: Individual article page
  As a reader
  I want a dedicated page per article
  So that I can read, share, save, and discuss it

  Scenario: Open an article from home
    Given I am on the home page
    When I click an article card
    Then I land on /articles/<slug>.html
    And I see the title, cover, author, dates, category, and tags

  Scenario: Long article table of contents
    Given an article has multiple headings
    When I open it
    Then a Table of Contents is shown
    And clicking an item jumps to that heading

  Scenario: Guest tries to like
    Given I am not signed in
    When I click Like
    Then I see a sign-in prompt
    And the like is not recorded

  Scenario: Member likes and bookmarks
    Given I am signed in
    When I like and bookmark an article
    Then the counts update
    And the state survives a page reload

  Scenario: Member comments
    Given I am signed in
    When I submit a non-empty comment
    Then it appears in the comments list
    And submitting only spaces is rejected

  Scenario: Unknown article
    Given the article does not exist
    When I open its URL
    Then I see a not-found message with a link home
```

## 7. Not directly testable

| Req ID | Why | How it will be verified |
| ------ | --- | ----------------------- |
| REQ-033 | Timing varies by machine | Manual stopwatch/DevTools |

## 8. Open questions

| ID | Question | Blocks |
| -- | -------- | ------ |
| Q-005 | Are seeded demo credentials acceptable? | TC-019..TC-024 |