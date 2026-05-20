export const ELEMENT = {
  FIRE: "fire",
  WATER: "water",
  AIR: "air",
  EARTH: "earth",
} as const;

export type Element = (typeof ELEMENT)[keyof typeof ELEMENT];

export type CardFrameGlyph = "infinity" | "waterDrop" | "queen" | "crown";

export interface CardFrameConfig {
  cost: string;
  rank: string;
  loreTitle: string;
  attributeLabel: string;
  topLeftGlyphs: readonly CardFrameGlyph[];
  bottomLeftGlyphs: readonly CardFrameGlyph[];
  bottomRightGlyph: CardFrameGlyph;
  illustrationObjectPosition: string;
  /** Final full-card render for urgent/full-asset replacement flow */
  fullCard?: string;
  /** Nammu layered card — uses exact user-provided PNG layer assets */
  layered?: {
    frame: string;
    illustration: string;
    symbolInfinity: string;
    symbolCost: string;
    symbolQueen: string;
    symbolWater: string;
    loreText: string;
  };
}

export const CARD_FRAME_CONFIG = {
  fire: {
    cost: "7",
    rank: "Q",
    loreTitle: "Lore",
    attributeLabel: "Fire",
    topLeftGlyphs: ["infinity", "waterDrop"],
    bottomLeftGlyphs: ["queen", "crown", "waterDrop"],
    bottomRightGlyph: "waterDrop",
    illustrationObjectPosition: "center 18%",
    fullCard: "/assets/cards/utu/card.webp",
  },
  water: {
    cost: "7",
    rank: "Q",
    loreTitle: "Lore",
    attributeLabel: "Water",
    topLeftGlyphs: ["infinity", "waterDrop"],
    bottomLeftGlyphs: ["queen", "crown", "waterDrop"],
    bottomRightGlyph: "waterDrop",
    illustrationObjectPosition: "center 18%",
    fullCard: "/assets/cards/nammu/card.webp",
    layered: {
      frame: "/assets/cards/nammu/frame.png",
      illustration: "/assets/cards/nammu/illustration.png",
      symbolInfinity: "/assets/cards/nammu/symbol-infinity.png",
      symbolCost: "/assets/cards/nammu/symbol-cost-7.png",
      symbolQueen: "/assets/cards/nammu/symbol-queen.png",
      symbolWater: "/assets/cards/nammu/symbol-water.png",
      loreText:
        "She brought no destruction, only memory: the echo of the first breath when the world still slept beneath the waters. In her presence, every soul remembered its forgotten cradle.",
    },
  },
  air: {
    cost: "7",
    rank: "Q",
    loreTitle: "Lore",
    attributeLabel: "Air",
    topLeftGlyphs: ["infinity", "waterDrop"],
    bottomLeftGlyphs: ["queen", "crown", "waterDrop"],
    bottomRightGlyph: "waterDrop",
    illustrationObjectPosition: "center 18%",
    fullCard: "/assets/cards/an/card.webp",
  },
  earth: {
    cost: "7",
    rank: "Q",
    loreTitle: "Lore",
    attributeLabel: "Earth",
    topLeftGlyphs: ["infinity", "waterDrop"],
    bottomLeftGlyphs: ["queen", "crown", "waterDrop"],
    bottomRightGlyph: "waterDrop",
    illustrationObjectPosition: "center 18%",
    fullCard: "/assets/cards/ki/card.webp",
  },
} as const satisfies Record<Element, CardFrameConfig>;

// ─── Image Optimization Contract ─────────────────────────────────────────────
// Guides future replacement of placeholder <img> tags with Astro <Image />.
// Until approved assets exist on disk, keep standard <img> with these props.
//
// APPROVAL GATE: When assets are marked "Approved" in docs/landing-asset-checklist.md,
// swap <img> for <Image /> from "astro:assets" and remove the placeholder label.
// ───────────────────────────────────────────────────────────────────────────────

