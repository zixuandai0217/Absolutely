import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredPalette = {
  lightBackground: "#f9f9f7",
  lightSurface: "#f4f4f2",
  lightForeground: "#2d2d2b",
  darkBackground: "#2d2d2b",
  darkSurface: "#373735",
  darkForeground: "#f9f9f7",
  accent: "#cc7d5e",
  diffAdded: "#00c853",
  diffRemoved: "#ff5f38",
  string: "#00c853",
  keyword: "#ff5f38",
  lightType: "#bc7559",
  darkType: "#d28e73",
  lightComment: "#939391",
  darkComment: "#b2b2b0"
};

const iconColorQuality = {
  minimumUniqueColors: 40,
  maximumUniqueColors: 96,
  minimumSemanticFamilies: 8,
  maximumSingleColorShare: 0.27,
  maximumSaturation: 0.58,
  maximumBrightSaturation: 0.6,
  minimumWarmShare: 0.28,
  maximumWarmShare: 0.62,
  minimumCoolShare: 0.16,
  maximumCoolShare: 0.52,
  minimumNeutralShare: 0.02,
  maximumNeutralShare: 0.3
};

const requiredIconColors = new Set(["#2d2d2b", "#6f6a66", "#8a837e", "#f7f3ef", "#c97958", "#b96f52"]);

const minimumIconCoverage = {
  iconDefinitions: 1000,
  fileExtensions: 1000,
  fileNames: 1500,
  folderNames: 3500,
  folderNamesExpanded: 3500
};

// Assert that a repository file exists before packaging.
function assertFileExists(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`${relativePath}: expected file to exist`);
  }
}

// Read and parse a JSON file relative to the extension root.
function readJson(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const text = fs.readFileSync(absolutePath, "utf8");
  return JSON.parse(text);
}

// Assert exact values so extracted Codex palette colors do not drift.
function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

// Assert that source-backed token rules stay plain unless Codex adds style data.
function assertNoFontStyle(rule, label) {
  if (Object.prototype.hasOwnProperty.call(rule.settings, "fontStyle")) {
    throw new Error(`${label}: expected no fontStyle, got ${rule.settings.fontStyle}`);
  }
}

// Assert a manifest array contains an expected value.
function assertArrayIncludes(values, expected, label) {
  if (!Array.isArray(values) || !values.includes(expected)) {
    throw new Error(`${label}: expected ${JSON.stringify(values)} to include ${expected}`);
  }
}

// Assert a manifest object has broad enough coverage for Material-derived icons.
function assertMinimumEntries(values, minimum, label) {
  const count = Object.keys(values ?? {}).length;
  if (count < minimum) {
    throw new Error(`${label}: expected at least ${minimum} entries, got ${count}`);
  }
}

// Assert text content contains a packaging or documentation rule.
function assertTextIncludes(text, expected, label) {
  if (!text.includes(expected)) {
    throw new Error(`${label}: expected to include ${expected}`);
  }
}

// Expand a 3/6/8-digit hex color into RGB channels for icon quality checks.
function parseHexColor(color) {
  const raw = color.toLowerCase().replace("#", "");
  const hex =
    raw.length === 3
      ? raw
          .split("")
          .map((digit) => `${digit}${digit}`)
          .join("")
      : raw.slice(0, 6);
  return {
    hex: `#${hex}`,
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };
}

// Convert RGB channels into HSL so validation can check aesthetic ranges.
function rgbToHsl({ r, g, b }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: lightness };
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue;
  if (max === rn) {
    hue = (gn - bn) / delta + (gn < bn ? 6 : 0);
  } else if (max === gn) {
    hue = (bn - rn) / delta + 2;
  } else {
    hue = (rn - gn) / delta + 4;
  }

  return { h: hue * 60, s: saturation, l: lightness };
}

