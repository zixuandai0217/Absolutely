import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = path.join(rootDir, "icons");
const outDir = path.join(iconsDir, "svg");
const materialDir =
  process.env.MATERIAL_ICON_THEME_DIR ??
  "/Users/edy/.cursor/extensions/pkief.material-icon-theme-5.36.1-universal";
const materialManifestPath = path.join(materialDir, "dist", "material-icons.json");
const materialIconsDir = path.join(materialDir, "icons");

const palette = {
  ink: "#2d2d2b",
  mutedDark: "#6f6a66",
  muted: "#8a837e",
  mutedLight: "#a49b94",
  paper: "#f7f3ef",
  paperLow: "#eee7e1",
  folder: "#c97958",
  folderOpen: "#b96f52",
  accent: "#cc7d5e",
  accentSoft: "#eadbd2",
  blue: "#6f82a8",
  blueSoft: "#dfe5ee",
  green: "#3b7f68",
  greenSoft: "#dfeae5",
  orange: "#bc7559",
  orangeSoft: "#eaded8",
  gold: "#c79a60",
  goldSoft: "#eee1c8",
  white: "#ffffff"
};

const colorFamilies = {
  red: ["#b85f59", "#c8675e", "#d08f73", "#eaded8"],
  terracotta: ["#a86149", "#b96f52", "#c97958", "#d08f73", "#eaded8"],
  gold: ["#a8824d", "#b88955", "#c79a60", "#d4b577", "#eee1c8"],
  olive: ["#777f55", "#8a8d57", "#a7a36b", "#e6e2c8"],
  green: ["#3b7f68", "#4d8a70", "#6aa07d", "#dfeae5"],
  teal: ["#4f8e94", "#5d96a4", "#74aab7", "#dce9ec"],
  blue: ["#607aa3", "#6f82a8", "#829bc0", "#dfe5ee"],
  indigo: ["#6875a8", "#777fb8", "#8b92c7", "#e2e4f1"],
  violet: ["#7d6aa8", "#8a6fab", "#9e83bb", "#e6deef"],
  rose: ["#a96382", "#b56a8c", "#c6809b", "#eadbd2"]
};

const semanticFamilies = [
  { max: 14, name: "red" },
  { max: 34, name: "terracotta" },
  { max: 58, name: "gold" },
  { max: 86, name: "olive" },
  { max: 142, name: "green" },
  { max: 174, name: "teal" },
  { max: 202, name: "teal" },
  { max: 232, name: "blue" },
  { max: 258, name: "indigo" },
  { max: 292, name: "violet" },
  { max: 326, name: "rose" },
  { max: 360, name: "rose" }
];