export interface ImageOptimizationConfig {
  /** Path relative to /public or importable from src/assets. */
  src: string;
  /** Intrinsic width (px) for layout stability — set to 0 if unknown. */
  width: number;
  /** Intrinsic height (px) for layout stability — set to 0 if unknown. */
  height: number;
  /** `loading="eager"` for above-fold critical images; `"lazy"` for everything else. */
  loading: "eager" | "lazy";
  /** `fetchpriority="high"` only for the largest hero/render in the initial viewport. */
  fetchpriority: "high" | "auto";
  /** `decoding="async"` for below-fold; `"sync"` only for synchronous paint-critical images. */
  decoding: "sync" | "async";
  /** Alt text already provided by the content model — this is for fallback documentation. */
  altFallback: string;
  /** If true, the image is a placeholder and should show a text label until replaced. */
  isPlaceholder: boolean;
  /** Fallback format when AVIF/WebP are unavailable (PNG only). */
  fallbackFormat: "png" | null;
}

/** Maps content sections to their image optimization presets. */
export const IMAGE_OPTIMIZATION: Record<string, ImageOptimizationConfig> = {
  "hero-poster": {
    src: "/assets/landing/hero/reliquary-poster-placeholder.webp",
    width: 1200,
    height: 675,
    loading: "eager",
    fetchpriority: "high",
    decoding: "sync",
    altFallback: "Ceremonial reliquary backdrop with cuneiform silhouettes",
    isPlaceholder: true,
    fallbackFormat: "png",
  },
  "hero-og": {
    src: "/assets/landing/hero/og-default-placeholder.webp",
    width: 1200,
    height: 630,
    loading: "eager",
    fetchpriority: "auto",
    decoding: "sync",
    altFallback: "Elemental Queens — Sumerian Edition key art",
    isPlaceholder: true,
    fallbackFormat: "png",
  },
  // APPROVAL GATE: When final goddess illustrations are generated via ChatGPT Image 2
  // and placed at public/assets/landing/goddesses/{element}.png:
  //   - Set isPlaceholder to false
  //   - Update src to "/assets/landing/goddesses/{element}.png"
  //   - Delete {element}.svg placeholder files
  //   - Run `npm run build` to verify Astro image optimization
  "goddess-utu": {
    src: "/assets/cards/utu/card.webp",
    width: 2160,
    height: 3840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Utu — Solar Judgment card render",
    isPlaceholder: false,
    fallbackFormat: null,
  },
  "goddess-nammu": {
    src: "/assets/cards/nammu/card.webp",
    width: 2160,
    height: 3840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Nammu — Abyssal Memory card render",
    isPlaceholder: false,
    fallbackFormat: null,
  },
  "goddess-an": {
    src: "/assets/cards/an/card.webp",
    width: 2160,
    height: 3840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "An — Celestial Dominion card render",
    isPlaceholder: false,
    fallbackFormat: null,
  },
  "goddess-ki": {
    src: "/assets/cards/ki/card.webp",
    width: 2160,
    height: 3840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Ki — Verdant Foundation card render",
    isPlaceholder: false,
    fallbackFormat: null,
  },
  "card-anatomy": {
    src: "/src/assets/landing/goddesses/first-edition-card-placeholder.webp",
    width: 800,
    height: 1120,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "First Edition card anatomy diagram placeholder",
    isPlaceholder: true,
    fallbackFormat: "png",
  },
} as const;

export const SHOWING_CARD_ORDER = ["nammu", "utu", "an", "ki"] as const;

export type ShowingCardId = (typeof SHOWING_CARD_ORDER)[number];

export const SHOWING_CARD_NAME = {
  nammu: "Nammu",
  utu: "Utu",
  an: "An",
  ki: "Ki",
} as const satisfies Record<ShowingCardId, string>;

export type ShowingCardName = (typeof SHOWING_CARD_NAME)[ShowingCardId];

