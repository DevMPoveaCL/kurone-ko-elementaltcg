import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const ROOT = process.cwd();
const CARD_WIDTHS = [300, 400, 600, 800, 1200, 1600];
const BATTLEFIELD_WIDTHS = [480, 800, 1200, 1600, 2000];
const WEBP_OPTIONS = {
  effort: 6,
  quality: 95,
  smartSubsample: true,
};

const VARIANT_SETS = [
  ...[
    ["battlefield", "battlefield.webp", BATTLEFIELD_WIDTHS],
    ["gilgamesh", "gilgameshCard.webp", CARD_WIDTHS],
  ].map(([assetId, filename, widths]) => ({
    label: `battlefield:${assetId}`,
    source: path.join(ROOT, filename),
    outputDirectory: path.join(ROOT, "public", "assets", "landing", "battlefield", assetId, "variants"),
    widths,
    filenamePrefix: assetId === "gilgamesh" ? "card" : "image",
  })),
];

for (const variantSet of VARIANT_SETS) {
  const { label, source, outputDirectory, widths, filenamePrefix } = variantSet;

  await fs.mkdir(outputDirectory, { recursive: true });

  for (const width of widths) {
    const output = path.join(outputDirectory, `${filenamePrefix}-${width}w.webp`);
    await sharp(source).resize({ width }).webp(WEBP_OPTIONS).toFile(output);
    const stats = await fs.stat(output);
    console.log(`${label} ${width}w ${(stats.size / 1024).toFixed(1)} KB`);
  }
}
