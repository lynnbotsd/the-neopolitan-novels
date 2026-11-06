# Project instructions

- User-facing title: **The Neopolitan Novels**. Preserve this requested spelling.
- Publish to GitHub Pages from the root of `main` in `lynnbotsd/the-neopolitan-novels`.
- This is an ongoing collaboration with the user. Keep the interface and data easy to revise independently.
- A fresh page starts at Book 1. Book selection means **finished through the end of that book**.
- All rendered characters, relationship text, notes, histories, children, labels, and accessible descriptions must use `snapshot(book)` from `model.mjs`. Do not render raw future versions into hidden DOM or tooltips.
- Reveal information by when the reader learns it, not merely when an event occurred. Be particularly careful with Gennaro’s paternity and Nino’s relationships.
- Keep both Elena–Antonio and Elena–Donato in the map. Distinguish assault from dating.
- Families stay aligned across the top; parents branch to children. Preserve zoom and horizontal exploration while improving connection routing.
- Check factual changes against the novels, not just the preceding chat. Uncertain interpretations must be identified as such.
- Run `npm test` after data/model changes and check relevant UI behavior after interface changes.
- Do not add tokens, personal information, chat transcripts, or scratch files to this public repository.
