# AI Flow Studio - Pro

A single-file, browser-based prompt builder for AI assistants. Create reusable, modular prompt templates with dynamic variables, shared state across flows, and flow-to-flow chaining — all saved locally in your browser.

---

## Quick Start

1. Open `index.html` in any modern browser.
2. Write a template in the **Instruction Template** editor using `{{VARIABLE}}` placeholders.
3. Fill in the generated input fields below the template.
4. Click **"Preview"** to inspect the assembled prompt, or **"Generate & Copy Prompt"** to copy it to clipboard.

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
| Duplicate a flow | Click the **&#9783;** button on the tab |
| Delete a flow | Click the **&#10005;** button on the tab |
| Search flows | Type in the search bar at the top of the sidebar |

> You cannot delete the last remaining flow.

### System Block

An optional section for system-level instructions (persona, rules, constraints). When enabled, the generated output wraps content in `SYSTEM:` and `USER:` sections.

- Toggle visibility with the **"Enable System Prompt Block"** checkbox.
- Collapse/expand the section by clicking the **"System Block"** header.

### Instruction Template

The main body of your prompt. Write instructions here using `{{PLACEHOLDER}}` syntax to create dynamic fields. When the template is empty, a helpful placeholder shows example syntax.

**Example template:**
```
You are a {{ROLE}}.
Translate the following text to {{LANGUAGE}}:

{{TEXT}}
```

This automatically creates three input fields: `ROLE`, `LANGUAGE`, and `TEXT`.

**Variable tag chips** appear below the template showing detected variables at a glance:
- Blue chips for local variables `{{VAR}}`
- Purple chips for shared variables `{{SHARED:x}}`
- Green chips for linked flows `{{TAB:x}}`

Click a chip to scroll to its input field.

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

### Preview

Click **"Preview"** to see the fully assembled prompt in a modal before copying. The preview highlights:
- **Unresolved variables** (yellow) — `{{TAG}}` placeholders that weren't filled in.
- **Errors** (red) — circular dependencies or missing flow references.

You can copy directly from the preview panel.

### Generate & Copy

Click **"Generate & Copy Prompt"** to:
1. Resolve all `{{TAB:...}}` references recursively.
2. Replace all `{{SHARED:...}}` with shared variable values.
3. Replace all `{{LOCAL_VAR}}` with local variable values.
4. If the system block is enabled, wrap with `SYSTEM:` / `USER:` labels.
5. Copy the final assembled prompt to the clipboard.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| **Ctrl+Enter** | Generate & Copy prompt |
| **Ctrl+Shift+N** | Create a new flow |
| **Escape** | Close modals and menus |
| **Tab** (in editor) | Insert a tab character |
| **Enter** (in editor) | Auto-indent based on current line |

---

## Menus

### Sidebar Menu (&#9776;)

Click the **"Flows"** header in the sidebar to open the settings menu.

| Option | Description |
|---|---|
| **Theme: Dark / Light** | Toggle between dark and light mode |
| **Language: EN / ES** | Switch the UI between English and Spanish |
| **Tutorial / Help** | Open the in-app tutorial with full feature documentation |
| **Export Config** | Download all flows and shared variables as a JSON file |
| **Import Config** | Load a previously exported JSON file to restore flows |
| **Clear Studio Data** | Delete all app-specific flows, variables, and settings |

### Gear Menu (&#9881;)

Click the **&#9881;** button next to "Generate & Copy Prompt".

| Option | Description |
|---|---|
| **Download .md** | Save the current template as a Markdown file |
| **Download Output (.txt)** | Save the fully resolved prompt as a text file |
| **Copy Sys Only** | Copy just the system prompt to the clipboard |
| **Clear Inputs** | Reset all variable values in the current flow (with 5-second undo) |

---

## Editor Features

- **Line numbers** are shown alongside every text area.
- **Tab key** inserts a tab character instead of moving focus.
- **Enter key** auto-indents based on the current line's leading whitespace.
- **Resize** any text area by dragging the bottom-right corner.
- **Timestamps** — each field shows a "Modified" timestamp (GMT-5) indicating the last edit.

---

## Character & Token Counts

The info bar at the bottom of the workspace shows:

- **Sys** — character count of the system prompt.
- **Tpl** — character count of the instruction template.
- **Dynamic Vars** — combined character count of all variable inputs.
- **Total Pipeline** — sum of all the above, plus approximate token count (~chars/4).

---

## Toast Notifications

Status messages (copied, saved, errors) appear as toast notifications in the top-right corner. They auto-dismiss after 3 seconds. Some toasts include an **Undo** button (e.g., after clearing inputs).

---

## Data & Persistence

- All data is stored in the browser's **localStorage**.
- Data saves automatically on every keystroke (debounced at 500ms).
- Storage keys use a `_v12` suffix for versioning.

### Export / Import

- **Export** creates a JSON file containing all flows and shared variables.
- **Import** validates the file structure before applying:
  - Checks that tabs have required fields (`id`, `name`, `template`, etc.)
  - Shows a summary modal ("Found X flows and Y shared variables") before replacing data
  - Adds default values for any missing fields (forward compatibility)
  - Accepts both full format (`{ tabs: [...], sharedStore: {...} }`) and legacy array format (`[...]`)

### Clear Studio Data

Removes only app-specific localStorage keys (not all origin data) and resets to a single default flow. **This cannot be undone.**

---

## Accessibility

- Flow tabs use `<button>` elements with `role="tab"` and `aria-selected`
- The tabs container has `role="tablist"`
- Collapsible sections have `aria-expanded` and `aria-controls`
- Modals have `role="dialog"` and `aria-modal="true"`
- Focus returns to the trigger element when modals close
- Modal confirm button receives focus on open
- All interactive elements are keyboard-accessible

---

## Responsive / Mobile

On screens narrower than 768px:
- The sidebar becomes a slide-in drawer toggled by a hamburger button
- A top bar shows the current flow name
- Layout stacks vertically
- Buttons have larger touch targets (44px minimum)
- The sidebar resize handle is hidden

---

## Resizable Sidebar

On desktop, drag the right edge of the sidebar to resize it (150px–400px). The width is saved in localStorage.

---

## Internationalization (i18n)

The app supports two languages:

| Language | Code | Setting |
|---|---|---|
| English | `en` | Default |
| Spanish | `es` | Toggle via sidebar menu |

All UI labels, button text, modal messages, placeholders, status messages, tutorial content, and toast notifications are fully translated.

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
  - `sidebar_width_v12` — sidebar width in pixels

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
