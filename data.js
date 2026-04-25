const ELEMENTS = ["Flame", "Aqua", "Terra", "Volt", "Aether", "Shadow", "Frost", "Metal"];
const TIER_NAMES = ["★", "★★", "★★★", "★★★★"];

const LEGENDARIES = [
  { id: 291, title: "Pyroth Emperor", element: "Flame" },
  { id: 292, title: "Leviara Queen", element: "Aqua" },
  { id: 293, title: "Gaian Colossus", element: "Terra" },
  { id: 294, title: "Voltrix Prime", element: "Volt" },
  { id: 295, title: "Aetherion", element: "Aether" },
  { id: 296, title: "Noctyra", element: "Shadow" },
  { id: 297, title: "Cryonex", element: "Frost" },
  { id: 298, title: "Ferragon", element: "Metal" },
  { id: 299, title: "Eclipse Seraph", element: "Aether" },
  { id: 300, title: "Omnidrake", element: "Volt" },
];

const SPECIES = Array.from({ length: 300 }, (_, idx) => {
  const id = idx + 1;
  const isLegendary = id >= 291;
  const element = isLegendary
    ? LEGENDARIES[id - 291].element
    : ELEMENTS[idx % ELEMENTS.length];
  const baseName = isLegendary
    ? LEGENDARIES[id - 291].title.replaceAll(" ", "-")
    : `${element.slice(0, 2)}mori-${String(id).padStart(3, "0")}`;

  const baseHp = isLegendary ? 92 + (id % 6) * 5 : 22 + id;
  const basePower = isLegendary ? 30 + (id % 5) : 7 + (id % 6);

  return {
    id,
    baseName,
    title: isLegendary ? LEGENDARIES[id - 291].title : null,
    element,
    rarity: isLegendary ? "Legendary" : "Common",
    captureRate: isLegendary ? 0.04 : 0.58 - (id % 6) * 0.05,
    evolutionStages: [0, 1, 2, 3].map((stage) => ({
      stage,
      tier: TIER_NAMES[stage],
      name: isLegendary ? `${LEGENDARIES[id - 291].title} ${TIER_NAMES[stage]}` : `${baseName}-${stage + 1}`,
      hp: baseHp + stage * (isLegendary ? 24 : 12),
      power: basePower + stage * (isLegendary ? 8 : 4),
      expNeeded: stage === 0 ? 0 : stage * (isLegendary ? 120 : 45),
    })),
  };
});

const WORLD = [
  { region: "Cinder Savannah", level: 8, bossId: 1, bossName: "Ashmane Rex", bossTeam: [34, 79, 114] },
  { region: "Verdant Cliffs", level: 12, bossId: 2, bossName: "Sylva Matron", bossTeam: [22, 67, 112] },
  { region: "Tempest Bay", level: 16, bossId: 3, bossName: "Torrent Admiral", bossTeam: [45, 90, 135] },
  { region: "Runic Marsh", level: 20, bossId: 4, bossName: "Glyph Warden", bossTeam: [11, 101, 121] },
  { region: "Sunken Prism", level: 24, bossId: 5, bossName: "Prisma Oracle", bossTeam: [56, 126, 166] },
  { region: "Howling Dunes", level: 28, bossId: 6, bossName: "Dervish Khan", bossTeam: [43, 143, 183] },
  { region: "Stormspire", level: 32, bossId: 7, bossName: "Volt Saint", bossTeam: [88, 158, 208] },
  { region: "Obsidian Hollow", level: 36, bossId: 8, bossName: "Umbra Tyrant", bossTeam: [119, 169, 219] },
  { region: "Aurora Verge", level: 40, bossId: 9, bossName: "Zenith Queen", bossTeam: [150, 210, 260] },
  { region: "Celestial Core", level: 45, bossId: 10, bossName: "Archeon Prime", bossTeam: [294, 299, 300] },
];

const STARTER_POOL = [8, 15, 24];
const LEGENDARY_IDS = LEGENDARIES.map((l) => l.id);
