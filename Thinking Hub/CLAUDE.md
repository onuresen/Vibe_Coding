# Thinking Hub — Claude Context

## What this is
Multi-tool personal productivity web app. **No build step, no Node.js.** Pure HTML/CSS/JS loaded directly in browser. 8 standalone tool pages share one shell (`hub.html`) via iframe + postMessage.

## Architecture in one sentence
`hub.html` (shell) → loads tools in `<iframe id="app-frame">` → tools share state via `HubStorage` (localStorage + optional Supabase sync).

## File map
| File | Role |
|------|------|
| `hub.html` | Shell: sidebar, home dashboard, iframe router, cloud panel |
| `theme.css` | **Only** global CSS — all tools must use its variables |
| `hub-storage.js` | Storage adapter: `get/set/subscribe` + optional Supabase. Must load first. |
| `hub-data.js` | Read API for project/task/member data (`project-hub-v1`) |
| `hub-links.js` | Cross-tool linking via postMessage + UI (picker modal, badges) |
| `hub-search.js` | Global Cmd+K search, injected into hub.html only |
| `hub-tutorial.js` | Onboarding tour, injected into hub.html only |
| `hub-toast.js` | Toast notifications — tiny, self-contained |
| `hub-bootstrap.js` | Init coordinator (35 lines) — call last in each tool |
| `supabase-schema.sql` | Cloud DB schema |
| `project-hub.html` | Project + task tracking |
| `schedule.html` | Calendar / timeline |
| `idea-swiper.html` | Rapid idea triage (swipe) |
| `kmqt-board.html` | Known / Messy / Questions / Thinking board |
| `decision-hub.html` | Decision log + alignment matrix |
| `canvas-hub.html` | Infinite spatial canvas |
| `graph-hub.html` | Task dependency graph (vis-network) |
| `tool-portfolio.html` | Curated tool/vendor directory |

## Script load order (required)
`hub-storage.js` → `hub-links.js` / `hub-data.js` → `hub-bootstrap.js`

## CSS token conventions
All color, font, radius via CSS variables from `theme.css`. Never hardcode hex values — use:
- `var(--accent)` not `#b8f033`
- `var(--accent-dim)` for low-opacity tint (~0.1)
- `var(--accent-glow)` for medium-opacity tint (~0.25)
- `var(--accent-like/super/nope)` for status colors (green/orange/red)
- `var(--node-*)` / `var(--border-*)` for colored card variants
- `var(--font-body/display/mono)` for fonts
- `var(--surface/surface2/surface3)` for backgrounds
- `var(--text/text2/text3)` for text
- `var(--r/r-sm)` for border radius

Both dark (default) and light (`[data-theme="light"]`) are fully defined. Both must be kept in sync whenever adding new tokens.

## JS injected CSS rule
When JS modules inject `<style>` blocks (hub-links.js, hub-search.js, hub-tutorial.js), use CSS vars — not hardcoded hex. CSS vars resolve correctly in injected stylesheets.

## localStorage keys (source of truth)
`hub-session-v1`, `project-hub-v1`, `schedule-v1`, `decision-hub-v1`, `kmqt_current_v2`, `canvas-v1`, `hub-links-v1`, `ideaswipe_history_v6`, `hub-cloud-config-v1`, `th-theme`, `tutorial-seen-v1`

## External dependencies
| Lib | Used in | Version |
|-----|---------|---------|
| Google Fonts (Syne, DM Sans, JetBrains Mono) | All HTML files | latest |
| vis-network | graph-hub.html | **9.1.9** (pinned) |
| html2canvas | canvas-hub.html | **1.4.1** (pinned) |
| @supabase/supabase-js | hub-storage.js (dynamic) | **@2** |

## What NOT to do
- Do not add new color hex values — extend `theme.css` tokens instead
- Do not use `var(--font-m)` — it doesn't exist, use `var(--font-mono)`
- Do not use `color-mix()` without a fallback property above it
- Do not break `hub-storage.js` load order
- Do not hardcode colors in JS-injected CSS strings
- Do not use `var(--font-b)` or `var(--font-d)` (undefined aliases) — use `var(--font-body)` / `var(--font-display)`

