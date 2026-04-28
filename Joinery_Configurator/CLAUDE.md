# Window Configurator — Project Documentation

> **Rule:** Always read this file first before making any changes. Update the To-Do list and Changelog whenever a feature is completed or a new task begins.

---

## Overview

A professional-grade, fully interactive window configurator for architectural joinery. Users freely split a canvas into nested panels, assign window types (fixed, casement, sliding, etc.) to each leaf panel, configure frame dimensions, and export a clean JSON composition. The JSON can be imported into a Revit addin to create parametric window families.

**Who it's for:** Architects, joinery manufacturers, BIM coordinators using Revit.  
**Design philosophy:** More powerful and beautiful than anything currently available. Think Figma meets an architectural CAD tool.

---

## Quick Start

1. Open `WindowConfigurator_v1.html` in any modern browser — no server, no build step required.
2. A default 1200×900mm window appears. Click the canvas to select a pane.
3. Use the context toolbar (Split H / Split V / Delete / Type) to compose your window.
4. Adjust dimensions and frame properties in the right-hand Inspector.
5. Click **Export** to download the JSON composition.

---

## Architecture

### File Structure

```
Joinery_Platform/
├── CLAUDE.md                      ← This file (living project doc)
├── WindowConfigurator_v1.html     ← Main deliverable (single self-contained file)
├── WindowPlatform_v3.html         ← Legacy catalog-driven tool (reference only)
├── WindowPlatform_v2.html         ← Legacy dark theme (reference only)
├── catalog.windows.v0.json        ← Legacy catalog schema (reference only)
├── window.intent.v0.json          ← Legacy intent schema (reference only)
└── Backup/                        ← Old versions
```

### State Model

```js
AppState = {
  composition: WindowComposition,  // full schema object (see below)
  selectedId:  string | null,       // UUID of selected PanelNode
  hoveredId:   string | null,
  dragState:   DragState | null,   // active divider drag
  undoStack:   WindowComposition[], // for Ctrl+Z (max 50)
  dirty:       boolean,             // unsaved changes
}
```

All state mutations go through named functions. `render()` is the single entry point that redraws everything.

### Rendering Pipeline

```
render()
├── renderCanvas()
│   ├── renderDimLines()          outer + sub-dimension annotations
│   ├── renderFrameRect()         thick outer frame border
│   ├── renderNodeRecursive()     recursive pane/split tree
│   │   ├── split: divider handles + recurse children
│   │   └── pane:  glass fill + sash border + operation symbol + label
│   └── renderSelectionOverlay()  blue ring on selected node
├── renderInspector()             right panel fields update
├── renderOutline()               sidebar tree update
└── updateTopbar()                dirty asterisk, title
```

### SVG Coordinate Model

SVG `viewBox` = actual mm dimensions of the window (e.g., `0 0 1200 900`). This means:
- All numbers in the SVG = real millimetres — no conversion.
- Zoom = viewBox scaling — native SVG behaviour.
- Full redraw on every state change (imperceptible for window-scale compositions).

### Drag System

Divider handles are SVG `<rect>` elements (8px wide/tall). On mousedown, `AppState.dragState` is set with the start position. `mousemove` on `document` computes the delta in mm, clamps to a minimum pane size of 80mm, and updates the ratio. `mouseup` clears the state and marks dirty.

---

## JSON Schema v1.0

### WindowComposition

```json
{
  "schemaVersion": "1.0",
  "meta": {
    "id": "<uuid>",
    "name": "My Window",
    "createdAt": "<ISO8601>",
    "modifiedAt": "<ISO8601>"
  },
  "frame": {
    "overallWidth": 1200,
    "overallHeight": 900,
    "unit": "mm",
    "thickness": 50,
    "depth": 100,
    "innerOffset": 0,
    "outerOffset": 0,
    "material": "aluminium",
    "finish": ""
  },
  "composition": "<PanelNode>"
}
```

### PanelNode — Split

```json
{
  "id": "<uuid>",
  "kind": "split",
  "axis": "V",
  "dividers": [{ "ratio": 0.5 }],
  "children": ["<PanelNode>", "<PanelNode>"]
}
```

- `axis`: `"V"` = vertical divider (splits left/right), `"H"` = horizontal (splits top/bottom)
- `dividers`: N−1 entries for N children; `ratio` is 0–1 position along the parent dimension
- Children are ordered left-to-right (V) or top-to-bottom (H)

