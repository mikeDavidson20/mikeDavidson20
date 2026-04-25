const ELEMENTS = ["Flame", "Aqua", "Terra", "Volt", "Aether"];
const TIER_NAMES = ["★", "★★", "★★★", "★★★★"];

const SPECIES = Array.from({ length: 40 }, (_, idx) => {
  const id = idx + 1;
  const element = ELEMENTS[idx % ELEMENTS.length];
  const baseName = `${element.slice(0, 2)}mori-${String(id).padStart(2, "0")}`;
  return {
    id,
    baseName,
    element,
    attack: 8 + (id % 7),
    defense: 5 + (id % 6),
    captureRate: 0.52 - (id % 5) * 0.04,
    evolutionStages: [0, 1, 2, 3].map((stage) => ({
      stage,
      tier: TIER_NAMES[stage],
      name: `${baseName}-${stage + 1}`,
      hp: 20 + id + stage * 12,
      power: 6 + (id % 4) + stage * 4,
      expNeeded: stage === 0 ? 0 : stage * 40,
    })),
  };
});

const WORLD = [
  { region: "Cinder Savannah", level: 4, bossId: 1, bossName: "Ashmane Rex", bossTeam: [4, 9, 14] },
  { region: "Verdant Cliffs", level: 6, bossId: 2, bossName: "Sylva Matron", bossTeam: [2, 7, 12] },
  { region: "Tempest Bay", level: 8, bossId: 3, bossName: "Torrent Admiral", bossTeam: [5, 10, 15] },
  { region: "Runic Marsh", level: 10, bossId: 4, bossName: "Glyph Warden", bossTeam: [1, 11, 21] },
  { region: "Sunken Prism", level: 12, bossId: 5, bossName: "Prisma Oracle", bossTeam: [6, 16, 26] },
  { region: "Howling Dunes", level: 14, bossId: 6, bossName: "Dervish Khan", bossTeam: [3, 13, 23] },
  { region: "Stormspire", level: 16, bossId: 7, bossName: "Volt Saint", bossTeam: [8, 18, 28] },
  { region: "Obsidian Hollow", level: 18, bossId: 8, bossName: "Umbra Tyrant", bossTeam: [19, 24, 29] },
  { region: "Aurora Verge", level: 20, bossId: 9, bossName: "Zenith Queen", bossTeam: [20, 30, 35] },
  { region: "Celestial Core", level: 22, bossId: 10, bossName: "Archeon Prime", bossTeam: [25, 34, 40] },
];

const STARTER_POOL = [1, 8, 15];