const customIcons = new Map([
  [
    "file",
    svg(`  <path fill="${palette.paper}" stroke="${palette.muted}" stroke-linejoin="round" d="M4.1 1.55h5.05l2.75 2.8v10.1H4.1z"/>
  <path fill="${palette.paperLow}" stroke="${palette.muted}" stroke-linejoin="round" d="M9.15 1.55v2.8h2.75"/>
  <path d="M6.05 7.35h3.9M6.05 9.35h3.9M6.05 11.35h2.75" stroke="${palette.mutedDark}" stroke-linecap="round" stroke-width=".85"/>`)
  ],
  [
    "folder",
    svg(`  <path fill="${palette.folder}" d="M1.35 4.45c0-.72.55-1.3 1.27-1.3h3.15c.36 0 .71.15.95.42l.76.83h5.88c.72 0 1.29.57 1.29 1.29v6.16c0 .72-.57 1.3-1.29 1.3H2.62c-.72 0-1.27-.58-1.27-1.3z"/>
  <path fill="#d08f73" d="M1.35 6.1h13.3v5.75c0 .72-.57 1.3-1.29 1.3H2.62c-.72 0-1.27-.58-1.27-1.3z"/>
  <path d="M2.35 5.55h11.3" stroke="#eaded8" stroke-linecap="round" stroke-opacity=".65"/>`)
  ],
  [
    "folder-open",
    svg(`  <path fill="${palette.folderOpen}" d="M1.3 4.35c0-.7.55-1.25 1.25-1.25h3.15c.35 0 .69.14.93.4l.8.86h5.56c.7 0 1.25.55 1.25 1.25v1.02H4.25c-.56 0-1.05.36-1.22.89l-1.73 5.33z"/>
  <path fill="#d08f73" d="M4.2 6.35h9.98c.72 0 1.22.71.98 1.39l-1.56 4.45c-.18.51-.67.86-1.22.86H2.43c-.72 0-1.22-.71-.98-1.39l1.56-4.45c.18-.51.67-.86 1.19-.86z"/>
  <path d="M4.2 7.3h9.45" stroke="#eaded8" stroke-linecap="round" stroke-opacity=".68"/>`)
  ],
  [
    "folder-root",
    svg(`  <circle cx="8" cy="8" r="5.7" fill="${palette.paper}" stroke="${palette.folder}" stroke-width="1.7"/>
  <circle cx="8" cy="8" r="2.45" fill="${palette.folder}"/>
  <path d="M8 4.65v2M8 9.35v2M4.65 8h2M9.35 8h2" stroke="${palette.folderOpen}" stroke-linecap="round" stroke-width=".75"/>`)
  ],
  [
    "folder-root-open",
    svg(`  <circle cx="8" cy="8" r="5.7" fill="${palette.paper}" stroke="${palette.folderOpen}" stroke-width="1.7"/>
  <path d="M5 8h6M8 5v6" stroke="${palette.folderOpen}" stroke-linecap="round" stroke-width="1.05"/>`)
  ],
  [
    "codex",
    svg(`  <rect x="1" y="1" width="14" height="14" rx="3.4" fill="${palette.ink}"/>
  <path fill="${palette.paper}" d="M8 2.8 12.35 5.25v5.5L8 13.2l-4.35-2.45v-5.5z"/>
  <path fill="${palette.accent}" d="M8 4.65 10.65 6.2v3.6L8 11.35 5.35 9.8V6.2z"/>
  <path fill="${palette.ink}" d="M8 6.35 9.35 7.15v1.7L8 9.65l-1.35-.8v-1.7z"/>`)
  ],
  [
    "env",
    fileIcon(`  <path fill="${palette.greenSoft}" stroke="${palette.green}" stroke-linejoin="round" d="M5.85 11.45c2.8-.05 4.35-1.6 4.7-4.55-2.65.18-4.35 1.65-4.7 4.55z"/>
  <path d="M6.75 10.55 9.45 7.85" stroke="${palette.green}" stroke-linecap="round"/>`)
  ],
  [
    "file-code",
    fileIcon(`  <path fill="none" stroke="${palette.accent}" stroke-linecap="round" stroke-linejoin="round" d="M7.1 7.35 5.7 8.75l1.4 1.4M8.9 7.35l1.4 1.4-1.4 1.4"/>
  <path d="m8.35 7.15-.7 3.3" stroke="${palette.folder}" stroke-linecap="round"/>`)
  ]
]);

// Wrap a custom icon body in a normal SVG shell.
function svg(body, viewBox = "0 0 16 16") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${body}\n</svg>\n`;
}

// Build a small document icon when a source icon needs an Absolutely-specific overlay.
function fileIcon(mark = "") {
  return svg(`  <path fill="${palette.paper}" stroke="${palette.muted}" stroke-linejoin="round" d="M4.1 1.55h5.05l2.75 2.8v10.1H4.1z"/>
  <path fill="${palette.paperLow}" stroke="${palette.muted}" stroke-linejoin="round" d="M9.15 1.55v2.8h2.75"/>
