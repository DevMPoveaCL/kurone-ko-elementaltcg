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
  /** Responsive widths available for final card renders. */
  widths?: readonly number[];
}

const CARD_VARIANT_WIDTHS = [300, 400, 600, 800] as const;
const CARD_MAGNIFIER_WIDTHS = [1200, 1600] as const;
const CARD_ACTIVE_WIDTH = 800;
const CARD_ACTIVE_HEIGHT = 1422;
const CARD_MAGNIFIER_WIDTH = 1600;
const CARD_MAGNIFIER_HEIGHT = 2844;
const activeCardVariant = (id: ShowingCardId) => `/assets/cards/${id}/variants/card-800w.webp`;
const trailingCardVariant = (id: ShowingCardId) => `/assets/cards/${id}/variants/card-400w.webp`;
const magnifiedCardVariant = (id: ShowingCardId) => `/assets/cards/${id}/variants/card-1600w.webp`;
const cardSrcSet = (id: ShowingCardId) =>
  CARD_VARIANT_WIDTHS.map((width) => `/assets/cards/${id}/variants/card-${width}w.webp ${width}w`).join(", ");
const cardMagnifierSrcSet = (id: ShowingCardId) =>
  CARD_MAGNIFIER_WIDTHS.map((width) => `/assets/cards/${id}/variants/card-${width}w.webp ${width}w`).join(", ");

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
    src: activeCardVariant("utu"),
    width: CARD_ACTIVE_WIDTH,
    height: CARD_ACTIVE_HEIGHT,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Utu — Solar Judgment card render",
    isPlaceholder: false,
    fallbackFormat: null,
    widths: CARD_VARIANT_WIDTHS,
  },
  "goddess-nammu": {
    src: activeCardVariant("nammu"),
    width: CARD_ACTIVE_WIDTH,
    height: CARD_ACTIVE_HEIGHT,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Nammu — Abyssal Memory card render",
    isPlaceholder: false,
    fallbackFormat: null,
    widths: CARD_VARIANT_WIDTHS,
  },
  "goddess-an": {
    src: activeCardVariant("an"),
    width: CARD_ACTIVE_WIDTH,
    height: CARD_ACTIVE_HEIGHT,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "An — Celestial Dominion card render",
    isPlaceholder: false,
    fallbackFormat: null,
    widths: CARD_VARIANT_WIDTHS,
  },
  "goddess-ki": {
    src: activeCardVariant("ki"),
    width: CARD_ACTIVE_WIDTH,
    height: CARD_ACTIVE_HEIGHT,
    loading: "lazy",
    fetchpriority: "auto",
    decoding: "async",
    altFallback: "Ki — Verdant Foundation card render",
    isPlaceholder: false,
    fallbackFormat: null,
    widths: CARD_VARIANT_WIDTHS,
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
  srcSet: string;
  sizes: string;
  trailingSrc: string;
  trailingSizes: string;
  magnifiedSrc: string;
  magnifiedSrcSet: string;
  magnifiedSizes: string;
  magnifiedWidth: number;
  magnifiedHeight: number;
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
      src: activeCardVariant("nammu"),
      srcSet: cardSrcSet("nammu"),
      sizes: "(max-width: 1023px) min(78vw, 24rem), min(28vw, 50svh)",
      trailingSrc: trailingCardVariant("nammu"),
      trailingSizes: "min(48vw, 18rem)",
      magnifiedSrc: magnifiedCardVariant("nammu"),
      magnifiedSrcSet: cardMagnifierSrcSet("nammu"),
      magnifiedSizes: "min(78vw, 24rem)",
      magnifiedWidth: CARD_MAGNIFIER_WIDTH,
      magnifiedHeight: CARD_MAGNIFIER_HEIGHT,
      width: CARD_ACTIVE_WIDTH,
      height: CARD_ACTIVE_HEIGHT,
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
      src: activeCardVariant("utu"),
      srcSet: cardSrcSet("utu"),
      sizes: "(max-width: 1023px) min(78vw, 24rem), min(28vw, 50svh)",
      trailingSrc: trailingCardVariant("utu"),
      trailingSizes: "min(48vw, 18rem)",
      magnifiedSrc: magnifiedCardVariant("utu"),
      magnifiedSrcSet: cardMagnifierSrcSet("utu"),
      magnifiedSizes: "min(78vw, 24rem)",
      magnifiedWidth: CARD_MAGNIFIER_WIDTH,
      magnifiedHeight: CARD_MAGNIFIER_HEIGHT,
      width: CARD_ACTIVE_WIDTH,
      height: CARD_ACTIVE_HEIGHT,
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
      src: activeCardVariant("an"),
      srcSet: cardSrcSet("an"),
      sizes: "(max-width: 1023px) min(78vw, 24rem), min(28vw, 50svh)",
      trailingSrc: trailingCardVariant("an"),
      trailingSizes: "min(48vw, 18rem)",
      magnifiedSrc: magnifiedCardVariant("an"),
      magnifiedSrcSet: cardMagnifierSrcSet("an"),
      magnifiedSizes: "min(78vw, 24rem)",
      magnifiedWidth: CARD_MAGNIFIER_WIDTH,
      magnifiedHeight: CARD_MAGNIFIER_HEIGHT,
      width: CARD_ACTIVE_WIDTH,
      height: CARD_ACTIVE_HEIGHT,
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
      "Ki gave humanity ground, womb, grave, field, mountain, and every name that cultures placed upon the patient earth. She fragmented herself into service until she feared becoming useful but unseen: a silent stage for a world with no one left to stand upon it. She and Nammu hid Ziusudra’s descendants after the flood, not from weakness but because a goddess who admits her terror can still choose protection over pride. If the earth still calls you by name, will you answer beneath her silence?",
    question: "What remains of a goddess, when her silence is mistaken for absence?",
    image: {
      src: activeCardVariant("ki"),
      srcSet: cardSrcSet("ki"),
      sizes: "(max-width: 1023px) min(78vw, 24rem), min(28vw, 50svh)",
      trailingSrc: trailingCardVariant("ki"),
      trailingSizes: "min(48vw, 18rem)",
      magnifiedSrc: magnifiedCardVariant("ki"),
      magnifiedSrcSet: cardMagnifierSrcSet("ki"),
      magnifiedSizes: "min(78vw, 24rem)",
      magnifiedWidth: CARD_MAGNIFIER_WIDTH,
      magnifiedHeight: CARD_MAGNIFIER_HEIGHT,
      width: CARD_ACTIVE_WIDTH,
      height: CARD_ACTIVE_HEIGHT,
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

export interface PrimordialRuleContent {
  title: string;
  detail: string;
}

export interface PrimordialVerdictContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  ruleTiers: PrimordialRuleContent[];
}

export interface CardTypeContent {
  slot: string;
  subtitle: string;
  detail: string;
  assetLabel: string;
}

export interface CardTypeReliquaryContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  cardTypes: CardTypeContent[];
}

