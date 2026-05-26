import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const FILES = {
  index: "src/pages/index.astro",
  landing: "src/content/landing.ts",
  component: "src/components/landing/ShowingCards.astro",
  theme: "src/styles/theme.css",
};

const CARD_IDS = ["nammu", "utu", "an", "ki"];
const APPROVED_SECTION_COPY = {
  eyebrow: "The Four Primordial Queens",
  title: "The Oldest Trial Has Returned to Your Hands",
  intro:
    "Before the world learned to count its days, four Queens played beneath the silence of creation. Their movements became Memory, Judgment, Ascent, and Foundation. Now those fragments descend as cards, not as gifts, but as a final question.If even divinity could not heal what it carried, what will you do when her relic chooses you?",
};
const APPROVED_QUESTIONS = {
  nammu: "What is a soul, if it no longer remembers where it began?",
  utu: "If the sun has witnessed every cruelty, is it just that she must still light our darkness?",
  an: "What is love, if touching what you love would destroy it?",
  ki: "What remains of a goddess, when her silence is mistaken for absence?",
};
const FORBIDDEN_COMPONENT_LORE = [
  "She brought no destruction, only memory",
  "Bearer of radiant verdict and sacred flame",
  "Queen of the upper vault and divine order",
  "Mother of foundations, growth, and endurance",
];

const CONTRAST_COLORS = {
  surfaceObsidian: { lightness: 0.2, chroma: 0.015, hue: 280 },
  surfaceCalm: { lightness: 0.3, chroma: 0.02, hue: 275 },
  surfaceParchment: { lightness: 0.92, chroma: 0.03, hue: 90 },
  metalAgedGoldBright: { lightness: 0.84, chroma: 0.14, hue: 95 },
};

function resolve(relativePath) {
  return path.join(ROOT, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(resolve(relativePath));
}

function readIfExists(relativePath) {
  return exists(relativePath) ? fs.readFileSync(resolve(relativePath), "utf8") : "";
}

function addCheck(checks, name, pass, message) {
  checks.push({ name, pass, message });
}

function orderedBefore(text, first, second) {
  const firstIndex = text.indexOf(first);
  const secondIndex = text.indexOf(second);
  return firstIndex >= 0 && secondIndex >= 0 && firstIndex < secondIndex;
}

function appearsInsideBlock(text, openingPattern, innerPattern, closingPattern) {
  const openingMatch = openingPattern.exec(text);
  if (!openingMatch || openingMatch.index < 0) return false;
  const innerMatch = innerPattern.exec(text.slice(openingMatch.index));
  if (!innerMatch || innerMatch.index < 0) return false;
  const closingMatch = closingPattern.exec(text.slice(openingMatch.index + innerMatch.index));
  return Boolean(closingMatch);
}

function classAttributeFor(text, marker) {
  const markerIndex = text.indexOf(marker);
  if (markerIndex < 0) return "";
  const sectionStart = text.lastIndexOf("<", markerIndex);
  const sectionEnd = text.indexOf(">", markerIndex);
  if (sectionStart < 0 || sectionEnd < 0) return "";
  const tag = text.slice(sectionStart, sectionEnd + 1);
  return /class="([^"]*)"/.exec(tag)?.[1] ?? "";
}

