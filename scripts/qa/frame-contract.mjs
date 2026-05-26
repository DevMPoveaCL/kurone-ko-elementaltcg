import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const CONTRACT_FILES = {
  frame: "src/components/landing/CardFrame.astro",
  theme: "src/styles/theme.css",
  // Nammu layered card assets (6 files)
  nammuFullCard: "public/assets/cards/nammu/card.webp",
  utuFullCard: "public/assets/cards/utu/card.webp",
  nammuFrame: "public/assets/cards/nammu/frame.png",
  nammuIllustration: "public/assets/cards/nammu/illustration.png",
  nammuSymbolInfinity: "public/assets/cards/nammu/symbol-infinity.png",
  nammuSymbolCost7: "public/assets/cards/nammu/symbol-cost-7.png",
  nammuSymbolQueen: "public/assets/cards/nammu/symbol-queen.png",
  nammuSymbolWater: "public/assets/cards/nammu/symbol-water.png",
  // Landing content
  landing: "src/content/landing.ts",
  symbolWater: "public/assets/landing/symbols/water.svg",
  symbolFire: "public/assets/landing/symbols/fire.svg",
  symbolAir: "public/assets/landing/symbols/air.svg",
  symbolEarth: "public/assets/landing/symbols/earth.svg",
  anSvg: "public/assets/landing/goddesses/an.svg",
  promptsRoot: "docs/prompts/elemental-queens",
  promptsShared: "docs/prompts/elemental-queens/shared-base.md",
  promptNammu: "docs/prompts/elemental-queens/nammu.md",
  promptUtu: "docs/prompts/elemental-queens/utu.md",
  promptAn: "docs/prompts/elemental-queens/an.md",
  promptKi: "docs/prompts/elemental-queens/ki.md",
  legacyPromptAnBrief: "docs/prompts/an-brief.md",
  legacyPromptReadme: "docs/prompts/README.md",
  legacyGoddessesReadme: "public/assets/landing/goddesses/README.md",
  cinematicEntryGuideEs: "docs/lore/cinematic-entry-guide.es.md",
  generationOrder: "docs/landing-qa-checklist.md",
};

