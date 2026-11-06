# Project instructions

- User-facing title: **The Neopolitan Novels**. Preserve this requested spelling.
- Publish to GitHub Pages from the root of `main` in `lynnbotsd/the-neopolitan-novels`.
- This is an ongoing collaboration with the user. Keep the interface and data easy to revise independently.
- A fresh page starts at Book 1. Book selection means **finished through the end of that book**.
- All rendered characters, relationship text, notes, histories, children, labels, and accessible descriptions must use `snapshot(book)` from `model.mjs`. Do not render raw future versions into hidden DOM or tooltips.
- Reveal information by when the reader learns it, not merely when an event occurred. Be particularly careful with Gennaro’s paternity and Nino’s relationships.
- Cross-family connections show romantic/sexual relationships and pursuits, not platonic friendships. Do not add an Elena–Lila relationship edge.
- Keep both Elena–Antonio and Elena–Donato in the map. Distinguish assault from dating.
- Families stay aligned across the top; parents branch to children. Preserve zoom and horizontal exploration while improving connection routing.
- Check factual changes against the novels, not just the preceding chat. Uncertain interpretations must be identified as such.
- Run `npm test` after data/model changes and check relevant UI behavior after interface changes.
- Run `npm run build` before publishing any browser-source changes. This versions the entry script, stylesheet, and every imported module together to prevent mixed cached releases.
- Do not add tokens, personal information, chat transcripts, or scratch files to this public repository.

- Dating and affairs are distinct categories. Never use a combined “Dating / affair” label. Elena–Gino and the early Elena–Antonio relationship are dating. Category changes belong to book-specific versions.
- Gino’s map node includes the subtitle “The pharmacist’s son”.

- Keep the Other characters directory outside the map canvas, above it. Only selected/connected characters without a family column appear in the map, in a dedicated rightmost column; never put an unrelated row through connection routes.

- Relationship category labels describe relationships occurring anywhere during the selected book. Use “Past” only when the relationship occurs solely in earlier books; a breakup within the selected book does not make that whole book’s category “Past”.

- Preserve the current left-to-right family order. Keep horizontal connection lanes and labels below all visible character cards; vertical stems run beside cards. Use distinct ports and tracks, and keep labels clear of cards and other routes. Compact route labels name the other person; complete details and children remain in the sidebar.

- Stack connection lanes and sidebar entries chronologically by first attraction or involvement, independently of family columns. Do not add visible sequence numbers. Preserve overlapping/uncertain timing labels; later relationship status changes must not reorder the original connection.
