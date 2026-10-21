# Task 1 — Home page creation — Test Cases

| Field | Value |
| ----- | ----- |
| Requirements | [`requirements.md`](./requirements.md) |
| Task | Task 1 — Home page creation |
| Date | 2026-10-20 |
| Author | Agent |
| Requirements ver | 1.0 |

## 1. Test strategy

- **Levels in scope:** E2E (Playwright) for UI/rendering/interaction; manual for visual polish.
- **Out of scope:** Backend, auth, email delivery, article detail content.
- **Environment:** Local dev server serving `site/` (or static files).
- **Test data:** Mock posts with categories Tech, Lifestyle, Travel; one empty category (e.g. Sports) excluded.
- **Entry/exit criteria:** All must-priority TCs pass; no horizontal scroll at breakpoints.

## 2. Traceability matrix

| Req ID | Test cases | Notes |
| ------ | ---------- | ----- |
| REQ-001 | TC-001 | |
| REQ-002 | TC-002 | |
| REQ-003 | TC-003 | |
| REQ-004 | TC-004, TC-005 | dynamic categories |
| REQ-005 | TC-006 | |
| REQ-006 | TC-007, TC-008 | |
| REQ-007 | TC-009 | |
| REQ-008 | TC-010, TC-011 | |
| REQ-009 | TC-012 | |
| REQ-010 | TC-013, TC-014 | |
| REQ-011 | TC-015, TC-016 | |
| REQ-012 | TC-017 | |
| REQ-013 | TC-018 | |
| REQ-014 | TC-019 | |
| REQ-015 | TC-020 | |
| REQ-016 | TC-021, TC-022, TC-023 | |
| REQ-017 | TC-024 | |
| REQ-018 | TC-025 | |
| REQ-019 | TC-026, TC-027 | |
| REQ-020 | TC-028 | |
| REQ-021 | TC-029 | |
| REQ-022 | TC-030 | categories in footer |
| REQ-023 | TC-031 | prominent subscribe button |
| REQ-024 | TC-037 | React build |
| REQ-025 | TC-033 | footer nav links |
| REQ-026 | TC-034, TC-035 | hero responsive |

## 3. Functional test cases

### Header

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-001 | REQ-001 | Header renders on page load | E2E | must | Page loaded | Open home page | Header element is visible |
| TC-002 | REQ-002 | Brand name "Re-Vision Blogger" visible in header | E2E | must | Page loaded | Open home page | Text "Re-Vision Blogger" present in header |
| TC-003 | REQ-003 | Main nav links present | E2E | must | Page loaded | Open home page | Links Home, About, Contact, Write visible |
| TC-004 | REQ-004 | Categories menu shows only non-empty categories | E2E | must | Mock posts in Tech/Lifestyle/Travel | Open home page; open categories | Tech, Lifestyle, Travel shown |
| TC-005 | REQ-004 | Empty category is omitted from menu | E2E | must | Mock data has no Sports posts | Open categories | "Sports" not listed |
| TC-006 | REQ-005 | Search input in top-right of header | E2E | must | Page loaded | Open home page | Search input visible in header |
| TC-007 | REQ-006 | Search submit via Enter shows feedback | E2E | should | Page loaded | Type query; press Enter | Search feedback/UI response occurs |
| TC-008 | REQ-006 | Search submit via button shows feedback | E2E | should | Page loaded | Type query; click search button | Search feedback/UI response occurs |
| TC-009 | REQ-007 | Sign in and Sign up buttons visible | E2E | must | Page loaded | Open home page | Both buttons visible |
| TC-010 | REQ-008 | Hamburger menu appears at 390px | E2E | should | Viewport 390x844 | Resize; open page | Hamburger icon visible |
| TC-011 | REQ-008 | Hamburger toggles nav open/closed | E2E | should | Viewport 390x844 | Click hamburger | Nav opens; click again closes |

### Hero & articles

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-012 | REQ-009 | Hero/summary intro section visible | E2E | should | Page loaded | Open home page | Intro section with text visible |
| TC-013 | REQ-010 | Latest articles cards render with fields | E2E | must | Mock latest posts | Open home page | Cards show image, title, excerpt, author, date |
| TC-014 | REQ-010 | Latest section card count matches mock data | E2E | must | 3 mock latest posts | Open home page | 3 cards rendered |
| TC-015 | REQ-011 | Popular articles cards render with fields | E2E | must | Mock popular posts | Open home page | Cards show image, title, excerpt, author, date |
| TC-016 | REQ-011 | Popular section card count matches mock data | E2E | must | 3 mock popular posts | Open home page | 3 cards rendered |
| TC-017 | REQ-012 | Article card click navigates to detail route | E2E | should | Page loaded | Click a card | URL changes to article route (placeholder) |
| TC-018 | REQ-013 | Empty state shown when no articles | E2E | should | Mock data empty for a section | Render with empty data | "No articles" message visible |
| TC-019 | REQ-014 | Loading/placeholder state shown while loading | E2E | nice | Slow mock load | Open page | Skeleton/placeholder visible briefly |

