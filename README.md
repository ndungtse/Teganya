# Teganya: Student Finance Tracker

Teganya is a small app for students to record spending, search it with regular expressions, see the last seven days at a glance and stay under a spending cap. It is built with vanilla HTML, CSS and JavaScript (ES modules), with no frameworks and no backend. Everything is stored in your browser.

### [Find Youtube Demo Here](https://youtu.be/4wRdbTwPscI)

**Theme:** Student Finance Tracker
**Live site (GitHub Pages):** https://ndungtse.github.io/Teganya/
**Contact:** see the About page inside the app

## Features
- Add, edit (inline) and delete records, with a confirmation dialog for delete
- Form and inline-edit validation with regular expressions and clear error messages
- Live regex search with an ignore-case toggle, safe compilation and `<mark>` highlighting
- Sort by date, description (A to Z) and amount (low to high), both directions
- Dashboard: total records, total spent, top category, last 7 days chart
- Spending cap with remaining or overage announced through ARIA live regions (polite under the cap, assertive over it)
- Base currency RWF with USD and EUR through manual rates in Settings, plus a display currency picker
- Editable categories, protected while records still use them
- Auto-save to localStorage, JSON export, and JSON import that is validated before anything changes
- Light, dark or system theme, persisted
- Responsive from 360px, with cards on small screens and a table from 768px
- Offline support and a jQuery scraping page are planned as stretch work

## Regex catalog
| Rule | Pattern | Matches | Rejects |
|---|---|---|---|
| Description, no leading or trailing space | `^\S(?:.*\S)?$` | `Lunch at cafeteria` | ` Lunch`, `Lunch ` |
| Amount, up to two decimals | `^(0\|[1-9]\d*)(\.\d{1,2})?$` | `0`, `12.5`, `99999.99` | `012`, `1.234`, `-3` |
| Date | `^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$` | `2026-10-14` | `2026-13-01` |
| Category | `^[A-Za-z]+(?:[ -][A-Za-z]+)*$` | `Side-Gigs Income` | `Food2`, `-Food` |
| Exchange rate, up to eight decimals | `^(0\|[1-9]\d*)(\.\d{1,8})?$` | `0.00069` | `0.123456789` |
| Advanced: repeated word (back-reference) | `\b(\w+)\s+\1\b` | `Coffee coffee run` | `Lunch at cafeteria` |
| Collapse extra spaces | `\s{2,}` replaced by one space | `Bus   pass` becomes `Bus pass` | |

The date is also checked against the real calendar, so `2025-02-30` is rejected even though it fits the pattern.

### Search examples
The search box tests each record's description, category, date and amount (shown with two decimals, in the base currency).

| Pattern | Finds |
|---|---|
| `coffee\|tea` | records mentioning coffee or tea |
| `\.(?!00)\d{2}\b` | amounts with non-zero cents (lookahead) |
| `^(?=.*coffee)(?!.*tea)` | coffee without tea (lookahead and negative lookahead) |
| `\b(\w+)\s+\1\b` | repeated words (back-reference) |
| `^4` | anything starting with 4, such as amounts or dates |
| `Snacks \(bulk\)` | literal parentheses |

An invalid pattern, such as `(`, shows an inline message and keeps the last valid results.

## Keyboard map
| Key | Action |
|---|---|
| Tab / Shift+Tab | Move between controls |
| Enter / Space | Activate buttons and links, open the file picker |
| Escape | Close the delete dialog, cancel inline edit |
| Arrow keys | Change options in a select |
| First Tab on any page | Skip to content link |

## Accessibility notes
- Landmarks (`header`, `nav`, `main`, `section`, `footer`), one `h1` per page, and a skip link
- Every field has a bound label, and errors are linked with `aria-describedby` and `aria-invalid`
- Route changes move focus to the page heading, and the delete dialog traps and restores focus
- Live regions announce saves, deletes, imports and the cap state (assertive when over the cap)
- Contrast checked in both themes: text at 4.5:1 or more, form borders at 3:1 or more
- Meaning never relies on color alone: cap and chart values are also text
- Motion is subtle and disabled under `prefers-reduced-motion`
- Full plan in [docs/a11y-plan.md](docs/a11y-plan.md)

## Data
- Record: `id`, `description`, `amount`, `category`, `date`, `createdAt`, `updatedAt`
- Amounts are stored in the base currency (RWF) and converted for display only
- Export downloads `{ records, settings }`; import checks every field and lists each problem by path (for example `records[3].date`) and changes nothing if any check fails
- `seed.json` holds 14 records with edge dates (leap day, year boundaries), tiny and large amounts, repeated words, a long description and regex characters
- More detail in [docs/data-model.md](docs/data-model.md)

## Run it
ES modules need a web server:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000.

## Run the tests
With the server running, open http://localhost:8000/tests.html. It runs the assertions for validators, search, stats, currency and import validation and shows pass or fail for each.

## Project layout
```
index.html  tests.html  seed.json
styles/     tokens, base, layout, components, motion
scripts/    state, storage, validators, search, stats, currency, ui/
tests/      harness and one test file per pure module
docs/       spec, data model, accessibility plan, wireframes
```
