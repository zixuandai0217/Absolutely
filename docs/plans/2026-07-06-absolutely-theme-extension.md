# Absolutely Theme Extension Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a VS Code-compatible theme extension that recreates Codex App's Absolutely Light theme, with an optional Absolutely Dark companion.

**Architecture:** This is a declarative VS Code theme extension. `package.json` contributes color theme JSON files under `themes/`; a lightweight Node validation script checks manifest wiring, theme metadata, and core color fidelity.

**Tech Stack:** VS Code extension manifest, JSON color theme files, Node.js validation script, npm scripts.

---

### Task 1: Validation Script

**Files:**
- Create: `scripts/validate-theme.mjs`
- Modify: `package.json`

**Step 1: Write the failing test**

Create `scripts/validate-theme.mjs` that reads `package.json`, validates the two contributed theme entries, checks that both theme files exist, parses JSON, and asserts the Absolutely palette:

- Light editor background: `#f9f9f7`
- Light panel/sidebar surface: `#f4f4f2`
- Light foreground: `#2d2d2b`
- Accent: `#cc7d5e`
- String: `#00c853`
- Keyword/number: `#ff5f38`

**Step 2: Run test to verify it fails**

Run: `node scripts/validate-theme.mjs`

Expected: FAIL because `package.json` and theme files do not exist yet.

### Task 2: Theme Extension Manifest

**Files:**
- Create: `package.json`

**Step 1: Write minimal implementation**

Create a VS Code extension manifest with:

- `name`: `absolutely-theme`
- `displayName`: `Absolutely Theme`
- `categories`: `["Themes"]`
- `contributes.themes`: entries for `Absolutely Light` and `Absolutely Dark`
- `scripts.validate`: `node scripts/validate-theme.mjs`

**Step 2: Run validation**

Run: `npm run validate`

Expected: still FAIL until theme JSON files are added.

### Task 3: Absolutely Theme JSON

**Files:**
- Create: `themes/absolutely-light-color-theme.json`
- Create: `themes/absolutely-dark-color-theme.json`

**Step 1: Implement theme files**

Map Codex App colors to VS Code UI keys:

- Editor, side bar, panel, tabs, activity bar, status bar
- Inputs, buttons, focus borders, selection, command center
- Diff decorations, git decorations, terminal ANSI colors
- `tokenColors` and `semanticTokenColors`

**Step 2: Run validation**

Run: `npm run validate`

Expected: PASS.

### Task 4: Documentation

**Files:**
- Modify: `README.md`

**Step 1: Replace old repository README**

Document what the extension is, the core palette, development commands, and VSIX installation path for VS Code-family editors such as CodeBuddy.

**Step 2: Run validation**

Run: `npm run validate`

Expected: PASS with no warnings.