export const SHOWING_CARD_ELEMENT = {
  nammu: ELEMENT.WATER,
  utu: ELEMENT.FIRE,
  an: ELEMENT.AIR,
  ki: ELEMENT.EARTH,
} as const satisfies Record<ShowingCardId, Element>;

export interface ShowingCardImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  optimizationKey: string;
}

export interface ShowingCardContent {
  id: ShowingCardId;
  name: ShowingCardName;
  element: Element;
  elementLabel: string;
  role: string;
  symbol: string;
  shortLore: string;
  tabletLore: string;
  question: string;
  image: ShowingCardImage;
}

export interface ShowingCardsContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  livePrefix: string;
  cards: readonly ShowingCardContent[];
}

export const SHOWING_CARDS_BY_ID = {
  nammu: {
    id: "nammu",
    name: SHOWING_CARD_NAME.nammu,
    element: SHOWING_CARD_ELEMENT.nammu,
    elementLabel: "Water",
    role: "Abyssal Memory",
    symbol: "Tide Seal",
    shortLore: "The first water remembers every cradle, every wound, and every survivor the world tried to erase.",
    tabletLore:
      "She brought no destruction, only memory: the echo of the first breath when the world still slept beneath the waters. Before temple, name, or clay learned to say “I,” Nammu was the abyssal matrix from which sky and earth were born. She pleaded for humanity because she remembered every scar that survived cruelty, every hand that reached for water, and every descendant of Ziusudra who rose after the flood to write laws, bury the beloved, and prove that falling is not the same as failure.",
    question: "What is a soul, if it no longer remembers where it began?",
    image: {
      src: "/assets/cards/nammu/card.webp",
      width: 2160,
      height: 3840,
      alt: "Nammu — Abyssal Memory full-card render",
      optimizationKey: "goddess-nammu",
    },
  },
  utu: {
    id: "utu",
    name: SHOWING_CARD_NAME.utu,
    element: SHOWING_CARD_ELEMENT.utu,
    elementLabel: "Fire",
    role: "Solar Judgment",
    symbol: "Sun Seal",
    shortLore: "The sun has seen every cruelty and still burns, begging someone to prove the wound is not all that remains.",
    tabletLore:
      "Utu is the first spark born between height and ground: light, heat, and the unbearable knowledge that the cosmos can be judged. For five thousand years she watched wars, empires, graves, children hiding from violence, and cities turning ash beneath the same dawn she was condemned to give. She voted guilty because justice without intervention became torture, then offered the Game because even the sun needed a player to show her the scar beneath the wound.",
    question: "If the sun has witnessed every cruelty, is it just that she must still light our darkness?",
    image: {
      src: "/assets/cards/utu/card.webp",
      width: 2160,
      height: 3840,
      alt: "Utu — Solar Judgment full-card render",
      optimizationKey: "goddess-utu",
    },
  },
  an: {
    id: "an",
    name: SHOWING_CARD_NAME.an,
    element: SHOWING_CARD_ELEMENT.an,
    elementLabel: "Air",
    role: "Celestial Dominion",
    symbol: "Sky Seal",
    shortLore: "The sky gave aspiration, then learned that every descent could wound the ones she wanted to protect.",
    tabletLore:
      "An stretched the vault and gave humanity aspiration: the hunger to name stars, build towers, and reach beyond the mud. Yet every time she descended, her gifts twisted into borders, arrogance, broken tongues, and worship of distance over accountability. She is not cold because she does not love; she is distant because she fears her touch will destroy what she loves, and the Game asks whether height can become care without becoming conquest.",
    question: "What is love, if touching what you love would destroy it?",
    image: {
      src: "/assets/cards/an/card.webp",
      width: 2160,
      height: 3840,
      alt: "An — Celestial Dominion full-card render",
      optimizationKey: "goddess-an",
    },
  },
  ki: {
    id: "ki",
    name: SHOWING_CARD_NAME.ki,
    element: SHOWING_CARD_ELEMENT.ki,
    elementLabel: "Earth",
    role: "Verdant Foundation",
    symbol: "Stone Seal",
    shortLore: "The earth carries every footstep, burial, harvest, and name, terrified that service may be mistaken for absence.",
    tabletLore:
      "Ki gave humanity ground, womb, grave, field, mountain, and every name that cultures placed upon the patient earth. She fragmented herself into service until she feared becoming useful but unseen: a silent stage for a world with no one left to stand upon it. She and Nammu hid Ziusudra’s descendants after the flood, not from weakness but because a goddess who admits her terror can still choose protection over pride.",
    question: "What remains of a goddess, when her silence is mistaken for absence?",
    image: {
      src: "/assets/cards/ki/card.webp",
      width: 2160,
      height: 3840,
      alt: "Ki — Verdant Foundation full-card render",
      optimizationKey: "goddess-ki",
    },
  },
} as const satisfies Record<ShowingCardId, ShowingCardContent>;

