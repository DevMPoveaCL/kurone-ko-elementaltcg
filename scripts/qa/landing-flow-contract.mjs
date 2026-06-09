import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const FILES = {
  index: "src/pages/index.astro",
  landing: "src/content/landing.ts",
  newsletter: "src/content/newsletter.ts",
  primordial: "src/components/landing/PrimordialVerdict.astro",
  cardTypes: "src/components/landing/CardTypeReliquary.astro",
  anatomy: "src/components/landing/SacredGridAnatomy.astro",
  magnifierRuntime: "src/components/landing/magnifierRuntime.ts",
  roadmap: "src/components/landing/RoadmapSealedGate.astro",
  finalCta: "src/components/landing/FinalCTA.astro",
};

const CARD_TYPES = ["Allies", "Rooks", "Energy", "Talismans", "Queens"];
const CARD_TYPE_ASSETS = ["allies", "rooks", "energy", "talismans", "queens"];
const CARD_TYPE_WIDTHS = [300, 400, 600, 800, 1200, 1600];
const BATTLEFIELD_ASSETS = [
  { id: "battlefield", prefix: "image", widths: [480, 800, 1200, 1600, 2000], maxLargestKb: 400 },
  { id: "gilgamesh", prefix: "card", widths: [300, 400, 600, 800, 1200, 1600], maxLargestKb: 800 },
];
const ANATOMY_FIELDS = ["Power", "Energy Cost", "Name", "Illustration", "Lore", "Type", "Ability", "Attribute"];
const ROADMAP = ["Sumerian Edition", "Story Mode", "Duelist", "Future Eras"];
const HERO_NAV_LABELS = ["Cards", "Lore", "Types", "Battlefield", "Roadmap"];
const HERO_NAV_IDS = [
  "showing-cards",
  "primordial-verdict",
  "card-type-reliquary",
  "sacred-grid-anatomy",
  "sealed-roadmap",
];
const REMOVED_IMPORTS = ["TacticalBattlefield", "EnergyAscension", "CardAnatomy", "LoreFragments", "RoadmapTeaser"];
const BATTLEFIELD_HOTSPOTS = [
  { label: "Player Name", x: 3, y: 92 },
  { label: "Selected Card Preview", x: 3, y: 43 },
  { label: "Turn Phases", x: 21, y: 14 },
  { label: "Your Hand", x: 32, y: 92 },
  { label: "Pawn Line", x: 49, y: 62 },
  { label: "Rook, Knight, Bishop Line", x: 49, y: 76 },
  { label: "Reserve Energy", x: 40, y: 48 },
  { label: "Paid Energy", x: 58, y: 48 },
  { label: "Deck Count", x: 79, y: 81 },
  { label: "Graveyard Check", x: 79, y: 58 },
];
const GILGAMESH_HOTSPOTS = [
  { label: "Power", x: 4, y: 0 },
  { label: "Name", x: 48, y: 0 },
  { label: "Energy Cost", x: 95, y: 0 },
  { label: "Illustration", x: 4, y: 42 },
  { label: "Lore", x: 4, y: 68 },
  { label: "Type", x: 4, y: 101 },
  { label: "Ability", x: 50, y: 101 },
  { label: "Attribute", x: 94, y: 101 },
];
const GILGAMESH_MARKER_TEXT_BY_NUMBER = [
  { label: "Power", position: "Top-left medallion" },
  { label: "Name", position: "Center-top strip" },
  { label: "Energy Cost", position: "Top-right medallion" },
  { label: "Illustration", position: "Central window" },
  { label: "Lore", position: "Lower illustration panel" },
  { label: "Type", position: "Bottom-left medallion" },
  { label: "Ability", position: "Bottom-center tablet" },
  { label: "Attribute", position: "Bottom-right medallion" },
];

function resolve(relativePath) {
  return path.join(ROOT, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(resolve(relativePath));
}

function read(relativePath) {
  return exists(relativePath) ? fs.readFileSync(resolve(relativePath), "utf8") : "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readBattlefieldHotspotSource(label) {
  const pattern = new RegExp(
    `label:\\s*"${escapeRegExp(label)}",[\\s\\S]*?x:\\s*"(?<x>\\d+)%",[\\s\\S]*?y:\\s*"(?<y>\\d+)%"`,
  );
  const match = landing.match(pattern);
  const x = Number(match?.groups?.x ?? NaN);
  const y = Number(match?.groups?.y ?? NaN);

  return { x, y };
}

function readGilgameshHotspotSource(label) {
  const pattern = new RegExp(
    `label:\\s*"${escapeRegExp(label)}",[\\s\\S]*?position:\\s*"[^"]+",[\\s\\S]*?detail:\\s*"[^"]+",[\\s\\S]*?x:\\s*"(?<x>\\d+)%",[\\s\\S]*?y:\\s*"(?<y>\\d+)%"`,
  );
  const match = landing.match(pattern);
  const x = Number(match?.groups?.x ?? NaN);
  const y = Number(match?.groups?.y ?? NaN);

  return { x, y };
}

function readGilgameshMarkerTextByNumber(markerNumber) {
  const anatomyFieldsMatch = landing.match(/cardImage:\s*gilgameshCardImage\(\),\s*anatomyFields:\s*\[(?<body>[\s\S]*?)\n\s*\],/);
  const fieldBlocks = Array.from(anatomyFieldsMatch?.groups?.body.matchAll(/\{(?<body>[\s\S]*?)\n\s*\}/g) ?? []).map((match) => match.groups?.body ?? "");
  const block = fieldBlocks[markerNumber - 1] ?? "";
  const label = block.match(/label:\s*"(?<label>[^"]+)"/)?.groups?.label ?? "";
  const position = block.match(/position:\s*"(?<position>[^"]+)"/)?.groups?.position ?? "";

  return { label, position };
}

