# Absolutely Theme Local Testing Guide

This guide shows how to validate, package, install, and test the Absolutely Theme extension locally in VS Code and CodeBuddy.

## What You Are Testing

The extension contributes two color themes and one file icon theme:

- `Absolutely Light`
- `Absolutely Dark`
- `Absolutely Icons`

The local VSIX package is:

```bash
/Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.1.vsix
```

The installed extension ID should appear as:

```text
zixuandai0217.absolutely-theme@0.1.1
```

The file icon theme is shipped inside the same VSIX. Its picker label is:

```text
Absolutely Icons
```

Its VS Code settings ID is:

```text
absolutely-icons
```

## 1. Validate The Theme Files

Run from the repository root:

```bash
cd /Users/edy/Daizixuan/Absolutely
npm run validate
```

Expected output:

```text
Absolutely theme extension validation passed.
```

This checks:

- `package.json` contributes both themes.
- `package.json` contributes the `Absolutely Icons` file icon theme.
- Theme JSON files exist and parse correctly.
- Icon theme JSON and referenced SVG assets exist.
- Icon theme mappings keep Material-scale coverage for file extensions, file names, folder names, and language IDs.
- Icon SVGs use a curated softly saturated Absolutely-compatible tonal range with balanced warm, cool, accent, and neutral proportions.
- Default file, folder, open-folder, and root-folder icons use handcrafted Absolutely core artwork.
- Core Codex Absolutely palette values did not drift.
- `.vscodeignore` keeps non-extension repo files out of the VSIX.

## 2. Package The Extension

Run:

```bash
npm run package
```

Expected output includes:

```text
DONE  Packaged: absolutely-theme-0.1.1.vsix
```

Check the package contents:

```bash
unzip -l absolutely-theme-0.1.1.vsix
```

Expected package contents should only include:

```text
extension/package.json
extension/readme.md
extension/LICENSE.txt
extension/THIRD_PARTY_NOTICES.txt
extension/themes/absolutely-light-color-theme.json
extension/themes/absolutely-dark-color-theme.json
extension/icons/absolutely-icons.json
extension/icons/svg/*.svg
```

The SVG icon directory should contain roughly 1,300 generated SVG files.

It should not include `.agents/`, `.claude/`, `docs/`, or `scripts/`.

## 3. Test Install In VS Code Without Touching Your Real Profile

Use a temporary extension directory:

```bash
rm -rf /tmp/absolutely-theme-vscode-ext /tmp/absolutely-theme-vscode-user
mkdir -p /tmp/absolutely-theme-vscode-ext /tmp/absolutely-theme-vscode-user

"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" \
  --extensions-dir /tmp/absolutely-theme-vscode-ext \
  --user-data-dir /tmp/absolutely-theme-vscode-user \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.1.vsix
```

Confirm it installed:

```bash
"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" \
  --extensions-dir /tmp/absolutely-theme-vscode-ext \
  --user-data-dir /tmp/absolutely-theme-vscode-user \
  --list-extensions --show-versions
```

Expected output:

```text
zixuandai0217.absolutely-theme@0.1.1
```

## 4. Test Install In CodeBuddy Without Touching Your Real Profile

Use CodeBuddy's bundled VS Code-compatible CLI:

```bash
rm -rf /tmp/absolutely-theme-codebuddy-ext /tmp/absolutely-theme-codebuddy-user
mkdir -p /tmp/absolutely-theme-codebuddy-ext /tmp/absolutely-theme-codebuddy-user

"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" \
  --extensions-dir /tmp/absolutely-theme-codebuddy-ext \
  --user-data-dir /tmp/absolutely-theme-codebuddy-user \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.1.vsix
```

Confirm it installed:

```bash
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" \
  --extensions-dir /tmp/absolutely-theme-codebuddy-ext \
  --user-data-dir /tmp/absolutely-theme-codebuddy-user \
  --list-extensions --show-versions
```

Expected output:

```text
zixuandai0217.absolutely-theme@0.1.1
```

## 5. Try The Theme In The Editor UI

For a real manual test, install the VSIX into your normal editor profile.

In VS Code:

```bash
"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.1.vsix
```

In CodeBuddy:

```bash
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.1.vsix
```

Then open the command palette and choose:

```text
Preferences: Color Theme
```

Select:

```text
Absolutely Light
```

Also test:

```text
Absolutely Dark
```

Then choose:

```text
Preferences: File Icon Theme
```

Select:

```text
Absolutely Icons
```

## 6. Manual Visual Checklist

Open a TypeScript, Python, JSON, and Markdown file and check:

- Editor background is warm off-white in `Absolutely Light`.
- Sidebar and panel use the slightly darker surface color.
- Cursor and focus accents use the Codex accent color.
- Comments are subdued gray.
- Strings are green.
- Keywords and numbers are orange-red.
- Types/classes are warm brown.
- Diff additions and deletions remain readable.
- Terminal ANSI colors are readable on the theme background.
- Explorer file icons use warm gray, terracotta, and muted semantic accents instead of the brighter Material Icon Theme colors.
- Common Material Icon Theme cases such as Vue, Rust, Tailwind, Playwright, Docker, package managers, framework configs, cloud files, and `.vscode` folders resolve to distinct icons.
- Local AI files such as `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, and `.aiexclude` resolve to the Absolutely Codex icon.

## 7. Clean Up Temporary Test Profiles

If you used the temporary test install commands:

```bash
rm -rf /tmp/absolutely-theme-vscode-ext /tmp/absolutely-theme-vscode-user
rm -rf /tmp/absolutely-theme-codebuddy-ext /tmp/absolutely-theme-codebuddy-user
```

## Troubleshooting

### `code: command not found`

Use the full app CLI path:

```bash
"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code"
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code"
```

### Theme does not appear in the picker

Confirm the extension installed:

```bash
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" --list-extensions --show-versions | grep absolutely
```

If it does not appear, reinstall the VSIX.

### Old theme version keeps showing

Uninstall and reinstall:

```bash
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" \
  --uninstall-extension zixuandai0217.absolutely-theme

"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.1.vsix
```

### VSIX accidentally includes repository files

Run:

```bash
unzip -l absolutely-theme-0.1.1.vsix
```

If `.agents/`, `.claude/`, `docs/`, or `scripts/` appear in the package, check `.vscodeignore` and rerun:

```bash
npm run package
```
