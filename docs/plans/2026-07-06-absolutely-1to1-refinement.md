# Absolutely 1:1 Refinement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tighten the VS Code theme so Codex App's Absolutely source colors are exact and VS Code-only keys are derived from the same Codex chrome seed.

**Architecture:** Keep the extension declarative: `themes/*.json` hold the color themes, while `scripts/validate-theme.mjs` protects source-backed values and key derived mappings. Direct Codex keys must match the extracted app bundle; derived VS Code keys reuse Codex's accent, ink, surface, and semantic diff colors.

**Tech Stack:** VS Code color theme JSON, Node.js validation script, VSIX packaging with `vsce`.

---

### Task 1: Lock Source Invariants

**Files:**
- Modify: `scripts/validate-theme.mjs`

**Step 1: Write the failing validation**

Assert the extracted Codex Absolutely values:
- Light source colors: `#f9f9f7`, `#f4f4f2`, `#2d2d2b`, `#cc7d5e`
- Dark source colors: `#2d2d2b`, `#373735`, `#f9f9f7`, `#cc7d5e`
- Token groups exactly use comment/string/number/keyword/type/function colors with no comment italic style.
- Codex chrome semantic colors are `diffAdded: #00c853`, `diffRemoved: #ff5f38`, `skill: #cc7d5e`.

**Step 2: Run validation to verify it fails**

Run: `npm run validate`

Expected: FAIL on current derived git/comment styling.

### Task 2: Refine Theme JSON

**Files:**
- Modify: `themes/absolutely-light-color-theme.json`
- Modify: `themes/absolutely-dark-color-theme.json`

**Step 1: Apply minimal theme changes**

Use exact source-backed values for direct keys. For VS Code-only git, diff, diagnostics, terminal, and extra token scopes, derive from Codex's chrome seed instead of unrelated hues.

**Step 2: Run validation**

Run: `npm run validate`

Expected: PASS.

### Task 3: Package and Install Smoke Test

**Files:**
- Generated: `absolutely-theme-0.1.0.vsix`

**Step 1: Package**

Run: `npm run package`

Expected: VSIX created without packaging old repository files.

**Step 2: Inspect VSIX contents**

Run: `unzip -l absolutely-theme-0.1.0.vsix`

Expected: only extension manifest, README, LICENSE, and theme JSON files.

**Step 3: Install into CodeBuddy temp profile**

Run CodeBuddy's `code --install-extension` with temporary `--extensions-dir` and `--user-data-dir`.

Expected: `zixuandai0217.absolutely-theme@0.1.0` appears in `--list-extensions --show-versions`.