// Classify a color into broad icon palette roles for proportion checks.
function classifyIconColor(hsl) {
  if (hsl.s < 0.14 || hsl.l < 0.18 || hsl.l > 0.88) {
    return "neutral";
  }
  if (hsl.h < 65 || hsl.h >= 330) {
    return "warm";
  }
  if (hsl.h < 170) {
    return "green";
  }
  if (hsl.h < 255) {
    return "cool";
  }
  return "accent";
}

// Collect colors while asserting SVG assets stay crisp and portable.
function assertSvgQuality(relativePath, stats) {
  const text = fs.readFileSync(path.join(rootDir, relativePath), "utf8");
  if (!/\bviewBox="/.test(text)) {
    throw new Error(`${relativePath}: expected an SVG viewBox`);
  }
  if (/<text\b/i.test(text) || /font-family/i.test(text)) {
    throw new Error(`${relativePath}: expected pure vector shapes instead of text/font rendering`);
  }
  for (const color of text.match(/#[0-9a-fA-F]{6,8}\b/g) ?? []) {
    const parsedColor = parseHexColor(color);
    const hsl = rgbToHsl(parsedColor);
    if (hsl.s > iconColorQuality.maximumSaturation) {
      throw new Error(`${relativePath}: expected ${parsedColor.hex} to stay softly saturated`);
    }
    if (hsl.l > 0.62 && hsl.s > iconColorQuality.maximumBrightSaturation) {
      throw new Error(`${relativePath}: expected bright color ${parsedColor.hex} to avoid neon saturation`);
    }
    const role = classifyIconColor(hsl);
    stats.totalUses += 1;
    stats.colors.set(parsedColor.hex, (stats.colors.get(parsedColor.hex) ?? 0) + 1);
    stats.roles.set(role, (stats.roles.get(role) ?? 0) + 1);
    if (role !== "neutral") {
      const family = Math.floor(hsl.h / 30) * 30;
      stats.semanticFamilies.add(family);
    }
  }
}

// Assert the icon palette is coordinated but not flattened into too few colors.
function assertIconColorBalance(stats) {
  if (stats.colors.size < iconColorQuality.minimumUniqueColors) {
    throw new Error(
      `icon colors: expected at least ${iconColorQuality.minimumUniqueColors} coordinated colors, got ${stats.colors.size}`
    );
  }
  if (stats.colors.size > iconColorQuality.maximumUniqueColors) {
    throw new Error(
      `icon colors: expected at most ${iconColorQuality.maximumUniqueColors} curated colors, got ${stats.colors.size}`
    );
  }
  for (const color of requiredIconColors) {
    if (!stats.colors.has(color)) {
      throw new Error(`icon colors: expected curated Absolutely color ${color} to be present`);
    }
  }
  if (stats.semanticFamilies.size < iconColorQuality.minimumSemanticFamilies) {
    throw new Error(
      `icon colors: expected at least ${iconColorQuality.minimumSemanticFamilies} semantic hue families, got ${stats.semanticFamilies.size}`
    );
  }

  const dominant = [...stats.colors.entries()].sort((a, b) => b[1] - a[1])[0];
  const dominantShare = dominant[1] / stats.totalUses;
  if (dominantShare > iconColorQuality.maximumSingleColorShare) {
    throw new Error(
      `icon colors: expected no single color to exceed ${Math.round(
        iconColorQuality.maximumSingleColorShare * 100
      )}% usage, got ${dominant[0]} at ${Math.round(dominantShare * 100)}%`
    );
  }

  const roleShare = (role) => (stats.roles.get(role) ?? 0) / stats.totalUses;
  const warmShare = roleShare("warm");
  const coolShare = roleShare("cool") + roleShare("green") + roleShare("accent");
  const neutralShare = roleShare("neutral");
  if (warmShare < iconColorQuality.minimumWarmShare || warmShare > iconColorQuality.maximumWarmShare) {
    throw new Error(`icon colors: expected warm share to be balanced, got ${Math.round(warmShare * 100)}%`);
  }
  if (coolShare < iconColorQuality.minimumCoolShare || coolShare > iconColorQuality.maximumCoolShare) {
    throw new Error(`icon colors: expected semantic cool/accent share to be balanced, got ${Math.round(coolShare * 100)}%`);
  }
  if (neutralShare < iconColorQuality.minimumNeutralShare || neutralShare > iconColorQuality.maximumNeutralShare) {
    throw new Error(`icon colors: expected neutral share to stay supportive, got ${Math.round(neutralShare * 100)}%`);
  }
}

// Assert handcrafted core icons carry the Absolutely visual identity.
function validateCoreIconArtwork() {
  const coreIconChecks = {
    "icons/svg/file.svg": [paletteColor("paper"), paletteColor("mutedDark")],
    "icons/svg/folder.svg": ["#c97958", "#d08f73"],
    "icons/svg/folder-open.svg": ["#b96f52", "#d08f73"],
    "icons/svg/folder-root.svg": [paletteColor("paper"), "#c97958"]
  };

  for (const [relativePath, colors] of Object.entries(coreIconChecks)) {
    const text = fs.readFileSync(path.join(rootDir, relativePath), "utf8").toLowerCase();
    for (const color of colors) {
      if (!text.includes(color)) {
        throw new Error(`${relativePath}: expected handcrafted core icon color ${color}`);
      }
    }
  }
}

// Assert common single-color brand icons keep enough contrast in the Explorer.
function validateIconContrastSamples() {
  const sampleIcons = ["next", "webpack", "typescript", "vue", "docker", "playwright"];
  for (const iconName of sampleIcons) {
    const relativePath = `icons/svg/${iconName}.svg`;
    const text = fs.readFileSync(path.join(rootDir, relativePath), "utf8");
    const colors = [...text.matchAll(/#[0-9a-fA-F]{6,8}\b/g)].map((match) => parseHexColor(match[0]));
    const hasReadableColor = colors.some((color) => rgbToHsl(color).l <= 0.62);
    if (!hasReadableColor) {
      throw new Error(`${relativePath}: expected at least one readable mid-tone icon color`);
    }
  }
}

// Return canonical icon palette values used by core artwork checks.
function paletteColor(name) {
  const values = {
    paper: "#f7f3ef",
    mutedDark: "#6f6a66"
  };
  return values[name];
}

// Find a token color rule by TextMate scope.
function findToken(theme, scope) {
  return theme.tokenColors.find((entry) => {
    const scopes = Array.isArray(entry.scope) ? entry.scope : [entry.scope];
    return scopes.includes(scope);
  });
}

// Validate all UI color keys that exist in Codex's extracted theme bundle.
function validateSourceColors(theme, expected) {
  for (const [key, value] of Object.entries(expected.sourceColors)) {
    assertEqual(theme.colors[key], value, `${expected.name} source color ${key}`);
  }
}

// Validate the six TextMate groups that exist in Codex's extracted theme bundle.
function validateSourceTokens(theme, expected) {
  const requiredTokens = [
    ["comment", expected.comment],
    ["string", requiredPalette.string],
    ["constant.numeric", requiredPalette.keyword],
    ["keyword", requiredPalette.keyword],
    ["entity.name.type", expected.typeColor],
    ["entity.name.function", expected.foreground]
  ];

  for (const [scope, color] of requiredTokens) {
    const rule = findToken(theme, scope);
    if (!rule) {
      throw new Error(`${expected.name}: missing required token color scope ${scope}`);
    }
    assertEqual(rule.settings.foreground, color, `${expected.name} ${scope} token`);
    assertNoFontStyle(rule, `${expected.name} ${scope} token`);
  }
}

// Validate VS Code-only keys derived from Codex chrome semantic colors.
function validateDerivedChromeMappings(theme, expected) {
  assertEqual(
    theme.colors["gitDecoration.addedResourceForeground"],
    requiredPalette.diffAdded,
    `${expected.name} git added`
  );
  assertEqual(
    theme.colors["gitDecoration.untrackedResourceForeground"],
    requiredPalette.diffAdded,
    `${expected.name} git untracked`
  );
  assertEqual(
    theme.colors["gitDecoration.deletedResourceForeground"],
    requiredPalette.diffRemoved,
    `${expected.name} git deleted`
  );
  assertEqual(
    theme.colors["gitDecoration.modifiedResourceForeground"],
    expected.typeColor,
    `${expected.name} git modified`
  );
  assertEqual(
    theme.colors["gitDecoration.ignoredResourceForeground"],
    expected.comment,
    `${expected.name} git ignored`
  );
  assertEqual(theme.colors["editorGutter.addedBackground"], requiredPalette.diffAdded, `${expected.name} gutter added`);
  assertEqual(theme.colors["editorGutter.deletedBackground"], requiredPalette.diffRemoved, `${expected.name} gutter deleted`);
  assertEqual(theme.colors.errorForeground, requiredPalette.diffRemoved, `${expected.name} error foreground`);
  assertEqual(theme.colors["editorError.foreground"], requiredPalette.diffRemoved, `${expected.name} editor error`);
  assertEqual(theme.colors["editorInfo.foreground"], requiredPalette.diffAdded, `${expected.name} editor info`);
  assertEqual(theme.colors["inputValidation.infoBorder"], requiredPalette.diffAdded, `${expected.name} input info`);
  assertEqual(theme.colors["list.errorForeground"], requiredPalette.diffRemoved, `${expected.name} list error`);
  assertEqual(theme.colors["notificationsErrorIcon.foreground"], requiredPalette.diffRemoved, `${expected.name} notification error`);
  assertEqual(theme.colors["notificationsInfoIcon.foreground"], requiredPalette.diffAdded, `${expected.name} notification info`);
  assertEqual(theme.colors["terminal.ansiGreen"], requiredPalette.diffAdded, `${expected.name} terminal green`);
  assertEqual(theme.colors["terminal.ansiBrightGreen"], requiredPalette.diffAdded, `${expected.name} terminal bright green`);
  assertEqual(theme.colors["terminal.ansiRed"], requiredPalette.diffRemoved, `${expected.name} terminal red`);
  assertEqual(theme.colors["terminal.ansiBrightRed"], requiredPalette.diffRemoved, `${expected.name} terminal bright red`);
}

// Validate package hygiene so the VSIX only includes extension assets.
function validatePackagingFiles() {
  assertFileExists("LICENSE");
  assertFileExists("THIRD_PARTY_NOTICES.txt");
  assertFileExists(".vscodeignore");
  assertFileExists("icons/absolutely-icons.json");
  const vscodeIgnore = fs.readFileSync(path.join(rootDir, ".vscodeignore"), "utf8");
  for (const pattern of [
    ".agents/**",
    ".claude/**",
    ".github/**",
    ".playwright-cli/**",
    "docs/**",
    "scripts/**",
    "install.sh",
    "*.js",
    "*.js.map",
    "*.vsix"
  ]) {
    assertTextIncludes(vscodeIgnore, pattern, ".vscodeignore");
  }
  if (vscodeIgnore.includes(".vscodeignore")) {
    throw new Error(".vscodeignore: expected package hygiene file to be included in VSIX");
  }
  const gitIgnore = fs.readFileSync(path.join(rootDir, ".gitignore"), "utf8");
  assertTextIncludes(gitIgnore, ".playwright-cli/", ".gitignore");
}

// Validate extension metadata and contributed theme wiring.
function validatePackageManifest() {
  const manifest = readJson("package.json");
  assertEqual(manifest.name, "absolutely-theme", "package name");
  assertEqual(manifest.displayName, "Absolutely Theme", "display name");
  assertArrayIncludes(manifest.categories, "Themes", "categories");
  assertEqual(manifest.scripts?.validate, "node scripts/validate-theme.mjs", "validate script");

  const themes = manifest.contributes?.themes ?? [];
  assertEqual(themes.length, 2, "contributed theme count");
  assertEqual(themes[0].label, "Absolutely Light", "light theme label");
  assertEqual(themes[0].uiTheme, "vs", "light theme uiTheme");
  assertEqual(themes[0].path, "./themes/absolutely-light-color-theme.json", "light theme path");
  assertEqual(themes[1].label, "Absolutely Dark", "dark theme label");
  assertEqual(themes[1].uiTheme, "vs-dark", "dark theme uiTheme");
  assertEqual(themes[1].path, "./themes/absolutely-dark-color-theme.json", "dark theme path");

  const iconThemes = manifest.contributes?.iconThemes ?? [];
  assertEqual(iconThemes.length, 1, "contributed icon theme count");
  assertEqual(iconThemes[0].id, "absolutely-icons", "icon theme id");
  assertEqual(iconThemes[0].label, "Absolutely Icons", "icon theme label");
  assertEqual(iconThemes[0].path, "./icons/absolutely-icons.json", "icon theme path");
}

// Validate the Absolutely file icon theme has the expected core coverage.
function validateIconTheme() {
  const iconTheme = readJson("icons/absolutely-icons.json");
  const iconColorStats = {
    colors: new Map(),
    roles: new Map(),
    semanticFamilies: new Set(),
    totalUses: 0
  };
  assertEqual(iconTheme.hidesExplorerArrows, false, "icon theme explorer arrows");
  assertEqual(iconTheme.file, "_file", "default file icon");
  assertEqual(iconTheme.folder, "_folder", "default folder icon");
  assertEqual(iconTheme.folderExpanded, "_folder-open", "expanded folder icon");
  assertEqual(iconTheme.rootFolder, "_folder-root", "root folder icon");
  assertEqual(iconTheme.rootFolderExpanded, "_folder-root-open", "expanded root folder icon");
  assertMinimumEntries(iconTheme.iconDefinitions, minimumIconCoverage.iconDefinitions, "icon definitions");
  assertMinimumEntries(iconTheme.fileExtensions, minimumIconCoverage.fileExtensions, "file extension mappings");
  assertMinimumEntries(iconTheme.fileNames, minimumIconCoverage.fileNames, "file name mappings");
  assertMinimumEntries(iconTheme.folderNames, minimumIconCoverage.folderNames, "folder name mappings");
  assertMinimumEntries(
    iconTheme.folderNamesExpanded,
    minimumIconCoverage.folderNamesExpanded,
    "expanded folder name mappings"
  );

  for (const [iconName, definition] of Object.entries(iconTheme.iconDefinitions ?? {})) {
    if (!definition.iconPath) {
      throw new Error(`iconDefinitions.${iconName}: expected iconPath`);
    }
    const relativePath = path.join("icons", definition.iconPath);
    assertFileExists(relativePath);
    assertSvgQuality(relativePath, iconColorStats);
  }
  assertIconColorBalance(iconColorStats);
  validateCoreIconArtwork();
  validateIconContrastSamples();

  for (const iconName of [
    "_file",
    "_folder",
    "_folder-open",
    "_folder-root",
    "_folder-root-open",
    "_javascript",
    "_typescript",
    "_json",
    "_markdown",
    "_codex",
    "_test",
    "_git",
    "_env",
    "playwright",
    "vue",
    "rust",
    "tailwindcss",
    "folder-node",
    "folder-node-open",
    "folder-vscode",
    "folder-vscode-open"
  ]) {
    const iconPath = iconTheme.iconDefinitions?.[iconName]?.iconPath;
    if (!iconPath) {
      throw new Error(`iconDefinitions.${iconName}: expected iconPath`);
    }
  }

  for (const [extension, iconName] of Object.entries({
    js: "javascript",
    jsx: "react",
    ts: "typescript",
    tsx: "react_ts",
    json: "json",
    md: "markdown",
    png: "image",
    "test.ts": "test-ts",
    vue: "vue",
    rs: "rust",
    scss: "sass"
  })) {
    assertEqual(iconTheme.fileExtensions?.[extension], iconName, `file extension ${extension}`);
  }

  for (const [fileName, iconName] of Object.entries({
    "AGENTS.md": "_codex",
    "package.json": "nodejs",
    ".gitignore": "git",
    ".env": "_env",
    "playwright.config.ts": "playwright",
    "tailwind.config.js": "tailwindcss"
  })) {
    assertEqual(iconTheme.fileNames?.[fileName], iconName, `file name ${fileName}`);
  }

  for (const [folderName, iconName] of Object.entries({
    node_modules: "folder-node",
    ".vscode": "folder-vscode",
    src: "_folder-src",
    tests: "_folder-test"
  })) {
    assertEqual(iconTheme.folderNames?.[folderName], iconName, `folder name ${folderName}`);
  }
}

// Validate one theme file against the Codex Absolutely palette.
function validateTheme(relativePath, expected) {
  const theme = readJson(relativePath);
  assertEqual(theme.name, expected.name, `${expected.name} name`);
  assertEqual(theme.type, expected.type, `${expected.name} type`);
  validateSourceColors(theme, expected);
  validateDerivedChromeMappings(theme, expected);
  assertEqual(theme.semanticTokenColors.string, requiredPalette.string, `${expected.name} semantic string`);
  assertEqual(theme.semanticTokenColors.keyword, requiredPalette.keyword, `${expected.name} semantic keyword`);
  validateSourceTokens(theme, expected);
}

validatePackageManifest();
validatePackagingFiles();
validateIconTheme();
validateTheme("themes/absolutely-light-color-theme.json", {
  name: "Absolutely Light",
  type: "light",
  background: requiredPalette.lightBackground,
  surface: requiredPalette.lightSurface,
  foreground: requiredPalette.lightForeground,
  comment: requiredPalette.lightComment,
  sourceColors: {
    "activityBar.activeBorder": requiredPalette.accent,
    "activityBar.background": requiredPalette.lightSurface,
    "activityBarBadge.background": requiredPalette.accent,
    "button.background": requiredPalette.accent,
    "editor.background": requiredPalette.lightBackground,
    "editor.foreground": requiredPalette.lightForeground,
    "editorCursor.foreground": requiredPalette.accent,
    "editorGroupHeader.tabsBackground": requiredPalette.lightSurface,
    focusBorder: requiredPalette.accent,
    foreground: requiredPalette.lightForeground,
    "panel.background": requiredPalette.lightSurface,
    "sideBar.background": requiredPalette.lightSurface,
    "sideBar.foreground": requiredPalette.lightForeground,
    "sideBarTitle.foreground": requiredPalette.lightForeground,
    "textLink.foreground": requiredPalette.accent
  },
  typeColor: requiredPalette.lightType
});
validateTheme("themes/absolutely-dark-color-theme.json", {
  name: "Absolutely Dark",
  type: "dark",
  background: requiredPalette.darkBackground,
  surface: requiredPalette.darkSurface,
  foreground: requiredPalette.darkForeground,
  comment: requiredPalette.darkComment,
  sourceColors: {
    "activityBar.activeBorder": requiredPalette.accent,
    "activityBar.background": requiredPalette.darkSurface,
    "activityBarBadge.background": requiredPalette.accent,
    "button.background": requiredPalette.accent,
    "editor.background": requiredPalette.darkBackground,
    "editor.foreground": requiredPalette.darkForeground,
    "editorCursor.foreground": requiredPalette.accent,
    "editorGroupHeader.tabsBackground": requiredPalette.darkSurface,
    focusBorder: requiredPalette.accent,
    foreground: requiredPalette.darkForeground,
    "panel.background": requiredPalette.darkSurface,
    "sideBar.background": requiredPalette.darkSurface,
    "sideBar.foreground": requiredPalette.darkForeground,
    "sideBarTitle.foreground": requiredPalette.darkForeground,
    "textLink.foreground": requiredPalette.accent
  },
  typeColor: requiredPalette.darkType
});

console.log("Absolutely theme extension validation passed.");
