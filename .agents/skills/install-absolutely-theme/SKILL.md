---
name: install-absolutely-theme
description: Use when installing, updating, verifying, or troubleshooting the Absolutely Theme VSIX in VS Code-compatible editors such as CodeBuddy, VS Code, Cursor, Windsurf, or VSCodium, especially when a user asks Codex to install the Codex App Absolutely theme from GitHub Releases.
---

# Install Absolutely Theme

## Overview

Install the Absolutely Theme extension from this project's GitHub Release into a VS Code-compatible editor, then verify the extension ID is present.

Primary release asset:
`https://github.com/zixuandai0217/Absolutely/releases/download/v0.1.2/absolutely-theme-0.1.2.vsix`

Extension ID:
`zixuandai0217.absolutely-theme`

Theme labels:
`Absolutely Light`, `Absolutely Dark`

## Workflow

1. Identify the target editor. Prefer the editor the user names. If unspecified, use `--editor auto`.
2. Run the bundled installer script:

```bash
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor auto
```

3. If the user has a local VSIX, install that exact file:

```bash
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py \
  --editor codebuddy \
  --vsix /path/to/absolutely-theme-0.1.2.vsix
```

4. Verify the script reports `zixuandai0217.absolutely-theme@...`.
5. Tell the user to select `Absolutely Light` from the editor's color theme picker, unless they asked for the dark variant.

## Editor Selection

Use these editor names with `--editor`:

| Editor | Value |
|---|---|
| Auto-detect | `auto` |
| CodeBuddy | `codebuddy` |
| Visual Studio Code | `vscode` |
| Cursor | `cursor` |
| Windsurf | `windsurf` |
| VSCodium | `vscodium` |

If the editor CLI is not found, pass an explicit path:

```bash
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py \
  --editor-cli "/Applications/CodeBuddy.app/Contents/Resources/app/bin/code"
```

## Safe Verification

For smoke tests that must not modify the user's real editor profile, use temporary directories:

```bash
tmp_ext="$(mktemp -d)"
tmp_user="$(mktemp -d)"
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py \
  --editor codebuddy \
  --vsix ./absolutely-theme-0.1.2.vsix \
  --extensions-dir "$tmp_ext" \
  --user-data-dir "$tmp_user"
rm -rf "$tmp_ext" "$tmp_user"
```

## Rules

- Do not commit `.vsix` files to the repository. Release assets are the download surface.
- Prefer the GitHub Release VSIX over rebuilding unless the user asks to test local changes.
- After install, verify with the editor CLI using `--list-extensions --show-versions`.
- If installation fails, report the exact editor CLI path tested, the install command, and the verification command output.