### PanelNode — Pane (leaf)

```json
{
  "id": "<uuid>",
  "kind": "pane",
  "type": "casement-left",
  "label": "Left Leaf",
  "glass": {
    "product": "clear",
    "thickness": 24,
    "uValue": null
  },
  "sash": {
    "thickness": 50,
    "direction": null,
    "handleSide": "right"
  }
}
```

---

## Panel Type Reference

| Type ID | Label | BIM Ref | Sash Required | Symbol |
|---------|-------|---------|--------------|--------|
| `fixed` | Fixed Glass | `W-FIX` | No | None |
| `casement-left` | Casement (Hinge Left) | `W-CS-L` | Yes | Diagonal arc, opens left |
| `casement-right` | Casement (Hinge Right) | `W-CS-R` | Yes | Diagonal arc, opens right |
| `casement-top` | Casement (Hinge Top) | `W-CS-T` | Yes | Diagonal arc, opens up |
| `casement-bottom` | Casement (Hinge Bottom) | `W-CS-B` | Yes | Diagonal arc, opens down |
| `awning` | Awning | `W-AW` | Yes | Horizontal arc, opens out-up |
| `hopper` | Hopper | `W-HP` | Yes | Horizontal arc, opens in-down |
| `sliding-2t` | Sliding 2-Track | `W-SL2` | Yes | Double-headed arrow |
| `sliding-3t` | Sliding 3-Track | `W-SL3` | Yes | Triple arrow |
| `pivot-v` | Pivot Vertical | `W-PV-V` | Yes | Vertical line + arcs |
| `pivot-h` | Pivot Horizontal | `W-PV-H` | Yes | Horizontal line + arcs |
| `tilt-turn` | Tilt & Turn | `W-TT` | Yes | Combined casement + awning |
| `louvre` | Louvre | `W-LV` | Yes | Parallel lines |
| `door-single` | Single Door | `D-SG` | Yes | Arc + threshold |
| `door-double` | Double Door | `D-DB` | Yes | Two arcs + threshold |
| `door-sliding` | Sliding Door | `D-SL` | Yes | Arrow + threshold |
| `door-bifold` | Bifold Door | `D-BF` | Yes | Fold lines + threshold |
| `door-french` | French Doors | `D-FR` | Yes | Two arcs + threshold |
| `sliding-single` | Single Slide (片引き) | `W-SL1` | Yes | Single arrow + FIX label |
| `hung-double` | Double Hung (上げ下げ窓) | `W-HD` | Yes | Up/down arrows + mid divider |
| `projecting` | Projecting (突出し窓) | `W-PJ` | Yes | Bottom diagonals + outward arc |
| `tate-suberidashi` | Vert. Slide-Out (縦すべり出し窓) | `W-TSS` | Yes | Left diagonals + side arc |
| `door-pocket` | Pocket Door (引込戸) | `D-PK` | Yes | Arrow + dashed pocket wall |
| `door-overhead` | Overhead Door (オーバーヘッドドア) | `D-OH` | Yes | Horizontal hatch + threshold |
| `door-accordion` | Accordion Door (アコーディオンドア) | `D-AC` | Yes | Zigzag folds + threshold |
| `door-parent-child` | Parent-Child Door (親子扉) | `D-PC` | Yes | Large arc + small arc + threshold |
| `casement-double` | Double Casement (両開き) | `W-CS-DB` | Yes | Both leaves swing from centre |
| `outward-tilt` | Outward Tilt (外倒し) | `W-OT` | Yes | Top-hung opens outward-up (WPS_T) |
| `sliding-apart` | Slide Apart (引分け) | `W-SLA` | Yes | Two panels slide from centre |
| `sliding-left` | Single Slide L (片引き左勝手) | `W-SL1-L` | Yes | Left-handed single slide + FIX |
| `door-sliding-apart` | Door Slide Apart (引分け扉) | `D-SLA` | Yes | Two door panels slide apart |
| `door-free-swing` | Free Swing (自由戸) | `D-FS` | Yes | Swings both directions (café door) |
| `door-bypass` | Bypass Door (立て引き) | `D-BP` | Yes | Two panels on overlapping tracks |
| `shoji` | Shoji Screen (障子) | `W-SJ` | Yes | Cross-hatch grid + slide arrow |
| `fusuma` | Fusuma Panel (襖) | `W-FM` | Yes | Solid rails + knob + slide arrow |
| `ranma` | Ranma Transom (欄間) | `W-RN` | No | Dense kumiko lattice + diagonal accents |
| `koshido` | Lattice Door (格子戸) | `D-KS` | Yes | Open lattice grid + threshold |
| `shitomido` | Shitomido Shutter (蔀戸) | `D-ST` | Yes | Upper panel folds out-up |
| `agedo` | Lift Door (上げ戸) | `D-AG` | Yes | Upward arrow + track rails + threshold |

