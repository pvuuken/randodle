<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Randodle architecture rules

- Games are self-contained modules in `src/games/<id>/` implementing the `GameModule`
  contract in `src/types/game.ts` (state, scoring, share output and their own UI) —
  so the core platform never learns game-specific rules.
- A game becomes playable only by registering it in `src/engine/gameRegistry.ts`;
  no conditionals on game id anywhere else.
- Puzzle content lives in `src/data/*`, never inside components, so content can scale
  independently of logic.
- Cross-cutting behaviour (storage, streak, score, share, dates, daily schedule) lives in
  `src/services/*` and `src/engine/dailyGameService.ts`; components never touch
  `localStorage` directly, keeping a Supabase swap to one layer.
- UI text lives in `src/i18n/{en,nl}.ts` behind `useTranslation()`; game-specific text stays inside each game module (`locales` + a per-game TEXT map) and puzzle translations in `src/data/*` — so language never affects which daily game/puzzle is served and new languages need no redesign.
- Countries have one source of truth: `src/data/countryList.ts` (195 states, ISO alpha-2 codes, en/nl names, aliases, flag path), resolved via `src/services/countryService.ts`; puzzles reference countries by code only — so Country and Flag games never drift apart.
- Real films live in `src/data/movieList.ts` (approved 200, stable slug ids, TMDB id + poster path only; posters are referenced, never stored in the repo) — so the Movie Game can switch to it later without new data plumbing.
- Year events and Higher/Lower items/metrics/datasets live in `src/data/yearEvents.ts` and `src/data/higherLower/` (types, metrics, datasets, items); puzzles pick a dataset + metric id and the game reads `item.metrics[metricId]` — so new metrics or datasets need no game changes.
