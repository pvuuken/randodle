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