export interface SacredGridFieldContent {
  label: string;
  position: string;
  detail: string;
}

export interface SacredGridAnatomyContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  battlefieldSummary: string;
  anatomyFields: SacredGridFieldContent[];
}

export interface RoadmapPhaseContent {
  label: string;
  title: string;
  status: string;
  detail: string;
}

export interface RoadmapSealedGateContent {
  sectionEyebrow: string;
  sectionTitle: string;
  sectionDescription: string;
  phases: RoadmapPhaseContent[];
  finalLine: string;
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
    | "primordial-verdict"
    | "card-type-reliquary"
    | "sacred-grid-anatomy"
    | "sealed-roadmap"
    | "final-cta";
  title: string;
}

export interface LandingContent {
  locale: "en";
  edition: "Sumerian Edition";
  gameName: "Elemental Queens";
  hero: HeroContent;
  showingCards: ShowingCardsContent;
  primordialVerdict: PrimordialVerdictContent;
  cardTypeReliquary: CardTypeReliquaryContent;
  sacredGridAnatomy: SacredGridAnatomyContent;
  roadmapSealedGate: RoadmapSealedGateContent;
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
      "Before the world learned to count its days, four Queens played beneath the silence of creation. Their movements became Memory, Judgment, Ascent, and Foundation. Now those fragments descend as cards, not as gifts, but as a final question.If even divinity could not heal what it carried, what will you do when her relic chooses you?",
    ariaLabel: "Showing Cards elemental carousel",
    previousLabel: "Show previous goddess card",
    nextLabel: "Show next goddess card",
    livePrefix: "Now showing",
    cards: SHOWING_CARD_ORDER.map((cardId) => SHOWING_CARDS_BY_ID[cardId]),
  },
  primordialVerdict: {
    sectionEyebrow: "The Oldest Trial",
    sectionTitle: "Before Temples, Before Names, There Was the Game",
    sectionDescription:
      "Four elemental Queens — Nammu of the abyss, Utu of the sun, An of the sky, Ki of the earth — have judged humanity every five thousand years. After twenty millennia, the last verdict broke into silence: two guilty, two innocent, and no law old enough to decide. So they sealed their fragments into cards and issued one final invitation. Not as gift. Not as curse. As trial.",
    ruleTiers: [
      {
        title: "Choose Your Queen",
        detail:
          "Each player binds their fate to Fire, Water, Air, or Earth. Your Queen defines your strategy and awakens new gifts as your energy rises.",
      },
      {
        title: "Gather Energy",
        detail:
          "At three energy, the first gift stirs. At six, a mono-element army keeps every gift alive. At seven, the Queen may descend onto the battlefield herself.",
      },
      {
        title: "Deploy the Faithful",
        detail:
          "Allies enter a chess-inspired grid: pawns hold the line, bishops command the center, knights strike from the flanks, and rooks anchor the corners.",
      },
      {
        title: "Break the Enemy Deck",
        detail:
          "Combat is one against one. When power differs, the weaker side falls and its controller loses cards from the deck equal to the wound.",
      },
    ],
  },
  cardTypeReliquary: {
    sectionEyebrow: "Sacred Typology",
    sectionTitle: "Five Vessels, One Covenant",
    sectionDescription:
      "Every card in the Sumerian Edition is a fragment of divine will sealed into form. Each type answers a different question on the battlefield.",
    cardTypes: [
      {
        slot: "Allies",
        subtitle: "Pawn · Bishop · Knight",
        detail:
          "The mortal hands that answer the Queens' call. Pawns are the many; Bishops and Knights are the named figures of Sumerian myth and history. To summon a Bishop or Knight, a Pawn must be discarded from your hand.",
        assetLabel: "Ally card asset slot",
      },
      {
        slot: "Rooks",
        subtitle: "Towers · Temples · Ziggurats",
        detail:
          "Sacred structures that anchor a domain: solar ziggurats, deep-water shrines, archives, gates, and towers where divine law touches mortal ground.",
        assetLabel: "Rook structure asset slot",
      },
      {
        slot: "Talismans",
        subtitle: "Hidden Strategies",
        detail:
          "Sealed gestures and ritual answers. Talismans do not simply occupy the grid; they bend the rules at the moment the opponent thinks the verdict is known.",
        assetLabel: "Talisman asset slot",
      },
      {
        slot: "Energy",
        subtitle: "The Elemental Pulse",
        detail:
          "The ritual fuel of the game. Energy pays costs, awakens Queen gifts, and becomes the threshold between mortal command and divine manifestation.",
        assetLabel: "Energy card asset slot",
      },
      {
        slot: "Queens",
        subtitle: "The Four Elemental Sovereigns",
        detail:
          "Nammu, Utu, An, and Ki stand at the center of the covenant. At seven energy, a Queen may enter the field, bless her allies, and demand Sacrifice in return.",
        assetLabel: "Queen card asset slot",
      },
    ],
  },
  sacredGridAnatomy: {
    sectionEyebrow: "The Board and the Blade",
    sectionTitle: "Every Card Carries a Battlefield Within",
    sectionDescription:
      "The field is a chess-like mirror where two Queens face each other across twelve deployment zones. Where you place a card is as decisive as which card you play.",
    battlefieldSummary:
      "Six Pawn lanes form the front line. Two Rooks hold the corners. Two Knights guard the flanks. Two Bishops command the center. The Queen watches from the heart of your side until seven energy opens the gate.",
    anatomyFields: [
      {
        label: "Power",
        position: "Top-left medallion",
        detail: "Combat strength. Pawns carry 0–2 power; Bishops and Knights rise from 3–5.",
      },
      {
        label: "Energy Cost",
        position: "Top-right medallion",
        detail: "The ritual threshold required to play the card.",
      },
      {
        label: "Name",
        position: "Center-top strip",
        detail: "A Sumerian echo: archetype, hero, god, city, or sacred structure.",
      },
      {
        label: "Illustration",
        position: "Central window",
        detail: "The visual soul of the card before rules speak.",
      },
      {
        label: "Lore",
        position: "Lower illustration panel",
        detail: "A memory tied to the Queen who called this card into being.",
      },
      {
        label: "Type",
        position: "Bottom-left medallion",
        detail: "Pawn, Bishop, or Knight — the mark that determines deployment logic.",
      },
      {
        label: "Ability",
        position: "Bottom-center tablet",
        detail: "Keywords such as Rush, Berserk, Guardian, Recover, Drain, Unblockable, and Blessed reshape combat.",
      },
      {
        label: "Attribute",
        position: "Bottom-right medallion",
        detail: "Fire, Water, Air, or Earth — allegiance to the Queen whose gifts may awaken it.",
      },
    ],
  },
  roadmapSealedGate: {
    sectionEyebrow: "Sealed Beyond the Gate",
    sectionTitle: "The Trial Has Only Just Begun",
    sectionDescription:
      "The Sumerian Edition is the first reliquary. If it takes root, the judgment can expand across civilizations, modes, and eras of human conflict.",
    phases: [
      {
        label: "Phase I",
        title: "Sumerian Edition — First Launch",
        status: "Current",
        detail:
          "The foundation set: 160 allies, 20 rooks, 4 energy cards, 30 talismans, and the 4 elemental Queens.",
      },
      {
        label: "Phase II",
        title: "Story Mode — The Chosen's Descent",
        status: "Planned",
        detail:
          "A single-player campaign where you answer one Queen's call, learn her wound, and command her allies through canonical trials.",
      },
      {
        label: "Phase III",
        title: "Duelist — Deck vs. Deck Online",
        status: "Planned",
        detail:
          "Competitive multiplayer focused on deck construction, grid tactics, and one-to-one online duels against another player.",
      },
      {
        label: "Phase IV+",
        title: "Future Eras — The Sealed Expansions",
        status: "Distant",
        detail:
          "Bronze Age civilizations, classical empires, medieval powers, gunpowder conflicts, world wars, and the digital age wait beyond the first gate.",
      },
    ],
    finalLine: "For now, all devotion remains with the first reliquary. The gate opens with the First Edition.",
  },
  sections: [
    { id: "hero", title: "Hero Reliquary" },
    { id: "showing-cards", title: "Showing Cards" },
    { id: "primordial-verdict", title: "Primordial Verdict" },
    { id: "card-type-reliquary", title: "Card Type Reliquary" },
    { id: "sacred-grid-anatomy", title: "Sacred Grid Anatomy" },
    { id: "sealed-roadmap", title: "Sealed Roadmap" },
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