function readText(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  return fs.readFileSync(absolutePath, "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function assertIncludes(checks, text, fragment, label) {
  checks.push({
    name: label,
    pass: text.includes(fragment),
    message: `Missing fragment: ${fragment}`,
  });
}

function assertRegex(checks, text, regex, label, message) {
  checks.push({
    name: label,
    pass: regex.test(text),
    message,
  });
}

function parseOklchHue(rawValue) {
  const match = rawValue.match(/oklch\(\s*[0-9.]+\s+[0-9.]+\s+([0-9.]+)\s*\)/i);
  if (!match) return null;
  return Number.parseFloat(match[1]);
}

function buildChecks() {
  const checks = [];

  // File existence contract
  for (const [name, filePath] of Object.entries(CONTRACT_FILES)) {
    if (name === "promptsRoot") {
      checks.push({
        name: "prompts root folder exists",
        pass: exists(filePath),
        message: `Missing directory: ${filePath}`,
      });
      continue;
    }

    checks.push({
      name: `${name} exists`,
      pass: exists(filePath),
      message: `Missing file: ${filePath}`,
    });
  }

  const canReadFrameTheme = exists(CONTRACT_FILES.frame) && exists(CONTRACT_FILES.theme);
  if (canReadFrameTheme) {
    const frame = readText(CONTRACT_FILES.frame);
    const theme = readText(CONTRACT_FILES.theme);

    // ── Nammu Layered Card Contract ─────────────────────────────────────────
    const nammuLayerChecks = [
      {
        name: "nammu full-card asset exists",
        pass: exists(CONTRACT_FILES.nammuFullCard),
        message: `Missing: ${CONTRACT_FILES.nammuFullCard}`,
      },
      {
        name: "nammu layered frame asset exists",
        pass: exists(CONTRACT_FILES.nammuFrame),
        message: `Missing: ${CONTRACT_FILES.nammuFrame}`,
      },
      {
        name: "nammu layered illustration asset exists",
        pass: exists(CONTRACT_FILES.nammuIllustration),
        message: `Missing: ${CONTRACT_FILES.nammuIllustration}`,
      },
      {
        name: "nammu symbol-infinity asset exists",
        pass: exists(CONTRACT_FILES.nammuSymbolInfinity),
        message: `Missing: ${CONTRACT_FILES.nammuSymbolInfinity}`,
      },
      {
        name: "nammu symbol-cost-7 asset exists",
        pass: exists(CONTRACT_FILES.nammuSymbolCost7),
        message: `Missing: ${CONTRACT_FILES.nammuSymbolCost7}`,
      },
      {
        name: "nammu symbol-queen asset exists",
        pass: exists(CONTRACT_FILES.nammuSymbolQueen),
        message: `Missing: ${CONTRACT_FILES.nammuSymbolQueen}`,
      },
      {
        name: "nammu symbol-water asset exists",
        pass: exists(CONTRACT_FILES.nammuSymbolWater),
        message: `Missing: ${CONTRACT_FILES.nammuSymbolWater}`,
      },
      {
        name: "CardFrame.astro has layered nammu class",
        pass: /card-frame--layered/.test(frame),
        message: "CardFrame.astro missing .card-frame--layered marker",
      },
      {
        name: "theme.css has 9/16 aspect-ratio for layered card",
        pass: /aspect-ratio:\s*9\s*\/\s*16/.test(theme),
        message: "theme.css missing aspect-ratio: 9/16 for layered card",
      },
      {
        name: "theme.css has layered illustration-window class",
        pass: /\.card-frame-layered__illustration-window\s*\{/.test(theme),
        message: "theme.css missing .card-frame-layered__illustration-window class",
      },
      {
        name: "theme.css has layered medallion slot classes (tl, tr, bl, br)",
        pass: /\.card-frame-layered__medallion--tl/.test(theme) &&
              /\.card-frame-layered__medallion--tr/.test(theme) &&
              /\.card-frame-layered__medallion--bl/.test(theme) &&
              /\.card-frame-layered__medallion--br/.test(theme),
        message: "theme.css missing one or more layered medallion slot classes",
      },
    ];
    checks.push(...nammuLayerChecks);

    // ── Legacy card-frame checks (keep for other elements) ──────────────────
    assertIncludes(checks, theme, "aspect-ratio: 5 / 7;", "card aspect ratio 5/7");

    for (const corner of ["tl", "tr", "bl", "br"]) {
      assertIncludes(
        checks,
        frame,
        `card-frame-corner--${corner}`,
        `corner slot ${corner} in CardFrame.astro`,
      );
    }

    for (const medallion of ["tl", "tr", "bl", "br"]) {
      assertIncludes(
        checks,
        frame,
        `card-frame-medallion--${medallion}`,
        `exact draft medallion slot ${medallion}`,
      );
    }

    assertIncludes(checks, frame, 'data-frame-glyph="infinity"', "top-left infinity glyph hook");
    assertIncludes(checks, frame, 'data-frame-glyph="waterDrop"', "water drop glyph hook");
    assertIncludes(checks, frame, 'data-frame-glyph="crown"', "bottom-left crown glyph hook");
    assertIncludes(checks, frame, "data-frame-slot=\"cost\"", "cost slot data hook");
    assertIncludes(checks, frame, "data-frame-slot=\"rank\"", "rank slot data hook");
    assertIncludes(checks, frame, "CARD_FRAME_CONFIG", "CardFrame imports frame config source of truth");
    assertIncludes(checks, frame, "frameConfig.cost", "CardFrame derives cost from config");
    assertIncludes(checks, frame, "frameConfig.rank", "CardFrame derives rank from config");
    assertIncludes(checks, frame, "frameConfig.loreTitle", "CardFrame derives lore title from config");
checks.push({
        name: "CardFrame.astro binds nammu layered frame asset",
        pass: /layeredConfig\.frame/.test(frame),
        message: "CardFrame.astro missing layered frame asset binding",
      },
      {
        name: "CardFrame.astro binds nammu layered illustration asset",
        pass: /layeredConfig\.illustration/.test(frame),
        message: "CardFrame.astro missing layered illustration asset binding",
      },
      {
        name: "CardFrame.astro binds nammu layered symbol assets (4 medallions)",
        pass: /layeredConfig\.symbolInfinity/.test(frame) &&
              /layeredConfig\.symbolCost/.test(frame) &&
              /layeredConfig\.symbolQueen/.test(frame) &&
              /layeredConfig\.symbolWater/.test(frame),
        message: "CardFrame.astro missing one or more layered symbol asset bindings",
      },
      {
        name: "CardFrame.astro binds nammu layered lore text",
        pass: /layeredConfig\.loreText/.test(frame),
        message: "CardFrame.astro missing layered loreText binding",
      });
    checks.push({
      name: "legacy COST label removed from frame",
      pass: !frame.includes("COST"),
      message: "CardFrame.astro still contains legacy COST label",
    });

    // ── Content contract: Nammu lore and cost 7 ──────────────────────────────
    if (exists(CONTRACT_FILES.landing)) {
      const landing = readText(CONTRACT_FILES.landing);
      checks.push({
        name: "landing.ts contains Nammu full lore text",
        pass: /She brought no destruction, only memory/.test(landing),
        message: "landing.ts missing Nammu layered lore text",
      });
      checks.push({
        name: "landing.ts contains Nammu cost 7 in layered config",
        pass: /cost:\s*"7"/.test(landing) && /layered/.test(landing),
        message: "landing.ts layered config missing cost 7",
      });
      checks.push({
        name: "landing.ts points Nammu to full-card WebP asset",
        pass: /fullCard:\s*"\/assets\/cards\/nammu\/card\.webp"/.test(landing),
        message: "landing.ts missing Nammu fullCard WebP asset path",
      });
      checks.push({
        name: "landing.ts points Utu to full-card WebP asset",
        pass: /fullCard:\s*"\/assets\/cards\/utu\/card\.webp"/.test(landing),
        message: "landing.ts missing Utu fullCard WebP asset path",
      });
    }

    assertRegex(
      checks,
      theme,
      /\.card-frame-name\s*\{[\s\S]*?font-family:\s*"Marcellus",\s*"Garamond",\s*serif;[\s\S]*?text-shadow:\s*0\s+0\s+0\.5rem\s+var\(--card-element\);/m,
      "name strip exact typography and water shadow",
      "Name strip must use Marcellus/Garamond and text-shadow: 0 0 0.5rem var(--card-element)",
    );

    assertRegex(
      checks,
      theme,
      /\.card-frame-lore-panel\s*\{[\s\S]*?font-size:\s*0\.55rem;[\s\S]*?opacity:\s*0\.72;/m,
      "lore panel exact text contract",
      "Lore panel must set font-size: 0.55rem and opacity: 0.72",
    );

    assertRegex(
      checks,
      theme,
      /\.card-frame--water\s*\{\s*--card-element:\s*var\(--color-element-nammu\);\s*--card-illustration-position:\s*center\s+18%;\s*\}/m,
      "water variant exact palette and crop variables",
      "Water variant must set --card-element: var(--color-element-nammu) and --card-illustration-position: center 18%",
    );

    assertRegex(
      checks,
      theme,
      /color-mix\(in\s+oklch,\s*var\(--card-element\)\s+24%,\s*transparent\)/m,
      "water-tinted card glow contract",
      "Card glow must use color-mix(in oklch, var(--card-element) 24%, transparent)",
    );

    assertRegex(
      checks,
      theme,
      /--card-frame-medallion-size:\s*2\.25rem;/m,
      "medallion size variable default",
      "Theme must define --card-frame-medallion-size: 2.25rem",
    );

    assertRegex(
      checks,
      theme,
      /\.card-frame-corner\s*\{[\s\S]*?width:\s*2rem;[\s\S]*?height:\s*2rem;/m,
      "corner size contract 2rem x 2rem",
      "Corner slot style must set width/height to 2rem",
    );

    assertRegex(
      checks,
      theme,
      /\.card-frame-symbol\s*\{[\s\S]*?width:\s*2rem;[\s\S]*?height:\s*2rem;/m,
      "symbol badge size contract 2rem x 2rem",
      "Symbol badge must set width/height to 2rem",
    );
    assertRegex(
      checks,
      theme,
      /\.card-frame-symbol\s+img\s*\{[\s\S]*?width:\s*1\.25rem;[\s\S]*?height:\s*1\.25rem;/m,
      "symbol icon size contract 1.25rem x 1.25rem",
      "Symbol icon must set width/height to 1.25rem",
    );

    assertRegex(
      checks,
      theme,
      /\.card-frame-illustration\s+img\s*\{[\s\S]*?object-fit:\s*cover;[\s\S]*?object-position:\s*var\(--card-illustration-position,\s*center\s+18%\);/m,
      "illustration fit and crop contract",
      "Illustration img must keep object-fit: cover and object-position from --card-illustration-position fallback center 18%",
    );

    assertRegex(
      checks,
      theme,
      /\.card-frame-illustration::after\s*\{[\s\S]*?linear-gradient\([\s\S]*?transparent\s+60%[\s\S]*?80%[\s\S]*?100%/m,
      "illustration overlay lower-zone gradient exists",
      "Illustration overlay gradient is missing or changed",
    );

    for (const variant of ["fire", "water", "air", "earth"]) {
      assertRegex(
        checks,
        theme,
        new RegExp(`\\.card-frame--${variant}\\s*\\{`),
        `variant override exists: ${variant}`,
        `Missing .card-frame--${variant} variant override`,
      );
    }

    const anMatch = theme.match(/--color-element-an\s*:\s*([^;]+);/i);
    const anValue = anMatch ? anMatch[1].trim() : "";
    const hue = parseOklchHue(anValue);
    const inIvoryGoldRange = Number.isFinite(hue) && hue >= 80 && hue <= 110;
    const inBlueRange = Number.isFinite(hue) && hue >= 200 && hue <= 240;
    checks.push({
      name: "An palette hue is ivory/gold (not blue)",
      pass: inIvoryGoldRange && !inBlueRange,
      message: `An palette is blue-tinted or invalid: --color-element-an: ${anValue}`,
    });
  }

  if (exists(CONTRACT_FILES.anSvg)) {
    const anSvg = readText(CONTRACT_FILES.anSvg);
    assertRegex(
      checks,
      anSvg,
      /^\s*<svg[\s\S]*<\/svg>\s*$/m,
      "an.svg XML envelope",
      "an.svg must be a complete XML-safe SVG document",
    );
    checks.push({
      name: "an.svg has no unsafe raw ampersands",
      pass: !/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-f]+;)/i.test(anSvg),
      message: "an.svg contains raw '&' characters that are not XML-escaped",
    });
    checks.push({
      name: "an.svg uses white/gold/celestial palette wording",
      pass: /(white|ivory|gold|celestial|#fffaf0|#f4ead2|#d9c08a|#f8df9a|#c99a35)/i.test(anSvg),
      message: "an.svg does not contain white/gold/celestial palette markers",
    });
  }

  const promptFiles = [
    CONTRACT_FILES.promptsShared,
    CONTRACT_FILES.promptNammu,
    CONTRACT_FILES.promptUtu,
    CONTRACT_FILES.promptAn,
    CONTRACT_FILES.promptKi,
  ];

  for (const promptPath of promptFiles) {
    if (!exists(promptPath)) continue;
    const content = readText(promptPath);
    const label = path.basename(promptPath);

    assertRegex(checks, content, /sakuga/i, `${label} includes Sakuga`, "Prompt must include Sakuga style anchor");
    assertRegex(
      checks,
      content,
      /no\s+text[\s\S]*no\s+ui[\s\S]*(no\s+card\s+frame|no\s+frame)[\s\S]*no\s+corner\s+symbols/i,
      `${label} has generation exclusion constraints`,
      "Prompt must explicitly forbid text/UI/frame/corner symbols",
    );
    assertRegex(
      checks,
      content,
      /preserve\s+existing\s+frames?\s*\/\s*symbols?|preserve\s+existing\s+frame\s+and\s+symbols/i,
      `${label} preserves existing frame/symbol assets`,
      "Prompt must preserve existing frame/symbol assets",
    );
    assertRegex(
      checks,
      content,
      /(illustration\s+window\s+only|only\s+the\s+illustration\s+window\s+content)/i,
      `${label} limits generation scope to illustration window`,
      "Prompt must request illustration-window-only content",
    );
  }

  const paletteConstraints = [
    [CONTRACT_FILES.promptNammu, /(deep\s+indigo|ocean\s+blue|teal|moonlit\s+cyan)/i, "Nammu palette constraint"],
    [CONTRACT_FILES.promptUtu, /(amber|sun\-gold|copper|dawn\s+orange)/i, "Utu palette constraint"],
    [CONTRACT_FILES.promptAn, /(white|ivory|pale\s+gold|celestial\s+light)/i, "An palette constraint"],
    [CONTRACT_FILES.promptKi, /(jade|moss|earth\s+umber|verdant\s+brown)/i, "Ki palette constraint"],
  ];

  for (const [promptPath, paletteRegex, label] of paletteConstraints) {
    if (!exists(promptPath)) continue;
    const content = readText(promptPath);
    checks.push({
      name: label,
      pass: paletteRegex.test(content),
      message: `${path.basename(promptPath)} is missing expected palette constraints`,
    });
  }

  const legacyAnPromptFiles = [
    CONTRACT_FILES.legacyPromptAnBrief,
    CONTRACT_FILES.legacyPromptReadme,
  ];

  const legacyGenerationDocs = [
    CONTRACT_FILES.legacyPromptAnBrief,
    CONTRACT_FILES.legacyPromptReadme,
    CONTRACT_FILES.legacyGoddessesReadme,
  ];

  const legacyBlueDominantTerms = [
    /sky\s+blue/i,
    /blue-white\s+light/i,
    /pale\s+blue\s+gradient/i,
    /oklch\(\s*[0-9.]+\s*,?\s*[0-9.]+\s*,?\s*220\s*\)/i,
  ];

  for (const promptPath of legacyAnPromptFiles) {
    if (!exists(promptPath)) continue;
    const content = readText(promptPath);
    const label = path.basename(promptPath);

    checks.push({
      name: `${label} includes An celestial white/ivory/gold palette`,
      pass: /(white|ivory|pale\s+gold|celestial\s+light)/i.test(content),
      message: `${label} must include white/ivory/gold/celestial palette language for An`,
    });

  }

  for (const docPath of legacyGenerationDocs) {
    if (!exists(docPath)) continue;
    const content = readText(docPath);
    const label = path.basename(docPath);
    for (const forbidden of legacyBlueDominantTerms) {
      checks.push({
        name: `${label} excludes legacy blue-dominant term (${forbidden})`,
        pass: !forbidden.test(content),
        message: `${label} still contains forbidden legacy blue-dominant wording: ${forbidden}`,
      });
    }
  }

  if (exists(CONTRACT_FILES.generationOrder)) {
    const order = readText(CONTRACT_FILES.generationOrder);
    assertRegex(
      checks,
      order,
      /frame\s+contract\s+qa\s*->\s*nammu\s+pilot\s*->\s*qa\s*->\s*utu\s*\/\s*ki\s*\/\s*an\s*->\s*final\s+qa/i,
      "generation order documented",
      "Generation order must be documented as frame QA -> Nammu pilot -> QA -> Utu/Ki/An -> final QA",
    );
  }

  if (exists(CONTRACT_FILES.legacyPromptReadme)) {
    const readme = readText(CONTRACT_FILES.legacyPromptReadme);
    checks.push({
      name: "docs/prompts/README.md excludes all-four single-session instruction",
      pass: !/generate\s+all\s+four\s+goddesses?\s+in\s+a\s+single\s+session/i.test(readme),
      message: "docs/prompts/README.md still instructs generating all four in one session",
    });
    assertRegex(
      checks,
      readme,
      /frame\s+contract\s+qa[\s\S]*nammu\s+pilot[\s\S]*qa[\s\S]*utu[,\s\/]*ki[,\s\/]*an[\s\S]*final\s+qa/i,
      "docs/prompts/README.md includes mandatory generation order",
      "docs/prompts/README.md must include frame QA -> Nammu pilot -> QA -> Utu/Ki/An -> final QA",
    );
  }

  if (exists(CONTRACT_FILES.legacyGoddessesReadme)) {
    const readme = readText(CONTRACT_FILES.legacyGoddessesReadme);
    checks.push({
      name: "public/assets/landing/goddesses/README.md excludes all-four single-session instruction",
      pass: !/generate\s+all\s+four\s+in\s+a\s+single\s+chatgpt\s+image\s+2\s+session/i.test(readme),
      message: "public/assets/landing/goddesses/README.md still instructs generating all four in one session",
    });
    assertRegex(
      checks,
      readme,
      /frame\s+contract\s+qa[\s\S]*nammu\s+pilot[\s\S]*qa[\s\S]*utu[,\s\/]*ki[,\s\/]*an[\s\S]*final\s+qa/i,
      "public/assets/landing/goddesses/README.md includes mandatory generation order",
      "public/assets/landing/goddesses/README.md must include frame QA -> Nammu pilot -> QA -> Utu/Ki/An -> final QA",
    );
  }

  if (exists(CONTRACT_FILES.cinematicEntryGuideEs)) {
    const cinematicGuide = readText(CONTRACT_FILES.cinematicEntryGuideEs);
    checks.push({
      name: "cinematic-entry-guide.es.md excludes old An blue OKLCH token",
      pass: !/oklch\(0\.79\s+0\.08\s+220\)/i.test(cinematicGuide),
      message: "docs/lore/cinematic-entry-guide.es.md still references old An blue token oklch(0.79 0.08 220)",
    });
    checks.push({
      name: "cinematic-entry-guide.es.md excludes 'Luz celeste' for An",
      pass: !/luz\s+celeste/i.test(cinematicGuide),
      message: "docs/lore/cinematic-entry-guide.es.md still references 'Luz celeste' for An",
    });
    checks.push({
      name: "cinematic-entry-guide.es.md includes An ivory/white/gold celestial wording",
      pass: /(marfil|blanca?|dorado\s+p[aá]lido|celestial)/i.test(cinematicGuide),
      message: "docs/lore/cinematic-entry-guide.es.md must describe An with ivory/white/gold celestial light",
    });
  }

  return checks;
}

function main() {
  const checks = buildChecks();
  const failures = checks.filter((check) => !check.pass);
  const passes = checks.length - failures.length;

  console.log(`Frame Contract QA :: ${passes}/${checks.length} checks passing`);
  for (const check of checks) {
    const icon = check.pass ? "PASS" : "FAIL";
    console.log(`${icon} :: ${check.name}`);
    if (!check.pass) {
      console.log(`       ${check.message}`);
    }
  }

  if (failures.length > 0) {
    process.exitCode = 1;
    return;
  }

  process.exitCode = 0;
}

main();
