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

// Assert text content contains a packaging or documentation rule.
function assertTextIncludes(text, expected, label) {
  if (!text.includes(expected)) {
    throw new Error(`${label}: expected to include ${expected}`);
  }
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
  assertFileExists(".vscodeignore");
  const vscodeIgnore = fs.readFileSync(path.join(rootDir, ".vscodeignore"), "utf8");
  for (const pattern of [
    ".agents/**",
    ".claude/**",
    ".github/**",
    "docs/**",
    "scripts/**",
    "install.sh",
    "*.js",
    "*.js.map",
    "*.vsix"
  ]) {
    assertTextIncludes(vscodeIgnore, pattern, ".vscodeignore");
  }
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