**Curtain Wall types** share the same operation IDs as windows but resolve to `CuPnl-*` BIM codes when `openingType = "curtain"`. Available subset: fixed, casement-left/right, casement-double, louvre, sliding-single, sliding-left, sliding-apart, projecting, tate-suberidashi, outward-tilt, pivot-v, door-parent-child.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Del` / `Backspace` | Delete selected pane |
| `H` | Split selected pane horizontally |
| `V` | Split selected pane vertically |
| `Ctrl+Z` | Undo (up to 50 steps) |
| `Escape` | Deselect |
| `Ctrl+E` | Export JSON |
| `Ctrl+I` | Import JSON |
| `Ctrl+N` | New composition |
| `Ctrl+C` | Copy selected panel config |
| `Ctrl+V` | Paste config onto selected panel |

---

## Roadmap / To-Do List

### ✅ Completed
- CLAUDE.md created

### 🚧 Phase 2 — Skeleton + Canvas
- [x] HTML structure + CSS (dark theme, 3-column grid)
- [x] Default AppState (single pane 1200×900)
- [x] `renderCanvas()` — frame + pane + dimension lines
- [x] `selectNode()` + selection highlight
- [x] Context toolbar: Split H / Split V / Delete

### 🚧 Phase 3 — Drag Resize
- [x] Divider handle rendering
- [x] Mouse drag system with min-pane clamp
- [x] Live visual feedback

### 🚧 Phase 4 — Panel Types & Symbols
- [x] Type palette in sidebar
- [x] Type dropdown in context toolbar + inspector
- [x] All operation symbols in SVG
- [x] Glass colour by type

### 🚧 Phase 5 — Frame Configuration
- [x] Frame accordion with all inputs
- [x] Width/height drives SVG viewBox
- [x] Mini section diagram in inspector

### 🚧 Phase 6 — Import / Export
- [x] JSON export
- [x] JSON import with validation
- [x] "New" with dirty confirm

### ✅ Phase 7 — Polish
- [x] SVG pan (middle-mouse) + zoom (scroll wheel), Fit (F key / button)
- [x] Panel outline tree in sidebar
- [x] Keyboard shortcuts + undo stack (Ctrl+Z, max 50)
- [x] Dimension line toggle (D key / button)
- [x] Hover tooltips on dividers (show mm sizes each side)
- [x] Zoom indicator (bottom-right of canvas)
- [x] + / - keyboard zoom, zoom-at-cursor on scroll wheel

### ✅ Phase 8 — Doors, Customisation & Templates
- [x] **Editable panel dimensions** — W/H cells in Dimensions table are now inputs; typing a value adjusts the divider ratio
- [x] **Per-side frame widths** — Top/Bottom/Left/Right overrides for frame thickness (blank = inherit from Thickness)
- [x] **Door + Window mode** — Opening Type toggle in sidebar + inspector; 5 door panel types (Single, Double, Sliding, Bifold, French) with threshold symbols
- [x] **Quick-start templates** — Templates modal (6 window + 5 door presets) with SVG previews; dirty-check on load

### ✅ Phase 9 — Obayashi BIM Alignment + Plan View
- [x] **BIM type reference codes** — `TYPE_REFS` map assigns every panel type an Obayashi-aligned code (e.g. `W-CS-L`, `D-SL`); displayed as a styled chip in the Selected Panel inspector; exported in JSON as `"ref"` field on each pane node
- [x] **Plan / top view** — SVG plan diagram in the Frame inspector shows the full composition as a horizontal cross-section (viewed from above); renders frame rails, mullions, glass lines, sash profiles, and opening-swing arcs per pane type; highlights selected panel; updates on every state change

### ✅ Phase 10 — Japanese Window & Door Types (JIS A 0150)
- [x] **4 new window types** — 片引き (Single Slide `W-SL1`), 上げ下げ窓 (Double Hung `W-HD`), 突出し窓 (Projecting `W-PJ`), 縦すべり出し窓 (Vert. Slide-Out `W-TSS`)
- [x] **4 new door types** — 引込戸 (Pocket `D-PK`), オーバーヘッドドア (Overhead `D-OH`), アコーディオンドア (Accordion `D-AC`), 親子扉 (Parent-Child `D-PC`)
- [x] **Elevation symbols** — JIS-aligned SVG operation symbols for all 8 new types in `drawSymbol()`
- [x] **Plan view** — cross-section rendering for all 8 new types in `renderPlanView()`
- [x] **Templates** — 親子扉 and 引込戸 presets added to Templates modal
- [x] **CLAUDE.md** — Panel Type Reference table and Changelog updated

### ✅ Phase 11 — Obayashi Catalog Extension + Bilingual + Curtain Wall
- [x] **7 new operation types** — 両開き (`W-CS-DB`), 外倒し (`W-OT`), 引分け (`W-SLA`), 片引き左勝手 (`W-SL1-L`), 引分け扉 (`D-SLA`), 自由戸 (`D-FS`), 立て引き (`D-BP`) — derived from Obayashi WPS/VPS family thumbnails
- [x] **Bilingual catalog** — `label_ja` field on all 33 types; `L(typeId)` helper returns current-language label
- [x] **EN / JA toggle** — `EN | JA` button pair in topbar; preference saved to localStorage; all palette labels, dropdown options, and optgroup headers switch live via `applyLang()`
- [x] **Curtain Wall category** — 3rd opening type (`"curtain"`) alongside Window and Door; `Window | Door | Curtain` toggle; 12-type curtain palette with CuPnl_ BIM codes; `getRef(typeId, openingCategory)` resolves correct code per context
- [x] **Context-aware BIM refs** — exported JSON `"ref"` field reflects opening category (e.g. `CuPnl-F` for fixed curtain, `W-FIX` for fixed window)
- [x] **New templates** — 3 extra window (両開き, 引分け, 4枚建引違い) + 4 curtain (Fixed, 片開き, 引分け, 両開き) presets in Templates modal
- [x] **Elevation + plan symbols** — `drawSymbol()` and `renderPlanView()` cases for all 7 new types

### ✅ Phase 12 — Auto-save + Glass Performance
- [x] **Auto-save to localStorage** — composition saved on every render; `loadDraft()` on page load shows recovery banner; Load Draft / Dismiss buttons
- [x] **Glass performance fields** — U-value (W/m²K), SHGC, VLT inputs per pane in inspector; colour-coded thermal rating badge (A++ → C)
- [x] **GLASS_PRESETS auto-fill** — selecting a glass product (clear, low-e, laminated, etc.) auto-populates U-value, SHGC, VLT
- [x] **JIS performance metadata accordion** — 気密/水密/耐風圧/断熱/遮音 selects in Frame inspector; stored as `frame.performance`; exported in JSON

### ✅ Phase 13 — Traditional Japanese Types + Copy/Paste
- [x] **6 traditional Japanese panel types** — 障子 (`W-SJ`), 襖 (`W-FM`), 欄間 (`W-RN`), 格子戸 (`D-KS`), 蔀戸 (`D-ST`), 上げ戸 (`D-AG`) with elevation symbols, plan view, EN/JA labels
- [x] **Copy / Paste panes** — `Ctrl+C` copies selected pane config (type, glass, sash, label); `Ctrl+V` pastes onto selected pane; uses undo stack
- [x] **4 new templates** — 障子 Screen, 欄間 Transom (window tab); 格子戸 Lattice Door, 上げ戸 Lift Door (door tab)

### ✅ Phase 14 — Open/Close Animation Preview
- [x] **Animation type sets** — `SLIDE_H_TYPES`, `SLIDE_V_TYPES`, `HINGE_L/R/T/B_TYPES`, `DOUBLE_H_TYPES`, `FOLD_TYPES`, `PIVOT_TYPES`, `LOUVRE_ANIM` — covers all 39 animatable operation types
- [x] **`openFraction` per pane** — runtime-only (0 = closed, 1 = fully open); stripped from JSON export; reset on type change, paste, new/import
- [x] **Animation controller** — `startPaneAnimation(id, target)` + `_animStep()` rAF loop; cubic ease-out over 480ms; calls `renderCanvas()` only (no autosave during playback)
- [x] **`renderPaneAnimated()`** — 10 animation categories: horizontal slide, vertical slide, hinge-left/right/top/bottom, double-hinge, fold, pivot, louvre; SVG clipPath per pane for clean edge clipping
- [x] **Inspector "Preview" UI** — Open / Close buttons + status label ("Closed" / "47% open" / "Fully open"); shown only for animatable types; hidden for fixed/ranma

### 🔲 Phase 15 — 連窓 Series Window + Bill of Materials
- [ ] **連窓 (Renso) layout tool** — "Add to series" button chains identical compositions side-by-side with shared dimension line; exports as `SeriesComposition` wrapper
- [ ] **Bill of Materials (BOM) export** — CSV/JSON with rows per panel type: BIM ref, qty, W×H, area (m²), glass product, sash thickness, material; summary row for totals

### 🔲 Phase 15 — Multi-Select + Batch Assign
- [ ] `Shift+Click` multi-select with dashed-ring highlight
- [ ] Context toolbar "Assign type to all selected"
- [ ] Aggregate area shown in dimensions table for selection

### 🔲 Phase 16 — Technical Drawing / PDF Export
- [ ] "Print Drawing" button → print-formatted SVG/HTML with elevation + plan views
- [ ] Title block: project name, date, scale, drawn-by
- [ ] BIM ref legend table + JIS performance metadata block
- [ ] Pure client-side via `window.print()` + `@media print` stylesheet

---

## Schema Notes (v1.0 extensions, 2026-04-24)

- `WindowComposition.openingType`: `"window" | "door" | "curtain"` (migrated from old JSON if absent)
- `frame.topWidth / bottomWidth / leftWidth / rightWidth`: `number | null` — `null` means inherit from `frame.thickness`
- New pane types: `door-single`, `door-double`, `door-sliding`, `door-bifold`, `door-french`
- Helper `frameWidths(f)` returns `{top, bottom, left, right}` resolving nulls — used everywhere in rendering

---

## Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-04-23 | v0.1 | CLAUDE.md created, WindowConfigurator_v1.html initial build |
| 2026-04-24 | v0.2 | Phase 7 polish: SVG pan/zoom, dimension toggle, divider tooltips, zoom indicator |
| 2026-04-24 | v0.3 | Phase 8: editable dimensions, per-side frame widths, door types + opening mode, templates modal |
| 2026-04-25 | v0.4 | Phase 9: Obayashi BIM type reference codes (W-FIX, W-CS-L, D-SL etc.) + plan/top view SVG in inspector |
| 2026-04-25 | v0.5 | Phase 10: 8 Japanese JIS-aligned panel types (片引き, 上げ下げ窓, 突出し, 縦すべり出し, 引込戸, オーバーヘッド, アコーディオン, 親子扉) with elevation symbols, plan view, templates |
| 2026-04-26 | v0.6 | Phase 11: 7 new Obayashi-derived types (両開き, 外倒し, 引分け, 片引き左, 引分け扉, 自由戸, 立て引き); EN/JA bilingual toggle; Curtain Wall 3rd category with CuPnl-* BIM codes; 7 new templates |
| 2026-04-27 | v0.7 | Phase 12: auto-save to localStorage with draft recovery banner; glass U-value/SHGC/VLT fields with thermal rating badge; GLASS_PRESETS auto-fill; JIS 気密/水密/耐風圧/断熱/遮音 performance accordion |
| 2026-04-27 | v0.8 | Phase 13: 6 traditional Japanese types (障子, 襖, 欄間, 格子戸, 蔀戸, 上げ戸) with elevation/plan symbols and templates; Ctrl+C/V copy-paste panes |
| 2026-04-28 | v0.9 | Phase 14: open/close animation preview for all 39 animatable types (slide, hinge, fold, pivot, louvre); cubic ease-out rAF loop; inspector Open/Close buttons; openFraction stripped from JSON export |
