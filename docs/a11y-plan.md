# Accessibility plan

## Structure
- Landmarks: `header`, `nav` (labelled), `main`, `section`, `footer`
- One visible `h1` per page section, headings in order
- Skip-to-content link is the first focusable element

## Keyboard
- Every action works without a mouse, in a logical tab order
- Visible focus ring on all interactive elements (2px accent, 2px offset)
- Route change moves focus to the new page heading
- Delete confirmation is a modal dialog that traps focus, closes on Escape and returns focus to its trigger
- Inline edit: Enter saves, Escape cancels, focus returns to the Edit button

## Forms
- Every input has a bound `<label>`, no placeholder-only labels
- Errors appear below the field, linked with `aria-describedby`, and the field gets `aria-invalid="true"`
- On failed submit, focus goes to the first invalid field

## Live regions
- `role="status"` polite region: record added, deleted, settings saved, page changed, search result count
- Assertive region: cap exceeded, import failed
- Invalid search pattern is announced in the status region and results stay as they were

## Visual
- Contrast: 4.5:1 for body text, 3:1 for large text and interface components, in both themes
- Information never depends on color alone: cap state and chart values also appear as text
- Touch targets at least 44px
- Layout works from 360px with no horizontal scroll

## Motion
- Only subtle transitions, all inside `prefers-reduced-motion: no-preference`

## Keyboard map
| Key | Action |
|---|---|
| Tab / Shift+Tab | Move between controls |
| Enter / Space | Activate buttons and links |
| Escape | Close dialog, cancel inline edit |
| Arrow keys | Change select options |