function cssRuleBody(text, selector) {
  const selectorIndex = text.indexOf(selector);
  if (selectorIndex < 0) return "";
  const openingBrace = text.indexOf("{", selectorIndex);
  if (openingBrace < 0) return "";
  let depth = 0;
  for (let index = openingBrace; index < text.length; index += 1) {
    const char = text[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(openingBrace + 1, index);
    }
  }
  return "";
}

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function oklchToSrgb({ lightness, chroma, hue }) {
  const hueRadians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;
  return [
    clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function mixRgb(colorA, colorB, amountA) {
  return colorA.map((channel, index) => channel * amountA + colorB[index] * (1 - amountA));
}

function applyAlpha(foreground, background, alpha) {
  return mixRgb(foreground, background, alpha);
}

function linearize(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb) {
  const [red, green, blue] = rgb.map(linearize);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const foregroundLum = luminance(foreground);
  const backgroundLum = luminance(background);
  const lighter = Math.max(foregroundLum, backgroundLum);
  const darker = Math.min(foregroundLum, backgroundLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function showingLoreContrastPasses() {
  const obsidian = oklchToSrgb(CONTRAST_COLORS.surfaceObsidian);
  const calm = oklchToSrgb(CONTRAST_COLORS.surfaceCalm);
  const parchment = oklchToSrgb(CONTRAST_COLORS.surfaceParchment);
  const goldBright = oklchToSrgb(CONTRAST_COLORS.metalAgedGoldBright);
  const loreBackground = mixRgb(calm, obsidian, 0.88);
  const roleText = applyAlpha(parchment, loreBackground, 0.85);
  const bodyText = applyAlpha(parchment, loreBackground, 0.9);
  return [roleText, bodyText, goldBright].every((textColor) => contrastRatio(textColor, loreBackground) >= 4.5);
}

function buildChecks() {
  const checks = [];
  const index = readIfExists(FILES.index);
  const landing = readIfExists(FILES.landing);
  const component = readIfExists(FILES.component);
  const theme = readIfExists(FILES.theme);

  for (const [label, filePath] of Object.entries(FILES)) {
    addCheck(checks, `${label} file exists`, exists(filePath), `Missing file: ${filePath}`);
  }

  addCheck(
    checks,
    "index imports ShowingCards",
    /import\s+ShowingCards\s+from\s+["']@\/components\/landing\/ShowingCards\.astro["'];/.test(index),
    "src/pages/index.astro must import ShowingCards",
  );
  addCheck(
    checks,
    "index does not import FourDivinePaths",
    !/FourDivinePaths/.test(index),
    "src/pages/index.astro must not reference FourDivinePaths",
  );
  addCheck(
    checks,
    "ShowingCards follows HeroReliquary",
    orderedBefore(index, "<HeroReliquary", "<ShowingCards"),
    "ShowingCards must render immediately after HeroReliquary",
  );
  addCheck(
    checks,
    "ShowingCards uses dedicated full-width section wrapper",
    appearsInsideBlock(index, /<div\s+class="[^"]*showing-cards-section[^"]*landing-continuum-section[^"]*"/, /<ShowingCards\b/, /<\/div>/) &&
      !appearsInsideBlock(index, /<div\s+class="[^"]*reliquary-section-field[^"]*"/, /<ShowingCards\b/, /<TacticalBattlefield\b/),
    "ShowingCards must render in a dedicated .showing-cards-section landing-continuum-section block outside the lower reliquary-section-field stack",
  );
  addCheck(
    checks,
    "ShowingCards uses shared scroll-reveal wrapper",
    appearsInsideBlock(index, /<div\s+class="[^"]*showing-cards-section[^"]*landing-continuum-section[^"]*"/, /<div\s+class="scroll-reveal"[\s\S]*<ShowingCards\b/, /<\/div>\s*<\/div>/),
    "ShowingCards content must be wrapped in .scroll-reveal while the section background stays outside the reveal transform",
  );
  addCheck(
    checks,
    "lower sections remain inside reliquary-section-field",
    /id="primordial-verdict"\s+class="[^"]*landing-viewport-section[^"]*"/.test(index) &&
      /id="card-type-reliquary"\s+class="[^"]*landing-viewport-section[^"]*"/.test(index) &&
      /id="sacred-grid-anatomy"\s+class="[^"]*landing-viewport-section[^"]*"/.test(index),
    "Post-ShowingCards sections must use full-viewport section wrappers",
  );
  addCheck(
    checks,
    "lower sections remain after ShowingCards",
    orderedBefore(index, "<ShowingCards", "<PrimordialVerdict") &&
      orderedBefore(index, "<PrimordialVerdict", "<CardTypeReliquary") &&
      orderedBefore(index, "<CardTypeReliquary", "<SacredGridAnatomy") &&
      orderedBefore(index, "<SacredGridAnatomy", "<RoadmapSealedGate") &&
      orderedBefore(index, "<RoadmapSealedGate", "<FinalCTA"),
    "Lower landing sections must preserve their order after ShowingCards",
  );

  addCheck(
    checks,
    "content exports SHOWING_CARD_ORDER",
    /export\s+const\s+SHOWING_CARD_ORDER\s*=\s*\[\s*"nammu",\s*"utu",\s*"an",\s*"ki"\s*\]\s+as\s+const/.test(landing),
    "landing.ts must define Nammu → Utu → An → Ki order",
  );
  addCheck(
    checks,
    "content exposes showingCards",
    /showingCards\s*:/.test(landing) && /ShowingCardsContent/.test(landing),
    "landing.ts must include showingCards in the typed content model",
  );
  addCheck(
    checks,
    "content uses approved primordial section copy",
    landing.includes(`sectionEyebrow: "${APPROVED_SECTION_COPY.eyebrow}"`) &&
      landing.includes(`sectionTitle: "${APPROVED_SECTION_COPY.title}"`) &&
      landing.includes(APPROVED_SECTION_COPY.intro),
    "landing.ts must use the approved eyebrow, title, and exact user-approved intro copy",
  );
  addCheck(
    checks,
    "approved primordial intro preserves punctuation",
    APPROVED_SECTION_COPY.intro.includes("question.If") && landing.includes(APPROVED_SECTION_COPY.intro),
    "The ShowingCards intro must preserve the exact no-space question.If punctuation",
  );
  addCheck(
    checks,
    "content model includes per-Queen question field",
    /interface\s+ShowingCardContent[\s\S]*question:\s*string;/.test(landing),
    "ShowingCardContent must include question: string",
  );
  addCheck(
    checks,
    "sections use showing-cards id",
    /id:\s*"showing-cards"/.test(landing) && !/id:\s*"four-divine-paths"/.test(landing),
    "landing.ts sections must replace four-divine-paths with showing-cards",
  );
  addCheck(
    checks,
    "Nammu is the first configured card",
    /cards:\s*SHOWING_CARD_ORDER\.map/.test(landing) || /cards:\s*\[\s*\{[\s\S]*?id:\s*"nammu"/.test(landing),
    "showingCards.cards must initialize with Nammu",
  );

  for (const cardId of CARD_IDS) {
    addCheck(
      checks,
      `${cardId} WebP asset exists`,
      exists(`public/assets/cards/${cardId}/card.webp`),
      `Missing public/assets/cards/${cardId}/card.webp`,
    );
    addCheck(
      checks,
      `${cardId} asset referenced from content`,
      landing.includes(`activeCardVariant("${cardId}")`) &&
        landing.includes(`trailingCardVariant("${cardId}")`) &&
        landing.includes(`cardSrcSet("${cardId}")`) &&
        landing.includes(`magnifiedCardVariant("${cardId}")`) &&
        landing.includes(`cardMagnifierSrcSet("${cardId}")`),
      `landing.ts must reference optimized ${cardId} card variants`,
    );
    for (const width of [300, 400, 600, 800, 1200, 1600]) {
      const variantPath = `public/assets/cards/${cardId}/variants/card-${width}w.webp`;
      const variantExists = exists(variantPath);
      addCheck(checks, `${cardId} ${width}w optimized variant exists`, variantExists, `Missing ${variantPath}`);
      if (variantExists && width === 800) {
        const size = fs.statSync(resolve(variantPath)).size;
        addCheck(
          checks,
          `${cardId} 800w variant stays below 260 KB`,
          size < 260 * 1024,
          `${variantPath} is ${(size / 1024).toFixed(1)} KB; expected under 260 KB`,
        );
      }
      if (variantExists && width === 1600) {
        const size = fs.statSync(resolve(variantPath)).size;
        addCheck(
          checks,
          `${cardId} 1600w magnifier variant stays below 820 KB`,
          size < 820 * 1024,
          `${variantPath} is ${(size / 1024).toFixed(1)} KB; expected under 820 KB`,
        );
      }
    }
    addCheck(
      checks,
      `${cardId} approved question is exported`,
      landing.includes(`question: "${APPROVED_QUESTIONS[cardId]}"`),
      `landing.ts must export the approved ${cardId} lore question`,
    );
  }

  addCheck(
    checks,
    "component imports content model types only",
    /import\s+type\s+\{[\s\S]*ShowingCardsContent/.test(component),
    "ShowingCards.astro must type props from landing content",
  );
  addCheck(
    checks,
    "component has carousel region semantics",
    /aria-roledescription="carousel"/.test(component) && /role="region"/.test(component),
    "ShowingCards.astro must expose carousel region semantics",
  );
  addCheck(
    checks,
    "component has accessible controls and live region",
    /<button[\s\S]*aria-label/.test(component) && /aria-live="polite"/.test(component),
    "ShowingCards.astro must use semantic buttons and a polite live region",
  );
  addCheck(
    checks,
    "component uses AA-safe lore text opacity classes",
    /<p\s+class="[^"]*text-surface-parchment\/85[^"]*"\s+data-showing-cards-role>/.test(component) &&
      /<p\s+class="[^"]*text-surface-parchment\/90[^"]*"\s+data-showing-cards-tablet>/.test(component),
    "ShowingCards lore metadata/tablet text must avoid low-opacity text that can fail WCAG contrast",
  );
  addCheck(
    checks,
    "component image uses required loading attributes",
    /width=\{activeCard\.image\.width\}/.test(component) &&
      /height=\{activeCard\.image\.height\}/.test(component) &&
      /srcset=\{activeCard\.image\.srcSet\}/.test(component) &&
      /sizes=\{activeCard\.image\.sizes\}/.test(component) &&
      /decoding="async"/.test(component) &&
      /loading="eager"/.test(component) &&
      /fetchpriority="high"/.test(component),
    "ShowingCards.astro must render active image metadata from content with eager/high-priority async loading",
  );
  addCheck(
    checks,
    "component renders high-resolution inert magnifier overlay",
    /data-showing-card-magnifier/.test(component) &&
      /src=\{activeCard\.image\.magnifiedSrc\}/.test(component) &&
      /srcset=\{activeCard\.image\.magnifiedSrcSet\}/.test(component) &&
      /aria-hidden="true"/.test(component),
    "ShowingCards.astro must render an aria-hidden high-resolution magnifier overlay",
  );
  addCheck(
    checks,
    "ShowingCards root is unboxed",
    !classAttributeFor(component, "data-showing-cards-root").includes("reliquary-panel"),
    "data-showing-cards-root must not carry reliquary-panel boxed chrome",
  );
  addCheck(
    checks,
    "intro spans symmetrically before two-column card grid",
    /<div\s+class="[^"]*w-full[^"]*max-w-none[^"]*"\s+data-showing-cards-intro>/.test(component) &&
      /<p\s+class="[^"]*max-w-none[^"]*"/.test(component) &&
      orderedBefore(component, "data-showing-cards-intro", "lg:grid-cols-[minmax(17rem,0.68fr)_minmax(0,0.9fr)]") &&
      orderedBefore(component, "ornate-separator", "data-showing-cards-stage"),
    "ShowingCards intro must render before the grid and span the same content width as the card/lore block",
  );
  addCheck(
    checks,
    "component uses vertically centered two-column card and lore grid",
    /lg:grid-cols-\[minmax\(17rem,0\.68fr\)_minmax\(0,0\.9fr\)\]/.test(component) && /lg:items-center/.test(component),
    "ShowingCards grid must use the viewport-fit card/lore columns with vertical centering",
  );
  addCheck(
    checks,
    "component renders active double image buffers",
    /data-card-buffer="a"/.test(component) && /data-card-buffer="b"/.test(component) &&
      (component.match(/class="[^"]*showing-card-buffer/g) ?? []).length >= 2,
    "The active tilt frame must contain two .showing-card-buffer img layers with data-card-buffer=\"a\" and \"b\"",
  );
  addCheck(
    checks,
    "controller uses decode preload pipeline",
    /new\s+Image\s*\(\s*\)/.test(component) &&
      /\.decode\s*\(\s*\)/.test(component) &&
      /preloadImage/.test(component) &&
      /preload\.srcset\s*=\s*card\.image\.srcSet/.test(component),
    "Card swaps must preload with new Image() and await img.decode() before flipping buffers",
  );
  addCheck(
    checks,
    "controller swaps image and lore atomically after decode",
    /await preloadImage\(card\);[\s\S]*lore\.dataset\.transitioning = "true";[\s\S]*updateLoreContent\(card\);[\s\S]*await wait\(60\);[\s\S]*flipBuffer\(card\);/.test(component),
    "Card and lore changes must both happen after decode so text never advances before the image is ready",
  );
  addCheck(
    checks,
    "controller preloads adjacent cards on initialization",
    /preloadAdjacent\(activeIndex\);/.test(component) && orderedBefore(component, "preloadAdjacent(activeIndex);", "previous.addEventListener"),
    "Adjacent card images must be warmed before the first interaction",
  );
  addCheck(
    checks,
    "controller has no delayed text desert",
    !/setTimeout\s*\(\s*\(\)\s*=>\s*\{\s*updateCardContent/.test(component),
    "Lore/live text must update synchronously, not inside setTimeout before fade-in",
  );
  addCheck(
    checks,
    "arrow controls live in lore navigation area",
    !appearsInsideBlock(component, /<div\s+class="[^"]*showing-card-stage[^"]*"[^>]*data-showing-cards-stage/, /data-showing-cards-previous|data-showing-cards-next/, /<\/div>\s*<aside/) &&
      appearsInsideBlock(component, /<aside[\s\S]*data-showing-cards-lore/, /<nav\s+class="showing-card-navigation"[\s\S]*data-showing-cards-previous[\s\S]*data-showing-cards-next/, /<\/aside>/) &&
      /showing-card-control--lore/.test(component) &&
      !/showing-card-control--side/.test(component),
    "Previous/next buttons must live in the lore navigation area, not over the card art",
  );
  addCheck(
    checks,
    "lore text order matches approved reading flow",
    orderedBefore(component, "data-showing-cards-element", "data-showing-cards-name") &&
      orderedBefore(component, "data-showing-cards-name", "data-showing-cards-role") &&
      orderedBefore(component, "data-showing-cards-role", "data-showing-cards-question") &&
      orderedBefore(component, "data-showing-cards-question", "data-showing-cards-short") &&
      orderedBefore(component, "data-showing-cards-short", "data-showing-cards-tablet"),
    "Lore must read element label → name → role/symbol → gold question → short lore → tablet lore",
  );
  addCheck(
    checks,
    "component renders two trailing card image slots",
    /data-card-slot="trailing-1"/.test(component) && /data-card-slot="trailing-2"/.test(component),
    "ShowingCards.astro must render trailing-1 and trailing-2 glass card images",
  );
  addCheck(
    checks,
    "component exposes lore transition state attributes",
    /data-transitioning="false"/.test(component) && /data-motion-ready="false"/.test(component),
    "Lore panel must expose data-transitioning and data-motion-ready initial states",
  );
  addCheck(
    checks,
    "component has no hardcoded lore strings",
    FORBIDDEN_COMPONENT_LORE.every((phrase) => !component.includes(phrase)),
    "ShowingCards.astro must derive story/lore text from landingContent.showingCards",
  );
  addCheck(
    checks,
    "component derives live prefix from content",
    /data-live-prefix=\{content\.livePrefix\}/.test(component) &&
      /const\s+livePrefix\s*=/.test(component) &&
      /live\.textContent\s*=\s*`\$\{livePrefix\}\s+\$\{card\.name\}`\.trim\(\);/.test(component) &&
      !component.includes("Now showing"),
    "ShowingCards.astro controller must derive live-region prefix from content.livePrefix",
  );
  addCheck(
    checks,
    "component implements wraparound controls",
    /\(activeIndex\s*[-+]\s*1\s*\+\s*cards\.length\)\s*%\s*cards\.length/.test(component),
    "ShowingCards.astro controller must wrap previous/next navigation",
  );
  addCheck(
    checks,
    "component gates keyboard and tilt behavior",
    /ArrowLeft/.test(component) && /ArrowRight/.test(component) &&
      /prefers-reduced-motion:\s*no-preference/.test(component) && /hover:\s*hover/.test(component) && /pointer:\s*fine/.test(component),
    "ShowingCards.astro must support arrow keys and gate tilt by motion/pointer media queries",
  );
  addCheck(
    checks,
    "controller uses stable magnifier hit zone to prevent edge flicker",
    /resolveStableMagnifierState/.test(component) &&
      /pointerX\s*>=\s*9/.test(component) &&
      /pointerX\s*>=\s*5/.test(component) &&
      /setMagnifierState\(false\)/.test(component),
    "Magnifier must use hysteresis and a stable inner zone so hover boundaries do not flicker",
  );

  addCheck(
    checks,
    "theme has showing card stage and tilt classes",
    /\.showing-card-stage\s*\{/.test(theme) && /\.showing-card-tilt\s*\{/.test(theme),
    "theme.css must define stage and tilt classes",
  );
  addCheck(
    checks,
    "theme defines unboxed alternating showing-cards section",
    /\.showing-cards-section\s*\{[\s\S]*min-height:\s*100svh[\s\S]*background:\s*transparent/.test(theme) &&
      /\.showing-cards-section::before\s*\{[\s\S]*content:\s*none/.test(theme) &&
      !/\.showing-cards-reliquary\s*\{/.test(theme),
    "theme.css must keep .showing-cards-section full-viewport but transparent so it shares the landing-continuum background",
  );
  const loreRule = cssRuleBody(theme, ".showing-card-lore {");
  addCheck(
    checks,
    "lore panel has no boxed chrome",
    loreRule.length > 0 && !/(^|\n)\s*(border|border-radius|box-shadow|backdrop-filter)\s*:/.test(loreRule),
    ".showing-card-lore must not define border, border-radius, box-shadow, or backdrop-filter chrome",
  );
  addCheck(
    checks,
    "theme keeps arrow controls out of card art",
    /\.showing-card-navigation\s*\{[\s\S]*display:\s*flex[\s\S]*margin-top:\s*1\.5rem/.test(theme) &&
      /\.showing-card-control\s*\{[\s\S]*min-width:\s*2\.75rem[\s\S]*min-height:\s*2\.75rem/.test(theme) &&
      /\.showing-card-control--lore\s*\{/.test(theme) &&
      !/\.showing-card-control--side\s*\{/.test(theme),
    "Arrow controls must be styled in lore navigation with WCAG-sized hit targets, not as absolute side controls",
  );
  addCheck(
    checks,
    "theme defines active buffer crossfade",
    /\.showing-card-buffer\s*\{[\s\S]*position:\s*absolute[\s\S]*transition:\s*opacity\s+220ms\s+ease-in-out/.test(theme) &&
      /\.showing-card-buffer\[data-buffer-active="true"\][\s\S]*opacity:\s*1/.test(theme),
    "Active card buffers must crossfade by opacity without layout shift",
  );
  addCheck(
    checks,
    "theme scales active card to viewport-fit desktop size",
    /\.showing-card-stage[\s\S]*min-height:\s*min\(58svh,\s*34rem\)/.test(theme) &&
      /\.showing-card-tilt[\s\S]*width:\s*clamp\(16rem,\s*min\(28vw,\s*50svh\),\s*24rem\)/.test(theme) &&
      /@media\s*\(min-width:\s*1024px\)[\s\S]*\.showing-card-tilt[\s\S]*min-width:\s*min\(22rem,\s*48svh\)/.test(theme),
    "theme.css must use responsive svh/vw card sizing so the section fits different viewport heights",
  );
  addCheck(
    checks,
    "theme defines stacked glass trailing cards",
    /\.showing-card-trailing\s*\{[\s\S]*opacity:\s*0\.35[\s\S]*translateZ\(-60px\)\s*scale\(0\.85\)[\s\S]*filter:\s*blur\(0\.15rem\)[\s\S]*pointer-events:\s*none/.test(theme),
    "theme.css must define .showing-card-trailing with the approved glass depth contract",
  );
  addCheck(
    checks,
    "theme defines lore fade and reduced-motion instant swap",
    /\[data-motion-ready="true"\][\s\S]*transition-delay:\s*var\(--lore-delay/.test(theme) &&
      /\[data-motion-ready="true"\]\[data-transitioning="true"\][\s\S]*filter:\s*blur\(0\.22rem\)/.test(theme) &&
      /setLoreStagger/.test(component) &&
      /itemIndex\s*\*\s*40/.test(component) &&
      /prefers-reduced-motion:\s*reduce[\s\S]*\[data-transitioning="true"\]/.test(theme),
    "theme.css must define coordinated lore morph transitions and reduced-motion instant override",
  );
  addCheck(
    checks,
    "lore panel text contrast meets WCAG AA",
    showingLoreContrastPasses(),
    "Computed lore-panel text/background contrast must be at least 4.5:1 for body-sized text",
  );
  addCheck(
    checks,
    "theme defines reduced-motion override",
    /prefers-reduced-motion:\s*reduce[\s\S]*\.showing-card-tilt/.test(theme) &&
      /prefers-reduced-motion:\s*reduce[\s\S]*\.showing-card-buffer/.test(theme),
    "theme.css must include reduced-motion handling for showing-card tilt",
  );
  addCheck(
    checks,
    "theme adds pointer-safe magnifier and disables it for reduced motion",
    /\.showing-card-magnifier\s*\{[\s\S]*pointer-events:\s*none[\s\S]*clip-path:\s*circle\(0%/.test(theme) &&
      /\.showing-card-tilt\[data-magnifying="true"\]\s+\.showing-card-magnifier[\s\S]*clip-path:\s*circle\(24%/.test(theme) &&
      /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*and\s*\(prefers-reduced-motion:\s*no-preference\)/.test(theme) &&
      /prefers-reduced-motion:\s*reduce[\s\S]*\.showing-card-magnifier[\s\S]*display:\s*none/.test(theme) &&
      !/\.showing-card-tilt:hover\s+\.showing-card-buffer\[data-buffer-active="true"\][\s\S]*transform:\s*scale\(1\.16\)/.test(theme),
    "Hover magnifier must be a pointer-events-none high-res overlay gated by media queries, not a boundary-changing image scale",
  );

  return checks;
}

const checks = buildChecks();
const failures = checks.filter((check) => !check.pass);

for (const check of checks) {
  const status = check.pass ? "PASS" : "FAIL";
  console.log(`${status} ${check.name}`);
  if (!check.pass) console.log(`  ${check.message}`);
}

if (failures.length > 0) {
  console.error(`\nshowing-cards contract failed: ${failures.length}/${checks.length} checks failed.`);
  process.exit(1);
}

console.log(`\nshowing-cards contract passed: ${checks.length}/${checks.length} checks passed.`);
