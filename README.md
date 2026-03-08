# AI Flow Studio - Pro

A single-file, browser-based prompt builder for AI assistants. Create reusable, modular prompt templates with dynamic variables, shared state across flows, and flow-to-flow chaining — all saved locally in your browser.

---

## Quick Start

1. Open `index.html` in any modern browser.
2. Write a template in the **Instruction Template** editor using `{{VARIABLE}}` placeholders.
3. Fill in the generated input fields below the template.
4. Click **"Generate & Copy Prompt"** — your assembled prompt is now on the clipboard.

No server, no dependencies, no installation required.

---

## Features

### Flows (Tabs)

Each flow is an independent prompt workspace. Use multiple flows to organize different prompt types (coding, writing, translation, etc.).

| Action | How |
|---|---|
| Create a flow | Click **"+ New Flow"** in the sidebar |
| Switch flows | Click a flow name in the sidebar |
| Rename a flow | Double-click the flow name |
| Reorder flows | Drag and drop flows in the sidebar |
| Delete a flow | Click the **✕** button on the tab |

> You cannot delete the last remaining flow.

### System Block

An optional section for system-level instructions (persona, rules, constraints). When enabled, the generated output wraps content in `SYSTEM:` and `USER:` sections.

- Toggle visibility with the **"Enable System Prompt Block"** checkbox.
- Collapse/expand the section by clicking the **"System Block"** header.

### Instruction Template

The main body of your prompt. Write instructions here using `{{PLACEHOLDER}}` syntax to create dynamic fields.

**Example template:**
```
You are a {{ROLE}}.
Translate the following text to {{LANGUAGE}}:

{{TEXT}}
```

This automatically creates three input fields: `ROLE`, `LANGUAGE`, and `TEXT`.

### Dynamic Variables

Any `{{TAG_NAME}}` in the template generates an input field automatically. Values are injected when you click "Generate & Copy Prompt".

- Variables are **per-flow** — each flow has its own set of values.
- Removing a `{{TAG}}` from the template removes its input field.
- Variable names are case-sensitive.

### Shared Variables

Use `{{SHARED:variable_name}}` for variables that persist across **all** flows. Update a shared variable in one flow and the change applies everywhere.

**Use cases:**
- `{{SHARED:project_context}}` — define project context once, reuse in every flow.
- `{{SHARED:style_guide}}` — a common style guide for all writing prompts.

Shared variables are visually distinguished with a blue left border and a "SHARED" / "GLOBAL" badge.

### Flow Linking

Use `{{TAB:FlowName}}` to embed the **generated output** of another flow into the current template. This enables prompt pipelines — chain flows together so the output of one feeds into another.

**Example:**
- Flow "Outline" generates a document outline.
- Flow "Draft" contains `{{TAB:Outline}}` to include that outline as context.

> Circular dependencies are detected and will show an error message instead of looping.

### Generate & Copy

Click **"Generate & Copy Prompt"** to:
1. Resolve all `{{TAB:...}}` references recursively.
2. Replace all `{{SHARED:...}}` with shared variable values.
3. Replace all `{{LOCAL_VAR}}` with local variable values.
4. If the system block is enabled, wrap with `SYSTEM:` / `USER:` labels.
5. Copy the final assembled prompt to the clipboard.

---

## Menus

### Sidebar Menu (☰)

Click the **"Flows"** header in the sidebar to open the settings menu.

| Option | Description |
|---|---|
| **Theme: Dark / Light** | Toggle between dark and light mode |
| **Language: EN / ES** | Switch the UI between English and Spanish |
| **Tutorial / Help** | Open the in-app tutorial with full feature documentation |
| **Export Config** | Download all flows and shared variables as a JSON file |
| **Import Config** | Load a previously exported JSON file to restore flows |
| **Clear Studio Data** | Delete all flows, variables, and settings permanently |

### Gear Menu (⚙)

Click the **⚙** button next to "Generate & Copy Prompt".

| Option | Description |
|---|---|
| **Download .md** | Save the current template as a Markdown file |
| **Copy Sys Only** | Copy just the system prompt to the clipboard |
| **Clear Inputs** | Reset all variable values in the current flow |

---

## Editor Features

- **Line numbers** are shown alongside every text area.
- **Tab key** inserts a tab character instead of moving focus.
- **Enter key** auto-indents based on the current line's leading whitespace.
- **Resize** any text area by dragging the bottom-right corner.
- **Timestamps** — each field shows a "Modified" timestamp (GMT-5) indicating the last edit.

---

## Character Counts

The info bar at the bottom of the workspace shows:

- **Sys** — character count of the system prompt.
- **Tpl** — character count of the instruction template.
- **Dynamic Vars** — combined character count of all variable inputs.
- **Total Pipeline** — sum of all the above.

---

## Data & Persistence

- All data is stored in the browser's **localStorage**.
- Data saves automatically on every keystroke (debounced at 500ms).
- Storage keys use a `_v12` suffix for versioning.

### Export / Import

- **Export** creates a JSON file containing all flows and shared variables.
- **Import** accepts either:
  - The full export format (`{ tabs: [...], sharedStore: {...} }`)
  - A legacy array-only format (`[...]`)

### Clear Studio Data

Removes all localStorage entries and resets to a single default flow. **This cannot be undone.**

---

## Internationalization (i18n)

The app supports two languages:

| Language | Code | Setting |
|---|---|---|
| English | `en` | Default |
| Spanish | `es` | Toggle via sidebar menu |

All UI labels, button text, modal messages, placeholders, status messages, and the tutorial content are fully translated.

---

## Technical Details

- **Single HTML file** — no build step, no external dependencies.
- **Zero network requests** — works fully offline.
- **Vanilla JavaScript** — no frameworks or libraries.
- **CSS custom properties** for theming (dark/light).
- **Font:** Inter (system fallback), Cascadia Code (monospace editors).
- **LocalStorage keys:**
  - `modular_flows_v12` — flow data (tabs array)
  - `active_tab_id_v12` — currently selected tab ID
  - `theme_mode_v12` — `"dark"` or `"light"`
  - `app_lang_v12` — `"en"` or `"es"`
  - `modular_shared_v12` — shared variable store

---

## Browser Compatibility

Works in any modern browser that supports:
- ES6+ (template literals, arrow functions, destructuring)
- `localStorage`
- `navigator.clipboard.writeText`
- CSS custom properties
- `ResizeObserver`

Tested in Chrome, Edge, Firefox, and Safari.

---

## License

This project is provided as-is for personal and educational use.