export interface HeroContent {
  title: string;
  subtitle: string;
  supportingText: string;
  badgeLabel: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  cinematic: HeroCinematicContent;
  /** Optimization preset key from IMAGE_OPTIMIZATION. */
  optimizationKey: string;
}

export interface HeroCinematicContent {
  posterSrc: string;
  posterAlt: string;
  videoSrc: string | null;
  videoType: "video/mp4" | "video/webm" | null;
  allowLoop: boolean;
}

export interface TacticalBattlefieldContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  proofPoints: string[];
}

export interface EnergyAscensionStepContent {
  tier: string;
  title: string;
  detail: string;
}

export interface EnergyAscensionContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  steps: EnergyAscensionStepContent[];
}

export interface CardAnatomyFieldContent {
  label: string;
  detail: string;
}

export interface CardAnatomyContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  fields: CardAnatomyFieldContent[];
  placeholderAsset: string;
}

export interface LoreFragmentContent {
  title: string;
  excerpt: string;
}

export interface LoreFragmentsContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  fragments: LoreFragmentContent[];
}

export interface RoadmapTeaserContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  teaserLine: string;
}

export interface LandingSectionOrder {
  id:
    | "hero"
    | "showing-cards"
    | "tactical-battlefield"
    | "energy-ascension"
    | "card-anatomy"
    | "lore-fragments"
    | "future-eras-teaser"
    | "final-cta";
  title: string;
}

export interface LandingContent {
  locale: "en";
  edition: "Sumerian Edition";
  gameName: "Elemental Queens";
  hero: HeroContent;
  showingCards: ShowingCardsContent;
  tacticalBattlefield: TacticalBattlefieldContent;
  energyAscension: EnergyAscensionContent;
  cardAnatomy: CardAnatomyContent;
  loreFragments: LoreFragmentsContent;
  roadmapTeaser: RoadmapTeaserContent;
  sections: LandingSectionOrder[];
}

