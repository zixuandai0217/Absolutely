# Absolutely Theme

Absolutely Theme is a VS Code-compatible color theme extension inspired by the Codex App `Absolutely` theme. It focuses on a warm, quiet light theme with low-contrast surfaces and restrained syntax colors, similar in feel to Claude Code-style coding interfaces.

## Themes

- **Absolutely Light**: the main theme, based on the Codex App light palette.
- **Absolutely Dark**: a companion dark variant using the same accent and syntax language.

## Palette

| Role | Light | Dark |
|------|-------|------|
| Editor background | `#f9f9f7` | `#2d2d2b` |
| Surface / sidebar | `#f4f4f2` | `#373735` |
| Foreground | `#2d2d2b` | `#f9f9f7` |
| Accent / cursor / link | `#cc7d5e` | `#cc7d5e` |
| Comment | `#939391` | `#b2b2b0` |
| String | `#00c853` | `#00c853` |
| Keyword / number | `#ff5f38` | `#ff5f38` |
| Type / class | `#bc7559` | `#d28e73` |
| Diff added / git added | `#00c853` | `#00c853` |
| Diff removed / git deleted | `#ff5f38` | `#ff5f38` |

## Fidelity Notes

The direct VS Code-compatible keys and TextMate token groups are locked to the extracted Codex App Absolutely bundle. VS Code-only keys such as `gitDecoration.*`, `diffEditor.*`, diagnostics, and terminal ANSI colors are derived from Codex's chrome seed: accent `#cc7d5e`, light ink `#2d2d2b`, dark ink `#f9f9f7`, added `#00c853`, removed `#ff5f38`, and skill/accent `#cc7d5e`.

## Development

```bash
npm run validate
```

The validation script checks that the extension manifest contributes both themes and that the theme files keep the extracted Absolutely palette intact.

## Package

```bash
npm run package
```

This creates `absolutely-theme-0.1.0.vsix`, which can be installed in VS Code-family editors that support VSIX installation.

## Install From VSIX

In VS Code, run this if the `code` command is available:

```bash
code --install-extension absolutely-theme-0.1.0.vsix
```

On macOS, if `code` is not in your shell path, either use **Extensions: Install from VSIX...** from the Command Palette or run:

```bash
"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" --install-extension absolutely-theme-0.1.0.vsix
```

In CodeBuddy or another VS Code-like editor, use its extension manager's **Install from VSIX** action if available, then select **Absolutely Light** from the color theme picker.