### Footer

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-020 | REQ-015 | Newsletter form with email input in footer | E2E | must | Page loaded | Open home page; scroll footer | Email input + submit button visible |
| TC-021 | REQ-016 | Invalid email shows validation error | E2E | must | Page loaded | Enter "not-an-email"; submit | Error message visible; no success |
| TC-022 | REQ-016 | Empty email shows validation error | E2E | must | Page loaded | Submit empty | Error message visible |
| TC-023 | REQ-016 | Valid email passes format validation | E2E | must | Page loaded | Enter "a@b.com"; submit | No format error |
| TC-024 | REQ-017 | Valid submit shows success feedback | E2E | should | Page loaded | Enter valid email; submit | Success message visible |
| TC-025 | REQ-018 | Footer copyright and links visible | E2E | nice | Page loaded | Scroll footer | Copyright text and links visible |

### Hero & highlighted

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-030 | REQ-009 | Hero banner shows website name | E2E | must | Page loaded | Open home page | Banner contains "Re-Vision Blogger" |
| TC-031 | REQ-009 | Famous articles block renders highlighted cards | E2E | must | Mock famous posts | Open home page | At least one highlighted card visible |

### Footer nav & categories

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-032 | REQ-022 | Categories listed in footer | E2E | should | Page loaded | Scroll footer | Category list visible in footer |
| TC-033 | REQ-025 | Footer nav links visible and clickable | E2E | should | Page loaded | Scroll footer | Home/About/Contact/Write links visible |
| TC-034 | REQ-023 | Subscribe button visually prominent | E2E | must | Page loaded | Inspect button | Button has prominent styling (bold/large) |

### Responsive hero

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-035 | REQ-026 | Hero responsive at 390px | E2E | must | Viewport 390x844 | Open home page | No horizontal scroll; hero readable |
| TC-036 | REQ-026 | Hero responsive at 1440px | E2E | must | Viewport 1440x900 | Open home page | No horizontal scroll; hero readable |

### React

| TC ID | Req ID | Title | Type | Priority | Preconditions | Steps | Expected result |
| ----- | ------ | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-037 | REQ-024 | Page built with React | Manual | must | — | Inspect source | React root renders content |

## 4. Negative & edge cases

| TC ID | Req ID | Scenario | Expected result |
| ----- | ------ | -------- | --------------- |
| TC-005 | REQ-004 | Category with zero posts not listed | Omitted from menu |
| TC-018 | REQ-013 | Section with zero articles | Empty state message |
| TC-021 | REQ-016 | Malformed email (no @) | Validation error |
| TC-022 | REQ-016 | Empty submission | Validation error |

## 5. Non-functional test cases

| TC ID | Req ID | Category | Check | Pass criteria |
| ----- | ------ | -------- | ----- | ------------- |
| TC-026 | REQ-019 | Responsive | Viewport 390×844 | No horizontal scroll; readable text |
| TC-027 | REQ-019 | Responsive | Viewport 1440×900 | No horizontal scroll; readable text |
| TC-028 | REQ-020 | Accessibility | Keyboard tab through interactive elements | Visible focus ring on each |
| TC-029 | REQ-021 | Accessibility | Images and landmarks | All images have alt; header/main/footer landmarks present |

## 6. BDD scenarios

```gherkin
Feature: Home page
  As a visitor
  I want a summary home page
  So that I can discover articles and subscribe

  Scenario: View home page
    Given the site is loaded
    When I open the home page
    Then I see the header with brand "Re-Vision Blogger", nav, categories, search, and auth buttons
    And I see latest and popular article cards
    And I see a newsletter form in the footer

  Scenario: Categories only show non-empty ones
    Given mock posts exist in some categories only
    When I open the categories menu
    Then only categories with posts are listed

  Scenario: Newsletter invalid email
    Given I am on the home page
    When I enter "bad-email" and submit the newsletter form
    Then I see a validation error
    And no success message is shown

  Scenario: Newsletter valid email
    Given I am on the home page
    When I enter "user@example.com" and submit the newsletter form
    Then I see a success message

  Scenario: Responsive at mobile
    Given the viewport is 390x844
    When I open the home page
    Then there is no horizontal scroll
    And the hamburger menu is usable
```

## 7. Not directly testable

| Req ID | Why | How it will be verified |
| ------ | --- | ----------------------- |
| REQ-014 | Loading state timing is transient | Manual observation |

## 8. Open questions

| ID | Question | Blocks |
| -- | -------- | ------ |
| (none) | All resolved | — |