## Shared UI primitives (already in theme.css — reuse, don't duplicate)
`.btn`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.card`, `.input/.select/.textarea`, `.label`, `.empty-state`, `.ui-modal-overlay / .ui-modal`, `.ui-section-header / .ui-section-title / .ui-section-line`

## Known duplication (accepted, don't add more)
- `_esc(s)` HTML-escape utility exists in both `hub-links.js` and `hub-search.js` — intentional isolation
- HubStorage safety shim in both `hub-data.js` and `hub-links.js` — intentional fallback

---

## Obsidian integration — current state (Option A, done)

**What's in place:**
- Vault name stored in `hub-settings-v1` → `{ obsidianVault: string }` via hub.html ⚙️ modal
- `project-hub.html` tasks: `obsidianNote` field on task objects; `⟡ Note` badge in task-meta opens `obsidian://` URI; `⟡` action button on hover calls `promptObsidianNote()` for any task (new or existing); field in Add Task modal
- `decision-hub.html` decisions: `obsidianNote` field; input + `⟡ Open` button in Log tab; saved in `saveCurrent()`
- Link format: `obsidian://open?vault={vaultName}&file={notePath}` — one-way, opens note in Obsidian

**Known limitation:** One-way only — app can open notes but cannot read content back.

---

## Obsidian integration — next plan (Option B)

**Goal:** Read the Obsidian vault folder directly in the browser, index note titles/frontmatter, and surface related notes next to items — no backend, no Obsidian running required.

**Approach:** File System Access API (`window.showDirectoryPicker()`)

**Implementation steps when ready:**

1. **New shared module `hub-obsidian.js`** — exposes `HubObsidian` singleton:
   - `HubObsidian.pickVault()` — calls `showDirectoryPicker()`, stores the `FileSystemDirectoryHandle` in memory and (if available) the persisted handle via `navigator.storage.getDirectory()`
   - `HubObsidian.indexVault()` — walks the dir recursively, reads all `.md` files, parses YAML frontmatter (`---` block), returns `[{ path, title, tags, aliases, frontmatter, snippet }]`
   - `HubObsidian.search(query)` — fuzzy match against indexed titles/aliases/tags
   - `HubObsidian.isAvailable()` — returns `typeof window.showDirectoryPicker === 'function'`
   - Store index in `hub-settings-v1` → `{ ..., obsidianIndex: [...], obsidianIndexedAt: ISO }` (refresh on demand)

2. **Frontmatter parsing** — inline micro-parser (no npm): split on `---`, parse `key: value` and `key: [a, b]` lines. No dependency needed for basic Obsidian frontmatter.

3. **UI additions:**
   - In hub.html ⚙️ modal: "Pick Vault Folder" button (shown only when `HubObsidian.isAvailable()`); shows indexed note count + last-indexed time; "Re-index" button
   - In `project-hub.html` task modal: autocomplete suggestions for `task-obsidian` field — as user types, show matching note titles from the index
   - In `decision-hub.html` log tab: same autocomplete on `i-obsidian` input
   - Optional: "Related notes" panel next to a task — shows notes whose title/tags overlap with task title

4. **Browser compatibility fallback:** If `showDirectoryPicker` not available, show a message pointing user to set the vault name manually (Option A still works without B).

5. **Storage key:** Vault `FileSystemDirectoryHandle` cannot be serialised to localStorage — must be re-requested each session. Store only the index (titles/paths/frontmatter) in `hub-settings-v1`. Handle stale index gracefully (show "last indexed X ago, re-index?").

**Files to create/modify:**
| File | Change |
|------|--------|
| `hub-obsidian.js` (new) | Full vault reader + index module |
| `hub.html` | Load `hub-obsidian.js`; add vault picker UI to ⚙️ modal |
| `project-hub.html` | Autocomplete on `task-obsidian` input |
| `decision-hub.html` | Autocomplete on `i-obsidian` input |
| `CLAUDE.md` | Move Option B to "done" when complete |

---

## Improvement Backlog

Prioritized list. Items marked with the same **group tag** can be implemented together in one session for efficiency.

### Priority 1 — Schedule ↔ Project Hub sync `[group: data-layer]`
**ID:** 1C  
Tasks with due dates in Project Hub should appear in `schedule.html` automatically. Items added in Schedule with a project ref should reflect in Project Hub. Requires a write path added to `hub-data.js` or a shared convention via `HubStorage.set('schedule-v1', ...)` from Project Hub.  
**Files:** `project-hub.html`, `schedule.html`, `hub-data.js`

---

### Priority 2 — Graph Hub: create links + edge notes + orphan filter `[group: graph-links]`
**ID:** 1D  
Graph Hub is view-only. Add:
- "Create Link" button to link two items without leaving Graph Hub
- Edge labels / notes (store in hub-links-v1 link object)
- "Orphaned items" filter chip (items with zero links)  
**Files:** `graph-hub.html`, `hub-links.js`

---