${mark}`);
}

// Resolve a Material icon path to a local SVG source file.
function sourcePathForIcon(iconName, definition) {
  const iconPath = definition?.iconPath;
  if (typeof iconPath === "string") {
    return path.resolve(materialDir, "dist", iconPath);
  }
  return path.join(materialIconsDir, `${iconName}.svg`);
}

// Expand short and alpha hex colors into the RGB channels used by the palette normalizer.
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
    hex,
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };
}

// Convert RGB channels into HSL for hue-preserving, low-saturation icon recoloring.
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

// Pick a nearby semantic color family while keeping Material's category recognizable.
function semanticFamilyFor(hue) {
  const normalizedHue = ((hue % 360) + 360) % 360;
  return semanticFamilies.find((family) => normalizedHue < family.max)?.name ?? "terracotta";
}

// Map near-grayscale source colors to warm neutral Absolutely surfaces and linework.
function neutralColorFor(hsl) {
  if (hsl.l < 0.24) {
    return palette.ink;
  }
  if (hsl.l < 0.48) {
    return palette.mutedDark;
  }
  if (hsl.l < 0.68) {
    return palette.muted;
  }
  if (hsl.l < 0.82) {
    return palette.mutedLight;
  }
  if (hsl.l < 0.94) {
    return palette.paperLow;
  }
  return palette.paper;
}

// Choose one curated tone so generated icons feel authored instead of continuously recolored.
function toneFor(hsl, tones, preferPrimary = false) {
  if (preferPrimary) {
    return tones[Math.min(1, tones.length - 1)];
  }
  if (hsl.l < 0.36) {
    return tones[0];
  }
  if (hsl.l < 0.55) {
    return tones[1] ?? tones[0];
  }
  if (hsl.l < 0.74) {
    return tones[2] ?? tones[tones.length - 1];
  }
  return tones[3] ?? tones[tones.length - 1];
}

// Give folder bodies a cohesive terracotta system while folder badges keep semantic color.
function folderBodyColorFor(hsl, iconName) {
  if (hsl.s < 0.12) {
    return neutralColorFor(hsl);
  }

  const isOpen = iconName.endsWith("-open");
  return toneFor(hsl, isOpen ? ["#a86149", "#b96f52", "#c97958", "#d08f73"] : ["#b96f52", "#c97958", "#d08f73", "#eaded8"]);
}

// Rebalance Material's bright colors into a curated, lower-noise Absolutely icon range.
function fileColorFor(hsl, preferPrimary = false) {
  if (hsl.s < 0.12) {
    return neutralColorFor(hsl);
  }

  return toneFor(hsl, colorFamilies[semanticFamilyFor(hsl.h)], preferPrimary);
}

// Convert Material's broad bright palette into coordinated Absolutely-compatible colors.
function recolorSvg(text, iconName) {
  const seen = new Map();
  const family = iconName === "folder" || iconName === "folder-open" || iconName.startsWith("folder-") ? "folder" : "file";
  return text
    .trim()
    .replace(/<path d="M0 0h24v24H0z"\s*\/>/g, "")
    .replace(/<path d="M0 0h32v32H0z"\s*\/>/g, "")
    .replace(/\s+xml:space="preserve"/g, "")
    .replace(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g, (color) => {
      const key = color.toLowerCase();
      if (!seen.has(key)) {
        const parsedColor = parseHexColor(key);
        const hsl = rgbToHsl(parsedColor);
        const isFolderBodyColor = family === "folder" && seen.size === 0;
        seen.set(key, isFolderBodyColor ? folderBodyColorFor(hsl, iconName) : fileColorFor(hsl, seen.size === 0));
      }
      return seen.get(key);
    });
}

// Convert Material icon paths to paths relative to Absolutely's icon manifest.
function iconPathFor(iconName) {
  return `./svg/${iconName}.svg`;
}

// Prefix legacy hand-authored icon ids while keeping Material ids unchanged.
function withCompatDefinitions(definitions) {
  for (const [compatName, materialName] of Object.entries({
    _file: "file",
    "_file-code": "file-code",
    _folder: "folder",
    "_folder-open": "folder-open",
    "_folder-root": "folder-root",
    "_folder-root-open": "folder-root-open",
    "_folder-assets": "folder-images",
    "_folder-assets-open": "folder-images-open",
    "_folder-config": "folder-config",
    "_folder-config-open": "folder-config-open",
    "_folder-docs": "folder-docs",
    "_folder-docs-open": "folder-docs-open",
    "_folder-git": "folder-git",
    "_folder-git-open": "folder-git-open",
    "_folder-package": "folder-node",
    "_folder-package-open": "folder-node-open",
    "_folder-src": "folder-src",
    "_folder-src-open": "folder-src-open",
    "_folder-test": "folder-test",
    "_folder-test-open": "folder-test-open",
    _javascript: "javascript",
    _typescript: "typescript",
    _react: "react",
    "_react-typescript": "react",
    _json: "json",
    _markdown: "markdown",
    _python: "python",
    _html: "html",
    _css: "css",
    _image: "image",
    _document: "document",
    _config: "settings",
    _package: "npm",
    _lock: "lock",
    _git: "git",
    _env: "env",
    _test: "test-js",
    _codex: "codex",
    _shell: "console",
    _yaml: "yaml",
    _database: "database",
    _docker: "docker",
    _archive: "zip",
    _pdf: "pdf",
    _license: "license"
  })) {
    definitions[compatName] = { iconPath: iconPathFor(materialName) };
  }
  return definitions;
}

// Add local AI-agent associations that Material does not know about.
function addAbsolutelyAssociations(theme) {
  theme.fileNames = {
    ...theme.fileNames,
    "AGENTS.md": "_codex",
    "CLAUDE.md": "_codex",
    "CLAUDE.local.md": "_codex",
    "GEMINI.md": "_codex",
    "codex.md": "_codex",
    ".aiexclude": "_codex",
    ".env": "_env",
    ".env.local": "_env",
    ".env.development": "_env",
    ".env.production": "_env",
    ".env.test": "_env"
  };
  theme.folderNames = {
    ...theme.folderNames,
    src: "_folder-src",
    source: "_folder-src",
    test: "_folder-test",
    tests: "_folder-test",
    __tests__: "_folder-test"
  };
  theme.folderNamesExpanded = {
    ...theme.folderNamesExpanded,
    src: "_folder-src-open",
    source: "_folder-src-open",
    test: "_folder-test-open",
    tests: "_folder-test-open",
    __tests__: "_folder-test-open"
  };
}

const materialTheme = JSON.parse(fs.readFileSync(materialManifestPath, "utf8"));
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const iconDefinitions = {};
for (const [iconName, definition] of Object.entries(materialTheme.iconDefinitions)) {
  const sourcePath = sourcePathForIcon(iconName, definition);
  const sourceText = fs.readFileSync(sourcePath, "utf8");
  fs.writeFileSync(path.join(outDir, `${iconName}.svg`), `${recolorSvg(sourceText, iconName)}\n`);
  iconDefinitions[iconName] = { iconPath: iconPathFor(iconName) };
}

for (const [iconName, contents] of customIcons) {
  fs.writeFileSync(path.join(outDir, `${iconName}.svg`), contents);
  iconDefinitions[iconName] = { iconPath: iconPathFor(iconName) };
}

const iconTheme = {
  $schema: "vscode://schemas/icon-theme",
  hidesExplorerArrows: materialTheme.hidesExplorerArrows,
  file: "_file",
  folder: "_folder",
  folderExpanded: "_folder-open",
  rootFolder: "_folder-root",
  rootFolderExpanded: "_folder-root-open",
  iconDefinitions: withCompatDefinitions(iconDefinitions),
  fileExtensions: { ...materialTheme.fileExtensions },
  fileNames: { ...materialTheme.fileNames },
  folderNames: { ...materialTheme.folderNames },
  folderNamesExpanded: { ...materialTheme.folderNamesExpanded },
  languageIds: { ...materialTheme.languageIds }
};

addAbsolutelyAssociations(iconTheme);
fs.mkdirSync(iconsDir, { recursive: true });
fs.writeFileSync(path.join(iconsDir, "absolutely-icons.json"), `${JSON.stringify(iconTheme, null, 2)}\n`);

console.log(
  `Generated ${Object.keys(iconDefinitions).length} Absolutely icon SVG files and ${Object.keys(iconTheme.fileExtensions).length} extension mappings from Material Icon Theme.`
);
