export const ELEMENT = {
  FIRE: "fire",
  WATER: "water",
  AIR: "air",
  EARTH: "earth",
} as const;

export type Element = (typeof ELEMENT)[keyof typeof ELEMENT];

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
    altFallback: "The Four Sovereigns — Sumerian Edition key art",
    isPlaceholder: true,
    fallbackFormat: "png",
  },
  "goddess-utu": {
    src: "/assets/landing/goddesses/utu-placeholder.webp",
    width: 600,
    height: 840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Utu — Solar Judgment card render",
    isPlaceholder: true,
    fallbackFormat: "png",
  },
  "goddess-nammu": {
    src: "/assets/landing/goddesses/nammu-placeholder.webp",
    width: 600,
    height: 840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Nammu — Abyssal Memory card render",
    isPlaceholder: true,
    fallbackFormat: "png",
  },
  "goddess-an": {
    src: "/assets/landing/goddesses/an-placeholder.webp",
    width: 600,
    height: 840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "An — Celestial Dominion card render",
    isPlaceholder: true,
    fallbackFormat: "png",
  },
  "goddess-ki": {
    src: "/assets/landing/goddesses/ki-placeholder.webp",
    width: 600,
    height: 840,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Ki — Verdant Foundation card render",
    isPlaceholder: true,
    fallbackFormat: "png",
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

export interface GoddessCardContent {
  id: Element;
  name: "Utu" | "Nammu" | "An" | "Ki";
  role: string;
  symbol: string;
  shortLore: string;
  cardImage: string;
  /** Optimization preset key from IMAGE_OPTIMIZATION. */
  optimizationKey: string;
}

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

export interface DivinePathsContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
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
    | "four-divine-paths"
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
  gameName: "The Four Sovereigns";
  hero: HeroContent;
  divinePathsContent: DivinePathsContent;
  tacticalBattlefield: TacticalBattlefieldContent;
  energyAscension: EnergyAscensionContent;
  cardAnatomy: CardAnatomyContent;
  loreFragments: LoreFragmentsContent;
  roadmapTeaser: RoadmapTeaserContent;
  sections: LandingSectionOrder[];
  divinePaths: GoddessCardContent[];
}

export const landingContent: LandingContent = {
  locale: "en",
  edition: "Sumerian Edition",
  gameName: "The Four Sovereigns",
  hero: {
    title: "The Four Sovereigns — Sumerian Edition",
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
  divinePathsContent: {
    sectionEyebrow: "The Divine Paths",
    sectionTitle: "Four Goddesses. Four Ways to Command Fate.",
    sectionDescription:
      "Each sovereign offers a distinct tactical identity through elemental symbolism, ritual role, and sacred battlefield intent.",
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
        title: "Awaken Sovereign Gifts",
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
        label: "Sovereign Crest",
        detail: "Displays goddess allegiance with name and sacred seal, never by color alone.",
      },
      {
        label: "Energy Invocation",
        detail: "Marks the ritual threshold required to deploy influence on the board.",
      },
      {
        label: "Blessed / Sacrifice Script",
        detail: "Highlights the cost-and-reward tension that defines high-stakes turns.",
      },
      {
        label: "Temple Lore Line",
        detail: "Carries concise narrative memory without replacing the full codex.",
      },
    ],
    placeholderAsset: "/src/assets/landing/goddesses/first-edition-card-placeholder.webp",
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
    { id: "four-divine-paths", title: "Four Divine Paths" },
    { id: "tactical-battlefield", title: "Tactical Battlefield" },
    { id: "energy-ascension", title: "Energy Ascension" },
    { id: "card-anatomy", title: "First Edition Card Anatomy" },
    { id: "lore-fragments", title: "Lore Fragments" },
    { id: "future-eras-teaser", title: "Future Eras Teaser" },
    { id: "final-cta", title: "Final CTA" },
  ],
  divinePaths: [
    {
      id: ELEMENT.FIRE,
      name: "Utu",
      role: "Solar Judgment",
      symbol: "Sun Seal",
      shortLore: "Bearer of radiant verdict and sacred flame.",
      cardImage: "/assets/landing/goddesses/utu-placeholder.webp",
      optimizationKey: "goddess-utu",
    },
    {
      id: ELEMENT.WATER,
      name: "Nammu",
      role: "Abyssal Memory",
      symbol: "Tide Seal",
      shortLore: "Keeper of primordial waters and hidden tides.",
      cardImage: "/assets/landing/goddesses/nammu-placeholder.webp",
      optimizationKey: "goddess-nammu",
    },
    {
      id: ELEMENT.AIR,
      name: "An",
      role: "Celestial Dominion",
      symbol: "Sky Seal",
      shortLore: "Sovereign of the upper vault and divine order.",
      cardImage: "/assets/landing/goddesses/an-placeholder.webp",
      optimizationKey: "goddess-an",
    },
    {
      id: ELEMENT.EARTH,
      name: "Ki",
      role: "Verdant Foundation",
      symbol: "Stone Seal",
      shortLore: "Mother of foundations, growth, and endurance.",
      cardImage: "/assets/landing/goddesses/ki-placeholder.webp",
      optimizationKey: "goddess-ki",
    },
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

export type FallbackStrategy = "placeholder-label" | "static-svg" | "none";

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
    fallbackLabel: "The Four Sovereigns — Sumerian Edition",
    priority: 2,
  },

  // Goddess renders
  "goddess-utu": {
    assetName: "Utu goddess card render (goddesses/)",
    status: "Placeholder",
    strategy: "placeholder-label",
    fallbackLabel: "Utu — Solar Judgment (awaiting approved render)",
    priority: 2,
  },
  "goddess-nammu": {
    assetName: "Nammu goddess card render (goddesses/)",
    status: "Placeholder",
    strategy: "placeholder-label",
    fallbackLabel: "Nammu — Abyssal Memory (awaiting approved render)",
    priority: 2,
  },
  "goddess-an": {
    assetName: "An goddess card render (goddesses/)",
    status: "Placeholder",
    strategy: "placeholder-label",
    fallbackLabel: "An — Celestial Dominion (awaiting approved render)",
    priority: 2,
  },
  "goddess-ki": {
    assetName: "Ki goddess card render (goddesses/)",
    status: "Placeholder",
    strategy: "placeholder-label",
    fallbackLabel: "Ki — Verdant Foundation (awaiting approved render)",
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
    status: "Missing",
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
    status: "Missing",
    strategy: "static-svg",
    fallbackLabel: "~ Ornamental divider pending",
    priority: 4,
  },
  "ornaments-frames": {
    assetName: "Card frame motifs (ornaments/)",
    status: "Missing",
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
    assetName: "The Four Sovereigns logo / wordmark",
    status: "Missing",
    strategy: "placeholder-label",
    fallbackLabel: "The Four Sovereigns",
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