### Priority 3 — Hub dashboard widget items clickable `[group: hub-shell]`
**ID:** 2B  
Status widgets on the home dashboard show items (tasks, decisions, questions) but clicking opens the tool root, not the item. Use existing `hub-navigate` postMessage + hub-highlight protocol so clicking an item navigates directly to it.  
**Files:** `hub.html`

---

### Priority 4 — Decision Hub progressive disclosure `[group: decision-ux]`
**ID:** 2A  
Workspace tab has 9 fields across 3 lenses — overwhelming on first open. Show only "What's the decision?" initially; reveal further fields progressively (accordion or on-demand). Minimum viable decision = title + one option.  
**Files:** `decision-hub.html`

---

### ~~Priority 5 — Project Hub task filtering~~ ✓ Done `[group: project-ux]`
**ID:** 2E — **Implemented.**  
- Task filter bar (status + priority chips) exists in the single-project detail panel.  
- Overview filter bar added: **multi-select member chips**, project **status chips** (Active/Planning/On Hold/Done), **search input**, and **sort** (Manual/Name/Status/Open Tasks). Count badge shows "X of Y projects".  
- All Tasks view filter bar added: **multi-select member chips**, status chips (All/Open/Done), priority chips (All/High/Med/Low).  
- Kanban view respects `allTasksFilter` (member + priority).  
- Sidebar member pills now multi-select and sync with overview filter.  
- State keys: `overviewFilter { members[], status, search, sort }` and `allTasksFilter { members[], status, priority }` — session memory only, no new storage key.  
**Files:** `project-hub.html`

---

### Priority 6 — Better cross-tool onboarding tour `[group: hub-shell]`
**ID:** 2F  
Current tutorial covers tools in isolation. Add a "Quick Tour" that walks the power workflow: create project → swipe ideas → link to decision → graph view. 5 steps, triggered on first project creation. Reuses `hub-tutorial.js` step format.  
**Files:** `hub.html`, `hub-tutorial.js`

---

### Priority 7 — New tool: Focus Timer `[group: new-tools-solo]`
**ID:** 3B  
`focus-hub.html` — Pomodoro-style focus session tracker.
- Pick a task from Project Hub; 25/50-min countdown with SVG ring animation
- Session log (what, how long); daily/weekly histogram
- Marks task "in progress" during session; offers "mark done" at end  
**Storage key:** `focus-hub-v1`  
**Files:** New `focus-hub.html`; register in `hub.html` app list

---

### Priority 8 — New tool: Daily Log `[group: new-tools-solo]`
**ID:** 3D  
`log-hub.html` — Private daily captain's log.
- Date-stamped freeform markdown entries with 5-emoji mood picker
- GitHub-style mood heatmap + streak counter
- Searchable via Cmd+K (add resolver to `hub-links.js`)
- localStorage only by default (never auto-synced)  
**Storage key:** `log-hub-v1`  
**Files:** New `log-hub.html`; register in `hub.html`

---

### Priority 9 — New tool: Retrospective Board `[group: new-tools-team]`
**ID:** 3C  
`retro-hub.html` — Async team retro: Went Well / Improve / Actions columns.
- Emoji reaction voting (👍 ❤️ 🔥) per item; group by theme via drag
- Real-time collab via Supabase (items in `retro-hub-v1`)
- Export to markdown  
**Storage key:** `retro-hub-v1`  
**Files:** New `retro-hub.html`; register in `hub.html`

---

### Priority 10 — New tool: Assumption Tracker `[group: new-tools-team]`
**ID:** 3E  
`assumptions-hub.html` — Track assumptions behind decisions.
- Fields: statement, why it matters, confidence (1–5 stars), status (Assumed → Testing → Validated / Invalidated)
- Linked decision field (links to decision-hub items via hub-links)
- When invalidated → linked decision flagged "needs review"
- Horizontal swim-lane layout by status  
**Storage key:** `assumptions-hub-v1`  
**Files:** New `assumptions-hub.html`; register in `hub.html`

---

### Priority 11–14 — Visual polish pass `[group: visual-polish]`
**ID:** 4A, 4B, 4C, 4D — implement together, all touch `theme.css` or shared visual layer.

**4A — Dark/light Canvas node colors:** Light mode `--node-*` tokens are too washed out (e.g. blue = `#ddeeff` on white). Increase saturation; add a border to nodes in light mode for separation. **Files:** `theme.css`

**4B — Micro-animations on card interactions:** Slide-in-up + fade on card creation; checkmark pop + row fade on task complete; save feedback in Decision Hub. Pure CSS `@keyframes`. **Files:** `theme.css`, `project-hub.html`, `decision-hub.html`

