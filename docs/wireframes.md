# Wireframes

Mobile is drawn at 360px, desktop at 1024px.

## Dashboard
```
Mobile                         Desktop
+------------------------+     +------------------------------------------------+
| Teganya           menu |     | Teganya  Dashboard Records Add Settings About  |
+------------------------+     +------------------------------------------------+
| Dashboard              |     | Dashboard                                      |
| +--------------------+ |     | +--------+ +--------+ +--------+ +------------+ |
| | Records        14  | |     | |Records | | Spent  | | Top    | | Cap        | |
| +--------------------+ |     | |   14   | | 143k   | | Food   | | 57k left   | |
| | Spent       143,200| |     | +--------+ +--------+ +--------+ +------------+ |
| +--------------------+ |     | Last 7 days                                    |
| | Top category  Food | |     |  |  ##       ##                                |
| +--------------------+ |     |  |  ##  ##   ##  ##       ##                   |
| Cap  [=====>   ] 71%   |     |  +--M---T---W---T---F---S---S--                |
| 57,000 remaining       |     | Cap [==============>        ] 57,000 remaining |
| Last 7 days            |     +------------------------------------------------+
|  ## ##    ##           |
|  M  T  W  T  F  S  S  |
+------------------------+
```

## Records
```
Mobile                         Desktop
+------------------------+     +------------------------------------------------+
| Records                |     | Records                                        |
| Search [ regex     ] [i]|     | Search [ regex pattern     ] [x] ignore case   |
| Sort   [ Date newest v]|     | Sort [ Date newest v]        error text here   |
| +--------------------+ |     | Description        Category   Date     Amount  |
| | Lunch at cafeteria | |     | ---------------------------------------------- |
| | Food  2025-09-25   | |     | Lunch at cafeteria Food       09-25    12.50   |
| | 12.50  [Edit][Del] | |     |                          [Edit] [Delete]       |
| +--------------------+ |     | Chemistry textbook Books      09-23    89.99   |
| | Chemistry textbook | |     |                          [Edit] [Delete]       |
| | ...                | |     +------------------------------------------------+
| +--------------------+ |
+------------------------+
```

## Add / Edit
```
Mobile                         Desktop
+------------------------+     +------------------------------------------------+
| Add record             |     | Add record                                     |
| Description            |     | Description                 Amount             |
| [____________________] |     | [______________________]    [____________]     |
| error message          |     | error message               error message      |
| Amount                 |     | Category                    Date               |
| [____________________] |     | [Food               v ]     [2025-09-25]       |
| Category               |     |                                                |
| [Food              v ] |     | [Save record]  [Cancel]                        |
| Date                   |     +------------------------------------------------+
| [2025-09-25]           |
| [Save record] [Cancel] |
+------------------------+
```

## Settings
```
Mobile                         Desktop
+------------------------+     +------------------------------------------------+
| Settings               |     | Settings                                       |
| Spending cap           |     | Spending cap [______]   Display [RWF v]        |
| [____________________] |     | Rates  1 RWF = [USD ____] [EUR ____]           |
| Rates (per 1 RWF)      |     | Categories  Food x  Books x  Fees x  [add____] |
| USD [______]           |     | Theme [System v]                               |
| EUR [______]           |     | [Export JSON]   [Import JSON ...]              |
| Categories             |     | import messages appear here                    |
| Food x  Books x  [add] |     +------------------------------------------------+
| Theme [System v]       |
| [Export] [Import]      |
+------------------------+
```

## About
```
+------------------------+
| About Teganya          |
| Purpose paragraph      |
| Contact: GitHub, email |
+------------------------+
```