export const landingContent: LandingContent = {
  locale: "en",
  edition: "Sumerian Edition",
  gameName: "Elemental Queens",
  hero: {
    title: "Elemental Queens — Sumerian Edition",
    subtitle: "A divine tactical TCG videogame forged in the first age.",
    supportingText:
      "Enter a reliquary of goddess relics, sacred symbols, and strategic devotion where every summon reshapes the battlefield.",
    badgeLabel: "Divine Sumerian Reliquary",
    primaryCtaLabel: "Follow the First Edition",
    primaryCtaHref: "#follow-first-edition",
    optimizationKey: "hero-poster",
    cinematic: {
      posterSrc: "/assets/landing/hero/reliquary-poster-placeholder.webp",
      posterAlt: "Ceremonial reliquary backdrop with cuneiform silhouettes",
      videoSrc: null,
      videoType: null,
      allowLoop: false,
    },
  },
  showingCards: {
    sectionEyebrow: "The Four Primordial Queens",
    sectionTitle: "The Oldest Trial Has Returned to Your Hands",
    sectionDescription:
      "Before the world learned to count its days, four Queens played beneath the silence of creation. Their movements became Memory, Judgment, Ascent, and Foundation. The Nexus kept that first trial alive where Water, Fire, Air, and Earth could touch without destroying one another. Now those fragments descend as cards, not as gifts, but as a final question. No prophecy names the hand that must answer. No fifth trial waits beyond this one. If even divinity could not heal what it carried, what will you do when her relic chooses you?",
    ariaLabel: "Showing Cards elemental carousel",
    previousLabel: "Show previous goddess card",
    nextLabel: "Show next goddess card",
    livePrefix: "Now showing",
    cards: SHOWING_CARD_ORDER.map((cardId) => SHOWING_CARDS_BY_ID[cardId]),
  },
  tacticalBattlefield: {
    sectionEyebrow: "Tactical Proof",
    sectionTitle: "Command the Sacred Grid",
    sectionDescription:
      "This is a strategic videogame TCG played on a contested board where positioning, timing, and sacrifice decisions shape each turn.",
    proofPoints: [
      "Chess-inspired lanes make placement and spacing meaningful.",
      "Blessed allies and sacrifice windows create deliberate momentum swings.",
      "High-level mechanics are shown here without overloading full rules text.",
    ],
  },
  energyAscension: {
    sectionEyebrow: "Ritual Progression",
    sectionTitle: "Ascend from Energy to Manifestation",
    sectionDescription:
      "Power escalates through ceremonial tiers until divine summoning becomes possible at the peak of devotion.",
    steps: [
      {
        tier: "3–5 Energy",
        title: "Prepare the Shrine",
        detail:
          "Establish elemental rhythm, shape lanes, and unlock foundational actions.",
      },
      {
        tier: "6 Energy",
        title: "Awaken Queen Gifts",
        detail:
          "Mono-element focus grants each goddess a unique strategic advantage.",
      },
      {
        tier: "7 Energy",
        title: "Manifest the Goddess",
        detail:
          "Summon a divine presence through Blessed allies and sacred sacrifice.",
      },
    ],
  },
  cardAnatomy: {
    sectionEyebrow: "First Edition Relic",
    sectionTitle: "Every Card Is a Tactical Reliquary",
    sectionDescription:
      "Each first-edition card combines identity, cost, and consequence in one artifact so collectors and competitors read intent at a glance.",
    fields: [
      {
        label: "Seal Medallion",
        detail: "Top-left origin seal combines infinity and elemental drops for divine allegiance.",
      },
      {
        label: "Cost Medallion",
        detail: "Top-right value marks the ritual threshold required to deploy influence on the board.",
      },
      {
        label: "Rank Medallion",
        detail: "Bottom-left rank pairs the queen mark with crown and drop iconography.",
      },
      {
        label: "Attribute Medallion",
        detail: "Bottom-right elemental drop reinforces the card attribute without relying on color alone.",
      },
    ],
    placeholderAsset: "/assets/cards/utu/card.webp",
  },
  loreFragments: {
    sectionEyebrow: "Recovered Tablets",
    sectionTitle: "Fragments from the First Age",
    sectionDescription:
      "Lore appears as brief recovered lines to deepen atmosphere while keeping mechanics readable and focused.",
    fragments: [
      {
        title: "Tablet of Utu",
        excerpt: "When the seventh ember rose, judgment fell across every open lane.",
      },
      {
        title: "Tablet of Nammu",
        excerpt: "From the deep archive, memory became tide and tide became command.",
      },
      {
        title: "Tablet of An",
        excerpt: "Sky law named the order of movement before steel met the grid.",
      },
    ],
  },
  roadmapTeaser: {
    sectionEyebrow: "Sealed Beyond the Gate",
    sectionTitle: "Future Eras Await",
    sectionDescription:
      "After the Sumerian Edition is established, additional cultural eras may be unveiled with the same reverence and tactical depth.",
    teaserLine: "For now, all devotion remains with the first reliquary.",
  },
  sections: [
    { id: "hero", title: "Hero Reliquary" },
    { id: "showing-cards", title: "Showing Cards" },
    { id: "tactical-battlefield", title: "Tactical Battlefield" },
    { id: "energy-ascension", title: "Energy Ascension" },
    { id: "card-anatomy", title: "First Edition Card Anatomy" },
    { id: "lore-fragments", title: "Lore Fragments" },
    { id: "future-eras-teaser", title: "Future Eras Teaser" },
    { id: "final-cta", title: "Final CTA" },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSET FALLBACK MAPPING — TASK 6.2
// ═══════════════════════════════════════════════════════════════════════════════
//
// This map defines the safe fallback for every asset reference in the landing
// content model. When an asset is marked "Missing" in docs/landing-asset-checklist.md,
// the component MUST use the `fallback` entry below instead of the primary src.
//
// Components reference these via:
//   import { IMAGE_OPTIMIZATION, ASSET_FALLBACK_MAP } from "@/content/landing"
//   const opt = IMAGE_OPTIMIZATION["goddess-utu"];
//   const src = opt.isPlaceholder ? ASSET_FALLBACK_MAP["goddess-utu"] : opt.src;
//
// Fallback categories:
//   "placeholder-label" — render a text-only panel with the asset name
//   "static-svg"        — use a generated geometric SVG placeholder
//   "none"              — hide the visual entirely (for optional assets)
// ═══════════════════════════════════════════════════════════════════════════════

export type FallbackStrategy = "placeholder-label" | "static-svg" | "static-png" | "none";

export interface AssetFallbackEntry {
  /** Human-readable asset name matching docs/landing-asset-checklist.md */
  assetName: string;
  /** Current status: "Missing" | "Placeholder" | "Approved" */
  status: "Missing" | "Placeholder" | "Approved";
  /** Strategy when asset is not yet approved */
  strategy: FallbackStrategy;
  /** Text-only fallback label when strategy is "placeholder-label" */
  fallbackLabel: string;
  /** Priority: 1 (critical, above fold) to 5 (optional decoration) */
  priority: 1 | 2 | 3 | 4 | 5;
}

export const ASSET_FALLBACK_MAP: Record<string, AssetFallbackEntry> = {
  // Hero section
  "hero-poster": {
    assetName: "Hero reliquary poster / key art (hero/)",
    status: "Placeholder",
    strategy: "placeholder-label",
    fallbackLabel: "Ceremonial reliquary — awaiting approved render",
    priority: 1,
  },
  "hero-og": {
    assetName: "Open Graph default image (hero/)",
    status: "Placeholder",
    strategy: "placeholder-label",
    fallbackLabel: "Elemental Queens — Sumerian Edition",
    priority: 2,
  },

  // Goddess renders
  "goddess-utu": {
    assetName: "Utu full-card render (cards/utu/)",
    status: "Approved",
    strategy: "static-png",
    fallbackLabel: "Utu — Solar Judgment approved card render",
    priority: 2,
  },
  "goddess-nammu": {
    assetName: "Nammu full-card render (cards/nammu/)",
    status: "Approved",
    strategy: "static-png",
    fallbackLabel: "Nammu — Abyssal Memory approved card render",
    priority: 2,
  },
  "goddess-an": {
    assetName: "An full-card render (cards/an/)",
    status: "Approved",
    strategy: "static-png",
    fallbackLabel: "An — Celestial Dominion approved card render",
    priority: 2,
  },
  "goddess-ki": {
    assetName: "Ki full-card render (cards/ki/)",
    status: "Approved",
    strategy: "static-png",
    fallbackLabel: "Ki — Verdant Foundation approved card render",
    priority: 2,
  },

  // Card anatomy diagram
  "card-anatomy": {
    assetName: "First Edition card anatomy diagram (goddesses/)",
    status: "Placeholder",
    strategy: "placeholder-label",
    fallbackLabel: "Card anatomy diagram — awaiting approved render",
    priority: 4,
  },

  // Symbols (currently inline SVG/text — tracked for future asset swap)
  "symbols-elemental": {
    assetName: "Elemental symbol set (symbols/) — Fire, Water, Air, Earth",
    status: "Approved",
    strategy: "static-svg",
    fallbackLabel: "~ Elemental symbols pending",
    priority: 3,
  },
  "symbols-blessed": {
    assetName: "Blessed symbol (symbols/)",
    status: "Missing",
    strategy: "static-svg",
    fallbackLabel: "~ Blessed symbol pending",
    priority: 3,
  },
  "symbols-sacrifice": {
    assetName: "Sacrifice symbol (symbols/)",
    status: "Missing",
    strategy: "static-svg",
    fallbackLabel: "~ Sacrifice symbol pending",
    priority: 3,
  },

  // Ornaments
  "ornaments-dividers": {
    assetName: "Cuneiform-style section dividers (ornaments/)",
    status: "Approved",
    strategy: "static-svg",
    fallbackLabel: "~ Ornamental divider pending",
    priority: 4,
  },
  "ornaments-frames": {
    assetName: "Card frame motifs (ornaments/)",
    status: "Approved",
    strategy: "static-svg",
    fallbackLabel: "~ Frame ornament pending",
    priority: 4,
  },

  // Board render
  "board-render": {
    assetName: "Tactical battlefield board render (board/)",
    status: "Missing",
    strategy: "placeholder-label",
    fallbackLabel: "Battlefield board — awaiting approved render",
    priority: 2,
  },

  // Brand identity
  "logo-wordmark": {
    assetName: "Elemental Queens logo / wordmark",
    status: "Missing",
    strategy: "placeholder-label",
    fallbackLabel: "Elemental Queens",
    priority: 1,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSET APPROVAL CHECKPOINT — TASK 6.3
// ═══════════════════════════════════════════════════════════════════════════════
//
// BEFORE PRODUCTION EXPORT, set the `status` of each entry in ASSET_FALLBACK_MAP
// to "Approved" and replace placeholder references in components.
//
// CHECKLIST (must ALL be "Approved" before production build):
//   ☐ hero-poster         — hero/ folder
//   ☐ hero-og             — hero/ folder (OG image)
//   ☐ goddess-utu         — goddesses/ folder
//   ☐ goddess-nammu       — goddesses/ folder
//   ☐ goddess-an          — goddesses/ folder
//   ☐ goddess-ki          — goddesses/ folder
//   ☐ card-anatomy        — goddesses/ folder
//   ☐ symbols-elemental   — symbols/ folder (SVG set)
//   ☐ symbols-blessed     — symbols/ folder
//   ☐ symbols-sacrifice   — symbols/ folder
//   ☐ ornaments-dividers  — ornaments/ folder
//   ☐ ornaments-frames    — ornaments/ folder
//   ☐ board-render        — board/ folder
//   ☐ logo-wordmark       — brand identity
//
// Components referencing "Placeholder" or "Missing" assets MUST show the
// fallback strategy (placeholder-label / static-svg / none) until approved.
//
// After approval:
//   1. Set ASSET_FALLBACK_MAP[key].status = "Approved"
//   2. Place real asset files in the correct src/assets/landing/ subfolder
//   3. Replace <img> with <Image /> from "astro:assets" using IMAGE_OPTIMIZATION
//   4. Remove placeholder labels and fallback panels
//   5. Re-run `npm run build` to verify all optimized images compile
// ═══════════════════════════════════════════════════════════════════════════════
