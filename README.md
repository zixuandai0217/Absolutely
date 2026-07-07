# Absolutely Theme

Absolutely Theme is a VS Code-compatible color and file icon theme extension inspired by the Codex App `Absolutely` theme. It focuses on a warm, quiet light theme with low-contrast surfaces, restrained syntax colors, and a matching icon set with soft folders, warm linework, and Codex-style accent marks.

## Themes

- **Absolutely Light**: the main theme, based on the Codex App light palette.
- **Absolutely Dark**: a companion dark variant using the same accent and syntax language.
- **Absolutely Icons**: a Material-scale file icon theme for languages, configs, tests, folders, docs, media, tooling, frameworks, package managers, cloud files, and AI agent files.

## Icon Design

`Absolutely Icons` uses the mature vector library and mappings from Material Icon Theme under the MIT license, then reshapes the color system into a curated Absolutely-compatible tonal palette. It currently generates about 1,300 icon definitions, 1,300+ file-extension mappings, 2,100+ file-name mappings, and 4,600+ folder-name mappings. The default file, folder, open-folder, and root-folder icons are handcrafted so the Explorer has an Absolutely first impression; language and tooling icons keep their semantics through controlled terracotta, gold, green, teal, blue, violet, and rose tone ramps instead of Material's brighter color language.

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

## Install

The published VSIX is available from GitHub Releases:

`https://github.com/zixuandai0217/Absolutely/releases/download/v0.1.1/absolutely-theme-0.1.1.vsix`

Extension ID:

`zixuandai0217.absolutely-theme`

This single VSIX contains both the color themes and the icon theme. There is no separate icon-theme package unless we decide to split it later.

## Links And Theme Entries

| Entry | Value |
|------|-------|
| VSIX download | `https://github.com/zixuandai0217/Absolutely/releases/download/v0.1.1/absolutely-theme-0.1.1.vsix` |
| Extension ID | `zixuandai0217.absolutely-theme` |
| Color theme labels | `Absolutely Light`, `Absolutely Dark` |
| File icon theme label | `Absolutely Icons` |
| File icon theme ID | `absolutely-icons` |

To select it directly in VS Code-compatible settings:

```json
{
  "workbench.colorTheme": "Absolutely Light",
  "workbench.iconTheme": "absolutely-icons"
}
```

After installing, open the editor's color theme picker and select **Absolutely Light**. Use **Absolutely Dark** if you want the companion dark variant. Then open the file icon theme picker and select **Absolutely Icons**.

### Automatic Install From This Repo

If this repository is already cloned, run the bundled installer. It downloads the release VSIX, installs it into a VS Code-compatible editor, and verifies that the extension appears in the editor's extension list.

```bash
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor auto
```

Use a specific editor when needed:

```bash
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor codebuddy
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor vscode
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor cursor
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor windsurf
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor vscodium
```

If the editor CLI is not in `PATH`, pass the exact CLI path:

```bash
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py \
  --editor-cli "/Applications/CodeBuddy.app/Contents/Resources/app/bin/code"
```

### Install From GitHub Release Manually

Download the release asset, then install it with the CLI for your editor:

```bash
curl -L -o absolutely-theme-0.1.1.vsix \
  https://github.com/zixuandai0217/Absolutely/releases/download/v0.1.1/absolutely-theme-0.1.1.vsix

code --install-extension absolutely-theme-0.1.1.vsix
code --list-extensions --show-versions | grep '^zixuandai0217\.absolutely-theme@'
```

For CodeBuddy on macOS:

```bash
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" --install-extension absolutely-theme-0.1.1.vsix
"/Applications/CodeBuddy.app/Contents/Resources/app/bin/code" --list-extensions --show-versions | grep '^zixuandai0217\.absolutely-theme@'
```

You can also use **Extensions: Install from VSIX...** from the Command Palette in VS Code-family editors that support VSIX installation.

### Prompt For Codex Or Claude Code

Copy this prompt into Codex or Claude Code to let the agent install the theme automatically:

```text
Install Absolutely Theme into my VS Code-compatible editor.

Use the GitHub Release VSIX:
https://github.com/zixuandai0217/Absolutely/releases/download/v0.1.1/absolutely-theme-0.1.1.vsix

Target extension ID:
zixuandai0217.absolutely-theme

Please detect the available editor CLI in this order: CodeBuddy, VS Code, Cursor, Windsurf, VSCodium. Download the VSIX if needed, run the editor CLI with --install-extension, then verify installation with --list-extensions --show-versions and confirm that zixuandai0217.absolutely-theme@ is present. After installation, tell me to choose Preferences: Color Theme -> Absolutely Light and Preferences: File Icon Theme -> Absolutely Icons. Do not commit the VSIX file to any repository.
```

If the agent is running inside this repository, use the bundled skill and installer script:

```text
Use the repo skill .agents/skills/install-absolutely-theme. Run:
python3 .agents/skills/install-absolutely-theme/scripts/install_absolutely_theme.py --editor auto
Then verify zixuandai0217.absolutely-theme is installed and tell me to select Absolutely Light plus Absolutely Icons.
```

## Development

```bash
npm run validate
```

The validation script checks that the extension manifest contributes both color themes and the icon theme, that all referenced icon SVG files exist, that the icon theme keeps broad Material-derived coverage, that icon SVG colors stay inside a curated softly saturated tonal range with balanced warm, cool, accent, and neutral proportions, that the handcrafted core file/folder icons keep Absolutely colors, and that the theme files keep the extracted Absolutely palette intact.

The icon SVGs are generated by:

```bash
node scripts/generate-icons.mjs
```

By default the generator reads the locally installed Material Icon Theme package from Cursor:

```text
/Users/edy/.cursor/extensions/pkief.material-icon-theme-5.36.1-universal
```

Use `MATERIAL_ICON_THEME_DIR=/path/to/material-icon-theme` to point it at another downloaded copy of `material-extensions/vscode-material-icon-theme`.

## Package

```bash
npm run package
```

This creates `absolutely-theme-<version>.vsix`, which can be installed in VS Code-family editors that support VSIX installation. Keep `.vsix` files out of git and publish them through GitHub Releases.
