# Teganya: Student Finance Tracker

Teganya helps a student see where money goes: log spending, search it with regular expressions, watch a weekly trend, and stay under a self-set cap. It runs entirely in the browser, with no frameworks and no backend.

## Pages
| Page | Route | Purpose |
|---|---|---|
| Dashboard | `#/dashboard` | Totals, top category, last 7 days, cap status |
| Records | `#/records` | Table (cards on mobile), sort, regex search, inline edit, delete |
| Add / Edit | `#/form` | Validated form for one record |
| Settings | `#/settings` | Cap, manual exchange rates, categories, import/export, theme |
| About | `#/about` | Purpose and contact |

## Features
- Records with id, description, amount, category, date and timestamps
- Four regex validation rules plus a back-reference check for repeated words
- Live regex search with case toggle, safe compilation and `<mark>` highlighting
- Sort by date, description and amount
- Stats: total records, total spent, top category, last 7 days chart
- Spending cap with polite and assertive live announcements
- Base currency RWF with USD and EUR through manual rates
- Auto-save to localStorage, JSON import with validation, JSON export
- Light and dark themes, keyboard-only use, responsive from 360px

## Units and currency
Amounts are stored in the base currency (RWF). A display currency picker converts for viewing only, using rates entered in Settings. No network calls.

## Stretch
Service worker for offline use and a jQuery page that scrapes a static HTML snippet into JSON.

## Constraints
Vanilla HTML, CSS and JavaScript (ES modules). No file over 400 lines. Hosted on GitHub Pages.
