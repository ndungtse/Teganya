# Data model

## Record
```json
{
  "id": "rec_0001",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "category": "Food",
  "date": "2025-09-25",
  "createdAt": "2025-09-25T10:00:00.000Z",
  "updatedAt": "2025-09-25T10:00:00.000Z"
}
```
| Field | Rule |
|---|---|
| id | `rec_` plus a 4-digit counter, next one is the highest existing number plus one |
| description | no leading or trailing space, repeated spaces collapsed |
| amount | number in base currency, up to two decimals |
| category | letters, spaces and hyphens, must exist in settings categories |
| date | real calendar date, `YYYY-MM-DD` |
| createdAt, updatedAt | ISO strings, `updatedAt` changes on every edit |

## Settings
```json
{
  "baseCurrency": "RWF",
  "displayCurrency": "RWF",
  "rates": { "USD": 0.00069, "EUR": 0.00063 },
  "categories": ["Food", "Books", "Transport", "Entertainment", "Fees", "Other"],
  "cap": 200000,
  "theme": "system"
}
```
`rates[code]` is how many units of that currency equal one unit of the base currency. `displayCurrency` is `RWF`, `USD` or `EUR` and only changes how amounts are shown. `theme` is `system`, `light` or `dark`.

## Persistence
localStorage key `teganya:data` holds `{ "records": [], "settings": {} }`. It is saved after every state change.

## Import and export
Export downloads the same `{ records, settings }` object as pretty JSON. Import parses the file, checks the structure, field patterns, real dates and unique ids, and replaces data only if everything is valid. Otherwise it lists each problem by path, for example `records[3].date`.
