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

---

## Schema Notes (v1.0 extensions, 2026-04-24)

- `WindowComposition.openingType`: `"window" | "door"` (migrated from old JSON if absent)
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
