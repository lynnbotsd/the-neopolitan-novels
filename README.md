# The Neopolitan Novels

A working, book-aware family atlas for Elena Ferrante’s novels. The title uses the spelling chosen for this project.

## Run locally

Requires Node.js 18+ for tests and Python 3 for the development server. No npm dependencies or build step.

```sh
npm test
npm run build
npm start
```

Open http://localhost:8080. GitHub Pages publishes the root of `main`.

## Editing together

- `data.mjs`: families, people, and relationship versions. Every version has the **book in which the information is revealed**, not the date the event happens.
- Character `appearsIn` arrays restrict visibility to specific books, independently of when a character was introduced. Older relationship history does not imply ongoing dating. Appearance overrides currently cover Gino, Bruno and Manuela; remaining characters still need a full appearance audit.
- `model.mjs`: builds a snapshot with no future people or versions. All visible text and map labels must come from this snapshot.
- `app.mjs`: map, character details, and interaction.
- `routing.mjs`: deterministic connection routing with a chronological stack below all character cards, separate endpoint ports, collision checks and pair labels with the relationship type underneath. Family positions do not move.
- `styles.css`: the standalone interface.
- `tests/spoilers.test.mjs`: book cutoffs and key spoiler regressions.

The page always starts at Book 1 with no character selected. The family tree is visible, but romantic/sexual connection lines and person details appear only after a visitor chooses a character. Selecting a book means the reader has finished that entire book. A book-level toggle cannot protect someone midway through that book. The site filters displayed information; the public repository contains the entire series' data.

Relationship data is a working editorial draft. Do not treat the previous chat as an authoritative source. Verify uncertain chronology against the novels before adding details; keep future information out of static character roles. The data distinguishes Donato’s assault from courtship and stages Gennaro’s paternity by the reader’s knowledge.

Use GitHub issues for UI ideas and plot corrections. Changes pushed to `main` automatically republish on GitHub Pages.

## Next UI iterations

- Add an accessible list view alongside the spatial map.
- Review each book cutoff against chapter-level references.
- Add a chapter selector if finer spoiler protection is wanted.

## References

The four novels and their character lists, supported by [Europa Editions](https://www.europaeditions.com/author/41/elena-ferrante) and [Elena Ferrante’s website](https://elenaferrante.com/works/my-brilliant-friend/). No novel text is reproduced.

Connection order follows first attraction or involvement, not the most recent event or a partner’s family column. Beginning metadata lives in each relationship’s first revealed version. Overlapping courtships and affairs with uncertain start times are labeled accordingly; their internal tie order does not establish a precise sequence.
