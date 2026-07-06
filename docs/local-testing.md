# Absolutely Theme Local Testing Guide

This guide shows how to validate, package, install, and test the Absolutely Theme extension locally in VS Code and CodeBuddy.

## What You Are Testing

The extension contributes two color themes:

- `Absolutely Light`
- `Absolutely Dark`

The local VSIX package is:

```bash
/Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.0.vsix
```

The installed extension ID should appear as:

```text
zixuandai0217.absolutely-theme@0.1.0
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
- Theme JSON files exist and parse correctly.
- Core Codex Absolutely palette values did not drift.
- `.vscodeignore` keeps non-extension repo files out of the VSIX.

## 2. Package The Extension

Run:

```bash
npm run package
```

Expected output includes:

```text
DONE  Packaged: absolutely-theme-0.1.0.vsix
```

Check the package contents:

```bash
unzip -l absolutely-theme-0.1.0.vsix
```

Expected package contents should only include:

```text
extension/package.json
extension/readme.md
extension/LICENSE.txt
extension/themes/absolutely-light-color-theme.json
extension/themes/absolutely-dark-color-theme.json
```

It should not include `.agents/`, `.claude/`, `docs/`, or `scripts/`.

## 3. Test Install In VS Code Without Touching Your Real Profile

Use a temporary extension directory:

```bash
rm -rf /tmp/absolutely-theme-vscode-ext /tmp/absolutely-theme-vscode-user
mkdir -p /tmp/absolutely-theme-vscode-ext /tmp/absolutely-theme-vscode-user

"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" \
  --extensions-dir /tmp/absolutely-theme-vscode-ext \
  --user-data-dir /tmp/absolutely-theme-vscode-user \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.0.vsix
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
zixuandai0217.absolutely-theme@0.1.0
```

## 4. Test Install In CodeBuddy Without Touching Your Real Profile

Use CodeBuddy's bundled VS Code-compatible CLI:

```bash
rm -rf /tmp/absolutely-theme-codebuddy-ext /tmp/absolutely-theme-codebuddy-user
mkdir -p /tmp/absolutely-theme-codebuddy-ext /tmp/absolutely-theme-codebuddy-user

"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" \
  --extensions-dir /tmp/absolutely-theme-codebuddy-ext \
  --user-data-dir /tmp/absolutely-theme-codebuddy-user \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.0.vsix
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
zixuandai0217.absolutely-theme@0.1.0
```

## 5. Try The Theme In The Editor UI

For a real manual test, install the VSIX into your normal editor profile.

In VS Code:

```bash
"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.0.vsix
```

In CodeBuddy:

```bash
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" \
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.0.vsix
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
  --install-extension /Users/edy/Daizixuan/Absolutely/absolutely-theme-0.1.0.vsix
```

### VSIX accidentally includes repository files

Run:

```bash
unzip -l absolutely-theme-0.1.0.vsix
```

If `.agents/`, `.claude/`, `docs/`, or `scripts/` appear in the package, check `.vscodeignore` and rerun:

```bash
npm run package
```