function add(checks, name, pass, message) {
  checks.push({ name, pass, message });
}

function nearlyEqual(actual, expected) {
  return Math.abs(actual - expected) < 0.001;
}

const checks = [];
const index = read(FILES.index);
const landing = read(FILES.landing);
const newsletter = read(FILES.newsletter);
const hero = read("src/components/landing/HeroReliquary.astro");
const primordial = read(FILES.primordial);
const theme = read("src/styles/theme.css");
const anatomy = read(FILES.anatomy);
const showingCards = read("src/components/landing/ShowingCards.astro");
const cardTypes = read(FILES.cardTypes);
const magnifierRuntime = read(FILES.magnifierRuntime);
const desktopBattlefieldShowcaseTemplateRules = Array.from(
  theme.matchAll(/@media\s*\(min-width:\s*1024px\)\s*\{[\s\S]*?\.battlefield-showcase\s*\{[\s\S]*?grid-template-(?:columns|areas)\s*:/g),
).length;
const battlefieldBoardMagnifierRule = theme.match(/\.battlefield-arena-panel\s+\.battlefield-board-tilt\s*\{(?<body>[\s\S]*?)\}/);
const battlefieldBoardMagnifierScale = Number(
  battlefieldBoardMagnifierRule?.groups?.body.match(/--magnifier-scale:\s*(?<scale>[\d.]+)/)?.groups?.scale ?? NaN,
);
const battlefieldBoardMagnifierLensRadius = Number(
  battlefieldBoardMagnifierRule?.groups?.body.match(/--magnifier-lens-radius:\s*(?<radius>[\d.]+)%/)?.groups?.radius ?? NaN,
);
const battlefieldBoardMagnifierLensSize =
  battlefieldBoardMagnifierRule?.groups?.body.match(/--magnifier-lens-size:\s*(?<size>clamp\([^;]+\))/)?.groups?.size ?? "";
const battlefieldCardMagnifierRule = theme.match(/\.battlefield-card-stage\s+\.battlefield-card-tilt\s*\{(?<body>[\s\S]*?)\}/);
const battlefieldCardMagnifierScale = Number(
  battlefieldCardMagnifierRule?.groups?.body.match(/--magnifier-scale:\s*(?<scale>[\d.]+)/)?.groups?.scale ?? NaN,
);
const battlefieldCardMagnifierLensRadius = Number(
  battlefieldCardMagnifierRule?.groups?.body.match(/--magnifier-lens-radius:\s*(?<radius>[\d.]+)%/)?.groups?.radius ?? NaN,
);
const battlefieldCardMagnifierLensSize =
  battlefieldCardMagnifierRule?.groups?.body.match(/--magnifier-lens-size:\s*(?<size>clamp\([^;]+\))/)?.groups?.size ?? "";
const battlefieldShowcaseDesktopRule = theme.match(/@media\s*\(min-width:\s*1024px\)\s*\{[\s\S]*?\.battlefield-showcase\s*\{(?<body>[\s\S]*?)\}\s*\}/);
const battlefieldShowcaseDesktopBody = battlefieldShowcaseDesktopRule?.groups?.body ?? "";
const battlefieldCardTiltBody = battlefieldCardMagnifierRule?.groups?.body ?? "";
const battlefieldHotspotCardLayerRule = theme.match(/\.battlefield-hotspot-layer--card\s*\{(?<body>[\s\S]*?)\}/);
const battlefieldHotspotCardLayerBody = battlefieldHotspotCardLayerRule?.groups?.body ?? "";
const showingCardTiltMagnifierRule = theme.match(/\.showing-card-tilt\s*\{(?<body>[\s\S]*?)\}/);
const defaultMagnifierLensRadius = Number(
  showingCardTiltMagnifierRule?.groups?.body.match(/--magnifier-lens-radius:\s*(?<radius>[\d.]+)%/)?.groups?.radius ?? NaN,
);
const defaultMagnifierScale = Number(
  showingCardTiltMagnifierRule?.groups?.body.match(/--magnifier-scale:\s*(?<scale>[\d.]+)/)?.groups?.scale ?? NaN,
);
const defaultMagnifierLensSize =
  showingCardTiltMagnifierRule?.groups?.body.match(/--magnifier-lens-size:\s*(?<size>clamp\([^;]+\))/)?.groups?.size ?? "";
const sacredGridLensRadius = defaultMagnifierLensRadius * 0.9;
const battlefieldExplanationPanelRule = theme.match(/\.battlefield-explanation-panel\s*\{(?<body>[\s\S]*?)\}/);
const battlefieldExplanationPanelBody = battlefieldExplanationPanelRule?.groups?.body ?? "";
const battlefieldContentRule = theme.match(/\.battlefield-content\s*\{(?<body>[\s\S]*?)\}/);
const battlefieldContentBody = battlefieldContentRule?.groups?.body ?? "";
const sacredGridFrameRule = theme.match(/\.battlefield-content::before\s*\{(?<body>[\s\S]*?)\}/);
const sacredGridFrameBody = sacredGridFrameRule?.groups?.body ?? "";
const sacredGridCornerRule = theme.match(/\.battlefield-content::after\s*\{(?<body>[\s\S]*?)\}/);
const sacredGridCornerBody = sacredGridCornerRule?.groups?.body ?? "";
const roadmapSealedGateRule = theme.match(/\.roadmap-sealed-gate\s*\{(?<body>[\s\S]*?)\}/);
const roadmapSealedGateBody = roadmapSealedGateRule?.groups?.body ?? "";
const roadmapSealedGateAccentRule = theme.match(/\.roadmap-sealed-gate::before\s*\{(?<body>[\s\S]*?)\}/);
const roadmapSealedGateAccentBody = roadmapSealedGateAccentRule?.groups?.body ?? "";
const showingCardMagnifierRuleBodies = Array.from(
  theme.matchAll(/\.showing-card-magnifier\s*\{(?<body>[\s\S]*?)\}/g),
).map((match) => match.groups?.body ?? "");
const showingCardMagnifierUsesTransformScale = showingCardMagnifierRuleBodies.some((body) =>
  /transform\s*:\s*scale\(/.test(body),
);

for (const [name, file] of Object.entries(FILES)) {
  add(checks, `${name} file exists`, exists(file), `Missing ${file}`);
}

add(
  checks,
  "index renders new post-ShowingCards flow",
  /<PrimordialVerdict/.test(index) && /<CardTypeReliquary/.test(index) && /<SacredGridAnatomy/.test(index) && /<RoadmapSealedGate/.test(index),
  "index.astro must render the new primordial/card-type/grid/roadmap sections",
);
add(
  checks,
  "index removes old lower landing imports",
  REMOVED_IMPORTS.every((name) => !index.includes(name)),
  "index.astro still imports or renders an old lower section",
);
add(
  checks,
  "new sections remain after ShowingCards and before CTA",
  index.indexOf("<ShowingCards") < index.indexOf('id="primordial-verdict"') &&
    index.indexOf('id="primordial-verdict"') < index.indexOf('id="card-type-reliquary"') &&
    index.indexOf('id="card-type-reliquary"') < index.indexOf('id="sacred-grid-anatomy"') &&
    index.indexOf('id="sacred-grid-anatomy"') < index.indexOf('id="sealed-roadmap"') &&
    index.indexOf('id="sealed-roadmap"') < index.indexOf('id="follow-first-edition"'),
  "New lower sections must follow ShowingCards in the approved order",
);
add(
  checks,
  "hero navigation points to current full-viewport sections",
  /heroNavSections/.test(hero) && /sections\.filter\(\(section\) => section\.navLabel !== undefined\)/.test(hero) && /href=\{`#\$\{section\.id\}`\}/.test(hero) &&
    HERO_NAV_LABELS.every((label) => landing.includes(`navLabel: "${label}"`)) &&
    HERO_NAV_IDS.every((id) => landing.includes(`id: "${id}"`)) &&
    !/#tactical-battlefield|#energy-ascension|#card-anatomy/.test(hero),
  "Hero nav must be generated from landing section metadata, include the final First Edition CTA, and avoid obsolete anchors",
);
add(
  checks,
  "post-ShowingCards sections use full viewport wrappers",
  ["primordial-verdict", "card-type-reliquary", "sacred-grid-anatomy", "sealed-roadmap", "follow-first-edition"].every((id) =>
    index.includes(`id="${id}" class="landing-viewport-section`),
  ) && /min-height:\s*100svh/.test(theme) && !/max-w-6xl/.test(index) && /max-w-7xl/.test(index),
  "Each major post-ShowingCards section must be a full viewport wrapper",
);
add(
  checks,
  "section content width matches ShowingCards intro rhythm",
  /showing-cards-section[\s\S]*max-w-7xl/.test(index) &&
    /id="primordial-verdict"[\s\S]*max-w-7xl/.test(index) &&
    /max-w-none text-3xl/.test(primordial) &&
    /max-w-none text-base/.test(primordial),
  "Trial and lower sections must use the same max-w-7xl content width as ShowingCards, with full-width intro copy",
);
add(
  checks,
  "lower sections use continuous ShowingCards-style background",
  ["primordial-verdict", "card-type-reliquary", "sacred-grid-anatomy", "sealed-roadmap", "follow-first-edition"].every((id) =>
    index.includes(`id="${id}" class="landing-viewport-section landing-viewport-section--continuum`),
  ) &&
    /class="landing-continuum"/.test(index) &&
    /\.landing-continuum\s*\{[\s\S]*radial-gradient\(circle at 18% 18%[\s\S]*var\(--color-element-nammu\)[\s\S]*linear-gradient\(135deg/.test(theme) &&
    !/landing-viewport-section--dark/.test(index) &&
    !/landing-viewport-section--light/.test(index),
  "Post-ShowingCards sections must share one continuous ShowingCards-style parent background, not per-section backgrounds",
);
add(
  checks,
  "scroll reveal targets content not background wrappers",
  !/class="[^"]*landing-viewport-section[^"]*scroll-reveal/.test(index) &&
    /class="scroll-reveal mx-auto flex min-h-\[100svh\]/.test(index) &&
    /\.showing-cards-section\s*\{[\s\S]*background:\s*transparent/.test(theme) &&
    /\.landing-continuum::before[\s\S]*position:\s*fixed/.test(theme),
  "Scroll reveal must animate section content only while the continuum background stays fixed",
);
add(
  checks,
  "old alternation palettes are not used by lower sections",
  !/\.landing-viewport-section--dark\s*\{/.test(theme) && !/\.landing-viewport-section--light\s*\{/.test(theme),
  "Lower landing should not define separate light/dark viewport palettes while testing the continuum treatment",
);
add(
  checks,
  "oldest trial uses golden contrast frame",
  !/reliquary-panel/.test(primordial) && /primordial-verdict-content primordial-verdict-frame/.test(primordial) && /\.primordial-verdict-frame\s*\{[\s\S]*var\(--color-metal-aged-gold\)/.test(theme),
  "PrimordialVerdict must use its dedicated golden contrast frame, not the generic reliquary-panel chrome",
);
add(
  checks,
  "primordial rules include report-backed energy thresholds",
  /three energy/.test(landing) && /six/.test(landing) && /seven/.test(landing) && /Queen may descend/.test(landing),
  "Primordial rules must include 3/6/7 energy progression from the TCG report",
);
add(
  checks,
  "card types match TCG report categories",
  CARD_TYPES.every((type) => landing.includes(`slot: "${type}"`)) && /CARD_TYPE_ORDER = \["allies", "rooks", "energy", "talismans", "queens"\]/.test(landing),
  "Card type section must include Allies, Rooks, Energy, Talismans, and Queens in the approved carousel order",
);
add(
  checks,
  "card type section uses ShowingCards-style carousel without outer frame",
  !/reliquary-panel/.test(read(FILES.cardTypes)) &&
    /data-card-type-root/.test(read(FILES.cardTypes)) &&
    /lg:grid-cols-\[minmax\(0,0\.92fr\)_minmax\(17rem,0\.68fr\)\]/.test(read(FILES.cardTypes)) &&
    /data-card-type-lore[\s\S]*data-card-type-stage/.test(read(FILES.cardTypes)) &&
    /data-card-type-slot="trailing-1"/.test(read(FILES.cardTypes)) &&
    /data-card-type-slot="trailing-2"/.test(read(FILES.cardTypes)) &&
    /loading="lazy"/.test(read(FILES.cardTypes)) &&
    /decoding="async"/.test(read(FILES.cardTypes)) &&
    /data-card-type-magnifier/.test(read(FILES.cardTypes)),
  "Sacred Typology must use text-left/card-right carousel layout with trailing cards, lazy images, magnifier, and no generic golden reliquary-panel frame",
);
add(
  checks,
  "card type variants support active card and magnifier",
  CARD_TYPE_ASSETS.every((asset) =>
    CARD_TYPE_WIDTHS.every((width) => exists(`public/assets/landing/card-types/${asset}/variants/card-${width}w.webp`)) &&
      fs.statSync(resolve(`public/assets/landing/card-types/${asset}/variants/card-800w.webp`)).size < 270 * 1024 &&
      fs.statSync(resolve(`public/assets/landing/card-types/${asset}/variants/card-1600w.webp`)).size < 720 * 1024,
  ) && /cardTypeSrcSet/.test(landing) && /cardTypeMagnifierSrcSet/.test(landing),
  "Sacred Typology must have generated 300-1600w variants and DRY srcset helpers for the active card and magnifier",
);
add(
  checks,
  "card type carousel is keyboard and reduced-motion safe",
  /ArrowLeft/.test(read(FILES.cardTypes)) &&
    /ArrowRight/.test(read(FILES.cardTypes)) &&
    /rotateY/.test(magnifierRuntime) &&
    /rotateX/.test(magnifierRuntime) &&
    /updateTrailingCards/.test(read(FILES.cardTypes)) &&
    /aria-live="polite"/.test(read(FILES.cardTypes)) &&
    /data-card-type-dot/.test(read(FILES.cardTypes)) &&
    /card-type-lore\[data-motion-ready="true"\]/.test(theme) &&
    /prefers-reduced-motion: reduce[\s\S]*card-type-lore/.test(theme),
  "Card type carousel must support keyboard navigation, live updates, dots, and reduced-motion users",
);
add(
  checks,
  "ally hierarchy mentions Pawn Bishop Knight",
  /Pawn · Bishop · Knight/.test(landing) && /Pawn must be discarded/.test(landing),
  "Allies copy must mention Pawn/Bishop/Knight and the Pawn discard requirement",
);
add(
  checks,
  "battlefield uses 6+2+2+2 deployment model",
  /Six Pawn lanes/.test(landing) && /Two Rooks/.test(landing) && /Two Knights/.test(landing) && /Two Bishops/.test(landing) && /battlefieldImage/.test(landing) && /battlefieldGuide/.test(landing),
  "Sacred grid copy must include 6 Pawns, 2 Rooks, 2 Knights, 2 Bishops",
);
add(
  checks,
  "battlefield section uses approved responsive assets",
  BATTLEFIELD_ASSETS.every(({ id, prefix, widths, maxLargestKb }) =>
    widths.every((width) => exists(`public/assets/landing/battlefield/${id}/variants/${prefix}-${width}w.webp`)) &&
      fs.statSync(resolve(`public/assets/landing/battlefield/${id}/variants/${prefix}-${widths.at(-1)}w.webp`)).size < maxLargestKb * 1024,
  ) &&
    /battlefield-arena-image/.test(read(FILES.anatomy)) &&
    /battlefield-showcase/.test(read(FILES.anatomy)) &&
    /battlefield-hotspot/.test(read(FILES.anatomy)) &&
    /data-battlefield-board-magnifier/.test(read(FILES.anatomy)) &&
    !/fieldGuideImage|CampoTCG/.test(landing + read(FILES.anatomy)) &&
    /data-battlefield-card-magnifier/.test(read(FILES.anatomy)),
  "Battlefield must render optimized battlefield and Gilgamesh variants with hover/focus narrative hotspots, without embedding CampoTCG",
);
add(
  checks,
  "battlefield desktop layout keeps board and card in separate cells",
  !/\.battlefield-showcase\s*>\s*figure\s*,\s*\.battlefield-showcase\s*>\s*aside\s*\{[\s\S]*?grid-area:\s*images/.test(theme) &&
    !/\.battlefield-arena-panel\s*\{[\s\S]*?grid-area:\s*([\w-]+)[\s\S]*?\.battlefield-card-anatomy\s*\{[\s\S]*?grid-area:\s*\1/.test(theme),
  "Battlefield board and Gilgamesh card must not be assigned to the same desktop grid-area",
);
add(
  checks,
  "battlefield desktop layout has one showcase template source",
  desktopBattlefieldShowcaseTemplateRules === 1,
  "theme.css must define the desktop .battlefield-showcase grid template once to avoid conflicting board/card layout rules",
);
add(
  checks,
  "SacredGrid layout gives the frame a wider viewport footprint",
  /grid-template-columns:\s*minmax\(0,\s*1\.78fr\)\s*minmax\(clamp\(13\.5rem,\s*18\.9vw,\s*18\.9rem\),\s*0\.52fr\)/.test(battlefieldShowcaseDesktopBody) &&
    /width:\s*calc\(100vw\s*-\s*clamp\(1\.25rem,\s*4vw,\s*3\.5rem\)\)/.test(battlefieldContentBody) &&
    /max-width:\s*92rem/.test(battlefieldContentBody) &&
    /padding:\s*clamp\(0\.9rem,\s*1\.6vw,\s*1\.35rem\)\s*clamp\(0\.95rem,\s*2\.2vw,\s*2rem\)/.test(battlefieldContentBody) &&
    /gap:\s*clamp\(1\.15rem,\s*2\.2vw,\s*2rem\)/.test(theme) &&
    /width:\s*clamp\(11\.7rem,\s*min\(18\.9vw,\s*43\.2svh\),\s*18\.9rem\)/.test(battlefieldCardTiltBody) &&
    /max-width:\s*min\(52\.2vw,\s*18\.9rem\)/.test(battlefieldCardTiltBody) &&
    /min-height:\s*min\(46\.8svh,\s*28\.8rem\)/.test(theme) &&
    /width:\s*clamp\(11\.7rem,\s*min\(18\.9vw,\s*43\.2svh\),\s*18\.9rem\)/.test(battlefieldHotspotCardLayerBody) &&
    !/width:\s*clamp\(13rem,\s*min\(21vw,\s*48svh\),\s*21rem\)/.test(theme) &&
    !/grid-template-columns:\s*minmax\(0,\s*1\.72fr\)\s*minmax\(clamp\(15rem,\s*21vw,\s*21rem\),\s*0\.58fr\)/.test(theme) &&
    !/width:\s*clamp\(9rem,\s*min\(12vw,\s*28svh\),\s*15rem\)/.test(theme) &&
    !/grid-template-columns:\s*minmax\(0,\s*1\.55fr\)\s*minmax\(10rem,\s*0\.45fr\)/.test(theme),
  "SacredGrid should expand beyond the old compact max-w-7xl footprint while keeping board/card sizes responsive and at least as large as the approved baseline",
);
add(
  checks,
  "battlefield board hotspots are anchored inside the tilt container",
  /data-battlefield-board-magnifier[\s\S]*?<div class="battlefield-hotspot-layer" aria-label=\{anatomy\.battlefieldGuide\.title\}/.test(anatomy) &&
    !/<\/div>\s*<div class="battlefield-hotspot-layer" aria-label=\{anatomy\.battlefieldGuide\.title\}/.test(anatomy),
  "Battlefield hotspot layer must live inside the board tilt/image container, not after the tilt where panel height can move it",
);
add(
  checks,
  "battlefield hotspots use separate hidden explanation panels",
  /data-battlefield-explanation-panel/.test(anatomy) &&
    /data-card-explanation-panel/.test(anatomy) &&
    !/class="battlefield-explanation-display"/.test(anatomy) &&
    /data-battlefield-explanation-panel[\s\S]*hidden/.test(anatomy) &&
    /data-card-explanation-panel[\s\S]*hidden/.test(anatomy) &&
    /hideExplanation/.test(anatomy) &&
    /mouseleave/.test(anatomy) &&
    /focusout/.test(anatomy) &&
    !/updateExplanation\(0\s*,/.test(anatomy) &&
    !/data-explanation-number>1</.test(anatomy),
  "Battlefield and Gilgamesh hotspots must control their own hidden-by-default explanation panels without showing item 1 by default",
);
add(
  checks,
  "battlefield explanation panels overlay without affecting layout height",
  /\.battlefield-arena-panel\s*\{[\s\S]*?position:\s*relative/.test(theme) &&
    /\.battlefield-card-stage\s*\{[\s\S]*?position:\s*relative/.test(theme) &&
    /position:\s*absolute/.test(battlefieldExplanationPanelBody) &&
    /bottom:\s*clamp\(/.test(battlefieldExplanationPanelBody) &&
    /z-index:\s*30/.test(battlefieldExplanationPanelBody) &&
    /pointer-events:\s*none/.test(battlefieldExplanationPanelBody) &&
    /background:\s*color-mix\(in oklch,\s*var\(--color-surface-obsidian\)\s*92%,\s*transparent\)/.test(battlefieldExplanationPanelBody) &&
    !/margin-top\s*:/.test(battlefieldExplanationPanelBody) &&
    /\.battlefield-explanation-panel\[hidden\]\s*\{[\s\S]*?display:\s*none/.test(theme) &&
    /<div class="battlefield-card-stage">[\s\S]*data-card-explanation-panel[\s\S]*<\/div>\s*<\/aside>/.test(anatomy),
  "Battlefield and Gilgamesh explanation panels must be absolute overlays inside relative containers, with no margin-top flow spacing",
);
add(
  checks,
  "battlefield hotspot order and visual coordinates match approved reference",
  !/\.battlefield-hotspot-layer:not\(\.battlefield-hotspot-layer--card\)\s+\.battlefield-hotspot--field:nth-child\(/.test(theme) &&
    BATTLEFIELD_HOTSPOTS.every(({ label, x, y }) => {
      const position = readBattlefieldHotspotSource(label);
      return position.x === x && position.y === y;
    }),
  "Battlefield field hotspots must keep approved coordinates in landing content, without CSS coordinate override patches",
);
add(
  checks,
  "SacredGrid uses a stronger non-interactive golden ritual frame",
  /#sacred-grid-anatomy\.landing-viewport-section\s*\{[\s\S]*?overflow:\s*visible/.test(theme) &&
    /content:\s*""/.test(sacredGridFrameBody) &&
    /position:\s*absolute/.test(sacredGridFrameBody) &&
    /pointer-events:\s*none/.test(sacredGridFrameBody) &&
    /border:\s*1px\s+solid\s+color-mix\(in oklch,\s*var\(--color-metal-aged-gold\)\s*72%,\s*transparent\)/.test(sacredGridFrameBody) &&
    /border-radius:\s*clamp\(/.test(sacredGridFrameBody) &&
    /linear-gradient\(180deg,\s*color-mix\(in oklch,\s*var\(--color-surface-obsidian\)\s*54%,\s*transparent\)/.test(sacredGridFrameBody) &&
    /box-shadow:[\s\S]*0\s+0\s+3\.6rem\s+color-mix\(in oklch,\s*var\(--color-metal-aged-gold\)\s*18%,\s*transparent\)/.test(sacredGridFrameBody) &&
    /inset\s+0\s+0\s+3rem\s+color-mix\(in oklch,\s*black\s*32%,\s*transparent\)/.test(sacredGridFrameBody) &&
    /position:\s*absolute/.test(sacredGridCornerBody) &&
    /pointer-events:\s*none/.test(sacredGridCornerBody) &&
    /var\(--color-metal-aged-gold-bright\)/.test(sacredGridCornerBody) &&
    /\.battlefield-content\s*>\s*\*\s*\{[\s\S]*?z-index:\s*1/.test(theme),
  "SacredGrid content must have a high-presence aged-gold frame with dark fill, glow, corner emphasis, and no hotspot/magnifier pointer interception",
);
add(
  checks,
  "SacredGrid data JSON is safely escaped",
    /const battlefieldSymbolsJson = JSON\.stringify\(anatomy\.battlefieldGuide\.symbols\)\.replaceAll\("<", "\\\\u003c"\);/.test(anatomy) &&
    /const cardAnatomyJson = JSON\.stringify\(anatomy\.anatomyFields\)\.replaceAll\("<", "\\\\u003c"\);/.test(anatomy) &&
    /<script type="application\/json" data-battlefield-symbols is:inline set:html=\{battlefieldSymbolsJson\}><\/script>/.test(anatomy) &&
    /<script type="application\/json" data-card-anatomy is:inline set:html=\{cardAnatomyJson\}><\/script>/.test(anatomy) &&
    !/<script type="application\/json"[^>]*data-(?:battlefield-symbols|card-anatomy)[\s\S]*?JSON\.stringify/.test(anatomy),
  "SacredGrid JSON data scripts must use pre-escaped JSON constants, replacing '<' with \\u003c before inlining",
);
add(
  checks,
  "SacredGrid runtime selectors are scoped to the section root",
    /data-sacred-grid-anatomy-root/.test(anatomy) &&
    /const root = script instanceof HTMLElement \? script\.closest\("\[data-sacred-grid-anatomy-root\]"\) : null;/.test(anatomy) &&
    /const dataScript = root\.querySelector\(selector\);/.test(anatomy) &&
    /parseDataScript\('\[data-battlefield-symbols\]'\)/.test(anatomy) &&
    /parseDataScript\('\[data-card-anatomy\]'\)/.test(anatomy) &&
    /root\.querySelector\('\[data-battlefield-explanation-panel\]'\)/.test(anatomy) &&
    /root\.querySelector\('\[data-card-explanation-panel\]'\)/.test(anatomy) &&
    /root\.querySelectorAll\('\.battlefield-hotspot--field button'\)/.test(anatomy) &&
    /root\.querySelectorAll\('\.battlefield-hotspot--card button'\)/.test(anatomy) &&
    !/document\.querySelector(?:All)?\(\s*['"`](?:\[data-battlefield-tilt\]|\[data-battlefield-symbols\]|\[data-card-anatomy\]|\[data-battlefield-explanation-panel\]|\[data-card-explanation-panel\]|\.battlefield-hotspot--field|\.battlefield-hotspot--card|\.battlefield-arena-panel|\.battlefield-card-anatomy)/.test(anatomy),
  "SacredGrid runtime hotspot, panel, and data selectors must be root-scoped, not global document selectors",
);
add(
  checks,
  "landing magnifier runtime is shared across card sections",
  /export const installCardMagnifierRuntime/.test(magnifierRuntime) &&
    /data-card-magnifier-runtime/.test(showingCards) &&
    /data-card-magnifier-runtime/.test(cardTypes) &&
    /data-card-magnifier-runtime/.test(anatomy) &&
    [showingCards, cardTypes, anatomy].every((source) => /installCardMagnifierRuntime\(document\)/.test(source)) &&
    /MAGNIFIER_ROOT_SELECTOR\s*=\s*"\[data-card-magnifier-runtime\]"/.test(magnifierRuntime),
  "ShowingCards, CardTypeReliquary, and SacredGrid must install the shared magnifier runtime through data-card-magnifier-runtime",
);
add(
  checks,
  "landing sections do not duplicate bespoke pointer magnifier logic",
  [showingCards, cardTypes, anatomy].every((source) =>
    !/pointerX\s*=\s*50/.test(source) &&
    !/resolveStableMagnifierState/.test(source) &&
    !/requestAnimationFrame\(apply(?:Tilt|Magnifier)\)/.test(source),
  ) &&
    /pointerX\s*=\s*50/.test(magnifierRuntime) &&
    /resolveStableMagnifierState/.test(magnifierRuntime),
  "Pointer-relative tilt/magnifier state must live in magnifierRuntime.ts, not in individual landing components",
);
add(
  checks,
  "SacredGrid JSON parsing is guarded",
  /function parseDataScript\(selector\)/.test(anatomy) &&
    /try\s*\{[\s\S]*?JSON\.parse[\s\S]*?\}\s*catch\s*\{[\s\S]*?return \[\];[\s\S]*?\}/.test(anatomy) &&
    !/const battlefieldSymbols = JSON\.parse/.test(anatomy) &&
    !/const cardAnatomy = JSON\.parse/.test(anatomy),
  "SacredGrid JSON.parse calls must be wrapped in try/catch so malformed data cannot abort listener binding",
);
add(
  checks,
  "battlefield removes shared default explanation implementation",
  !/battlefield-explanation-display/.test(anatomy + theme) &&
    !/battlefield-explanation-item/.test(anatomy + theme) &&
    !/is-highlighted/.test(anatomy + theme) &&
    !/updateExplanation\s*\(/.test(anatomy),
  "SacredGrid must not keep shared/default explanation item CSS or JS patterns after switching to hidden per-block panels",
);
add(
  checks,
  "battlefield magnifier metadata is content-driven and high-resolution",
  /magnifiedSrc/.test(landing) &&
    /magnifiedSrcSet/.test(landing) &&
    /BATTLEFIELD_NATIVE_SRC\s*=\s*"\/battlefield\.webp"/.test(landing) &&
    /BATTLEFIELD_NATIVE_WIDTH\s*=\s*1914/.test(landing) &&
    /BATTLEFIELD_NATIVE_HEIGHT\s*=\s*822/.test(landing) &&
    /magnifiedSrc:\s*id === "battlefield" \? BATTLEFIELD_NATIVE_SRC/.test(landing) &&
    /magnifiedSrcSet:\s*id === "battlefield" \? `\$\{BATTLEFIELD_NATIVE_SRC\} \$\{BATTLEFIELD_NATIVE_WIDTH\}w`/.test(landing) &&
    /src=\{anatomy\.battlefieldImage\.magnifiedSrc\}/.test(anatomy) &&
    /srcset=\{anatomy\.battlefieldImage\.magnifiedSrcSet\}/.test(anatomy) &&
    /sizes=\{anatomy\.battlefieldImage\.magnifiedSizes\}/.test(anatomy) &&
    !/magnifiedSrc:\s*`\/assets\/landing\/battlefield\/\$\{id\}\/variants\/image-2000w\.webp`/.test(landing) &&
    !/src="\/assets\/landing\/battlefield\/battlefield\/variants\/image-2000w\.webp"/.test(anatomy) &&
    !/image-480w\.webp 480w[\s\S]*data-battlefield-board-magnifier/.test(anatomy),
  "Battlefield magnifier must use the native /battlefield.webp source from landing content metadata, not the upscaled 2000w derivative",
);
add(
  checks,
  "shared magnifier uses native-detail positioning instead of transform zoom",
  Number.isFinite(battlefieldBoardMagnifierScale) &&
    battlefieldBoardMagnifierScale === 0.55 &&
    Number.isFinite(defaultMagnifierLensRadius) &&
    defaultMagnifierLensRadius === 24 &&
    Number.isFinite(defaultMagnifierScale) &&
    defaultMagnifierScale === 0.6 &&
    defaultMagnifierLensSize === "clamp(12rem, 18vw, 18rem)" &&
    Number.isFinite(battlefieldBoardMagnifierLensRadius) &&
    nearlyEqual(battlefieldBoardMagnifierLensRadius, sacredGridLensRadius) &&
    battlefieldBoardMagnifierLensSize === "clamp(12rem, 18vw, 18rem)" &&
    Number.isFinite(battlefieldCardMagnifierScale) &&
    battlefieldCardMagnifierScale === 0.28 &&
    battlefieldCardMagnifierScale < battlefieldBoardMagnifierScale &&
    Number.isFinite(battlefieldCardMagnifierLensRadius) &&
    nearlyEqual(battlefieldCardMagnifierLensRadius, sacredGridLensRadius) &&
    battlefieldCardMagnifierLensSize === battlefieldBoardMagnifierLensSize &&
    !showingCardMagnifierUsesTransformScale &&
    /width:\s*var\(--magnifier-source-width,\s*100%\)/.test(theme) &&
    /height:\s*var\(--magnifier-source-height,\s*100%\)/.test(theme) &&
    /left:\s*var\(--magnifier-object-x,\s*0\)/.test(theme) &&
    /top:\s*var\(--magnifier-object-y,\s*0\)/.test(theme) &&
    /clip-path:\s*circle\(var\(--magnifier-lens-size,\s*var\(--magnifier-lens-radius,\s*24%\)\)/.test(theme) &&
    /resolveRenderedSourceSize/.test(magnifierRuntime) &&
    /readOptionalLensSize/.test(magnifierRuntime) &&
    /removeProperty\("--magnifier-lens-size"\)/.test(magnifierRuntime) &&
    /--magnifier-lens-x/.test(magnifierRuntime) &&
    /positionNativeMagnifier/.test(magnifierRuntime) &&
    /naturalWidth/.test(magnifierRuntime) &&
    /data-magnified-width/.test(showingCards + cardTypes + anatomy) &&
    /class="showing-card-magnifier battlefield-board-magnifier"/.test(anatomy),
  "Shared magnifier must map cursor position into the native/HQ image and must not use transform: scale(...) as its zoom mechanism",
);
add(
  checks,
  "Gilgamesh marker 2 and 3 text mapping follows swapped positions",
  GILGAMESH_MARKER_TEXT_BY_NUMBER.every((expected, index) => {
    const actual = readGilgameshMarkerTextByNumber(index + 1);
    return actual.label === expected.label && actual.position === expected.position;
  }),
  "Gilgamesh marker numbers must keep their positions while marker 2 shows Name text and marker 3 shows Energy Cost text",
);
add(
  checks,
  "Gilgamesh anatomy hotspots are content-sourced and border-safe",
  GILGAMESH_HOTSPOTS.every(({ label, x, y }) => {
    const position = readGilgameshHotspotSource(label);
    return position.x === x && position.y === y;
  }) &&
    /style=\{`--hotspot-x:\$\{field\.x\};--hotspot-y:\$\{field\.y\};`\}/.test(anatomy) &&
    !/const anatomyHotspotPositions/.test(anatomy) &&
    !/\.battlefield-hotspot-layer--card\s+\.battlefield-hotspot--card:nth-child\(/.test(theme),
  "Gilgamesh card markers must come from landing content and stay in border/text-safe zones without CSS coordinate override patches",
);
add(
  checks,
  "ally card anatomy exposes eight report fields",
  ANATOMY_FIELDS.every((field) => landing.includes(`label: "${field}"`)) && /data-explanation-label/.test(anatomy),
  "Anatomy section must include Power, Cost, Name, Illustration, Lore, Type, Ability, Attribute as numbered explanation items",
);
add(
  checks,
  "roadmap includes user-requested modes",
  ROADMAP.every((term) => landing.includes(term)) && /single-player/.test(landing) && /online duels/.test(landing),
  "Roadmap must include First Edition, Story Mode, Duelist multiplayer, and Future Eras",
);
add(
  checks,
  "roadmap section removes generic outer golden frame",
  !/reliquary-panel/.test(read(FILES.roadmap)) &&
    /class="roadmap-sealed-gate w-full/.test(read(FILES.roadmap)) &&
    !/border\s*:/.test(roadmapSealedGateBody + roadmapSealedGateAccentBody) &&
    /radial-gradient\(circle/.test(roadmapSealedGateAccentBody) &&
    /sealed-roadmap-list > li::before/.test(theme),
  "Roadmap must not use the generic reliquary-panel outer frame, while preserving inner card atmosphere",
);
add(
  checks,
  "newsletter CTA uses trial invitation tone",
  /Answer the Call/.test(newsletter) && /Wishlist/.test(newsletter) && /First Edition/.test(newsletter),
  "Newsletter copy must invite users into the First Edition trial",
);
add(
  checks,
  "final CTA follows content-driven accessible section contract",
  /<section id="follow-first-edition" class="landing-viewport-section landing-viewport-section--continuum" aria-labelledby="final-cta-title">/.test(index) &&
    /id="final-cta-title"/.test(read(FILES.finalCta)) &&
    /newsletterContent\.sectionEyebrow/.test(read(FILES.finalCta)) &&
    /newsletterContent\.pendingProviderText/.test(read("src/components/landing/NewsletterForm.astro")) &&
    /data-newsletter-messages/.test(read("src/components/landing/NewsletterForm.astro")) &&
    !/Final Invocation/.test(read(FILES.finalCta)) &&
    !/Static placeholder flow — provider integration is pending\.|Ready to receive your answer\.|Consent is required to continue\.|Submitting request\.|The Queens have heard your answer/.test(read("src/components/landing/NewsletterForm.astro")),
  "Final CTA must expose the anchor/heading at the viewport section and source visible/status copy from newsletter content",
);
add(
  checks,
  "new visual classes are styled",
  /\.battlefield-showcase\s*\{/.test(theme) && /\.battlefield-card-tilt\s*\{/.test(theme) && /\.battlefield-explanation-panel\s*\{/.test(theme) && /\.card-type-stage\s*\{/.test(theme) && /\.card-type-lore\s*\{/.test(theme),
  "theme.css must style battlefield showcase, explanation panels, and card type carousel classes",
);

const failures = checks.filter((check) => !check.pass);
for (const check of checks) {
  console.log(`${check.pass ? "PASS" : "FAIL"} ${check.name}`);
  if (!check.pass) console.log(`  ${check.message}`);
}

if (failures.length > 0) {
  console.error(`\nlanding-flow contract failed: ${failures.length}/${checks.length} checks failed.`);
  process.exit(1);
}

console.log(`\nlanding-flow contract passed: ${checks.length}/${checks.length} checks passed.`);
