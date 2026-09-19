<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


<!-- BEGIN:trip-talk-cursor-rules -->

# Trip Talk Cursor work rules

For routine development, this repository is worked on primarily through Cursor. Keep tasks small and explicit.

Before editing:
- Confirm this is `silmotoki-tech/trip-talk`.
- Check branch and `git status`.
- If there are uncommitted user changes, stop and report instead of overwriting them.
- Read only the handover docs relevant to the current task, especially `docs/handover/README.md` and `docs/handover/cursor-workflow.md`.

While editing:
- Treat one request as one narrow task unless the user explicitly asks otherwise.
- Do not redesign architecture, schemas, Firebase structure, auth, or learning behavior on your own.
- Do not broaden the task into unrelated refactors.
- If requirements conflict or are unclear, stop and ask instead of guessing.
- Never use `reset --hard`, rebase, or force push.

After editing:
- Review `git diff`.
- Run the validation commands requested for the task; for code changes, normally run `npm run lint` and `npm run build`.
- Report changed files, validation results, and any remaining uncertainty before commit/push.

See `docs/handover/cursor-workflow.md` for the canonical workflow.

<!-- END:trip-talk-cursor-rules -->