**4C — Empty state illustrations:** Replace emoji + text with inline monochromatic SVG spot-illustrations per tool (Graph Hub: interconnected dots; Idea Swiper: blank card pile; KMQT: four empty columns). **Files:** per-tool HTML files

**4D — Iframe loading progress bar:** Subtle top-of-iframe progress bar during tool load (like YouTube's red bar). CSS animation triggered by class on the shell; no JS timing needed. **Files:** `hub.html`, `theme.css`

---

### Priority 15 — Project Hub compact mode `[group: project-ux]`
**ID:** 4E  
Density toggle (compact / comfortable). Compact = single-line rows (priority dot + title + assignee avatar). Comfortable = current full card. Toggle state stored in session.  
**Files:** `project-hub.html`

---

### Priority 16 — Escape utility deduplication `[group: tech-hygiene]`
**ID:** 5D  
`_esc()` exists in `hub-links.js` and `hub-search.js`; `escapeHtml()` / `escapeAttr()` in other tools. Extract to `hub-utils.js`, load before `hub-links.js`. Update Known Duplication note in this file.  
**Files:** New `hub-utils.js`, `hub-links.js`, `hub-search.js`, `hub-bootstrap.js` (load order), tool HTML files

---

### Priority 17 — Fix postMessage wildcard origin `[group: tech-hygiene]`
**ID:** 5A  
`hub-links.js` uses `postMessage(..., '*')`. Replace with `window.location.origin` or a config constant.  
**Files:** `hub-links.js`

---

### Priority 18 — z-index tokens `[group: tech-hygiene]`
**ID:** 5B  
Scattered z-index values (9000, 9999, 8500, 10000). Add `--z-modal`, `--z-popover`, `--z-overlay`, `--z-tooltip` to `theme.css`. Audit all HTML files.  
**Files:** `theme.css`, all HTML files

---

### Priority 19 — New tool: Weekly Review `[group: new-tools-solo]`
**ID:** 3A  
`review-hub.html` — Structured weekly review ritual.
- "Done this week": pull tasks completed in last 7 days from Project Hub
- "Capture": freeform wins/blockers/notes textarea
- "Next week": open tasks + pin 3 "big rocks" (draggable priority)
- Left-to-right timeline layout: Last week → Right now → Next week  
**Storage key:** `review-hub-v1`  
**Files:** New `review-hub.html`; register in `hub.html`

---

### Priority 20 — KMQT keyboard shortcut overlay `[group: kmqt-ux]`
**ID:** 2C  
Add a `?` button (top-right corner) that opens a compact keyboard shortcut cheatsheet overlay. Covers: 1–4 (focus columns), C (connect mode), E (edit), Del (delete), drag-drop. Reuse `.ui-modal-overlay` pattern.  
**Files:** `kmqt-board.html`

---

### Priority 21 — Tool Portfolio search `[group: solo-quick]`
**ID:** 2D  
Filter input above the sidebar list. Case-insensitive substring match on tool name + category. Clear button. No new storage key.  
**Files:** `tool-portfolio.html`

---

### Priority 22 — Idea Swiper → Project Hub pipeline `[group: cross-tool-bridges]`
**ID:** 1A  
"Send to Project Hub" button on Super/Like results. Opens a mini modal: pick project → creates a task with the idea text as title.  
**Files:** `idea-swiper.html`, `hub-data.js` (needs write path or direct `HubStorage.set`)

---

### Priority 23 — KMQT "Thinking" → Decision Hub `[group: kmqt-ux]`
**ID:** 1B  
Action button on T-column items: "Log as Decision". Pre-fills Decision Hub with title and source context; navigates via `HubLinks.navigateTo`.  
**Files:** `kmqt-board.html`, `decision-hub.html` (accept deep-link payload)

---

### Priority 24 — Decision Hub → KMQT question bridge `[group: decision-ux]`
**ID:** 1E  
Quick action in Decision Hub workspace: "Send to KMQT as Question". Creates a KMQT item in Q-column with the decision title as context. Uses `HubLinks.navigateTo`.  
**Files:** `decision-hub.html`, `kmqt-board.html`

---

### Priority 25 — Canvas nodes searchable via Cmd+K `[group: cross-tool-bridges]`
**ID:** 1F  
Add a canvas item resolver in `hub-links.js` `resolveItems()`. Each canvas node (text content) becomes a searchable item. Navigate-to highlights the node on canvas.  
**Files:** `hub-links.js`, `canvas-hub.html` (expose node list + highlight handler)
