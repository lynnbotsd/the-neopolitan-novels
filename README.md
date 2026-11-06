# The Neopolitan Novels

A working, book-aware family atlas for Elena Ferrante’s novels. The title uses the spelling chosen for this project.

## Run locally

Requires Node.js 18+ for tests and Python 3 for the development server. No npm dependencies or build step.

```sh
npm test
npm start
```

Open http://localhost:8080. GitHub Pages publishes the root of `main`.

## Editing together

- `data.mjs`: families, people, and relationship versions. Every version has the **book in which the information is revealed**, not the date the event happens.
- `model.mjs`: builds a snapshot with no future people or versions. All visible text and map labels must come from this snapshot.
- `app.mjs`: map, character details, and interaction.
- `styles.css`: the standalone interface.
- `tests/spoilers.test.mjs`: book cutoffs and key spoiler regressions.

The page always starts at Book 1. Selecting a book means the reader has finished that entire book. A book-level toggle cannot protect someone midway through that book. The site filters displayed information; the public repository contains the entire series' data.

Relationship data is a working editorial draft. Do not treat the previous chat as an authoritative source. Verify uncertain chronology against the novels before adding details; keep future information out of static character roles. The data distinguishes Donato’s assault from courtship and stages Gennaro’s paternity by the reader’s knowledge.

Use GitHub issues for UI ideas and plot corrections. Changes pushed to `main` automatically republish on GitHub Pages.

## Next UI iterations

- Improve routing and spacing when several relationship lines share a family column.
- Add an accessible list view alongside the spatial map.
- Review each book cutoff against chapter-level references.
- Add a chapter selector if finer spoiler protection is wanted.

## References

The four novels and their character lists, supported by [Europa Editions](https://www.europaeditions.com/author/41/elena-ferrante) and [Elena Ferrante’s website](https://elenaferrante.com/works/my-brilliant-friend/). No novel text is reproduced.
