const state = {
  party: [],
  activeIndex: 0,
  encounter: null,
  defeatedBosses: new Set(),
};

const refs = {
  regions: document.getElementById("regions"),
  party: document.getElementById("party"),
  battleLog: document.getElementById("battle-log"),
  bossList: document.getElementById("boss-list"),
  canvas: document.getElementById("battle-canvas"),
  btnAttack: document.getElementById("btn-attack"),
  btnCatch: document.getElementById("btn-catch"),
  btnEvolve: document.getElementById("btn-evolve"),
};

function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function isLegendary(speciesId) {
  return LEGENDARY_IDS.includes(speciesId);
}

function drawSprite(ctx, speciesId, stage, x, y, size = 84) {
  const step = size / 8;
  const seed = speciesId * 17 + stage * 131;
  const hue = Math.floor(seeded(seed) * 360);
  const legendary = isLegendary(speciesId);

  ctx.save();
  ctx.translate(x, y);

  if (legendary) {
    const glow = ctx.createRadialGradient(size / 2, size / 2, 5, size / 2, size / 2, size * 0.7);
    glow.addColorStop(0, "rgba(255, 245, 145, 0.45)");
    glow.addColorStop(1, "rgba(255, 245, 145, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(-8, -8, size + 16, size + 16);
  }

  ctx.fillStyle = legendary ? `hsl(${hue} 90% 72%)` : `hsl(${hue} 75% 60%)`;

  for (let py = 0; py < 8; py++) {
    for (let px = 0; px < 8; px++) {
      const value = seeded(seed + px * 11 + py * 23);
      const bodyBias = Math.abs(px - 3.5) + Math.abs(py - 3.5) < 4.6 - stage * 0.2;
      if (value > 0.36 || bodyBias) {
        ctx.fillRect(px * step, py * step, step, step);
      }
    }
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(step * 2, step * 2, step, step);
  ctx.fillRect(step * 5, step * 2, step, step);
  ctx.fillStyle = legendary ? "#8b1f1f" : "#111";
  ctx.fillRect(step * 2.3, step * 2.35, step * 0.45, step * 0.45);
  ctx.fillRect(step * 5.25, step * 2.35, step * 0.45, step * 0.45);

  if (legendary) {
    ctx.strokeStyle = "rgba(255, 232, 132, 0.95)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);
  }

  ctx.restore();
}

function spriteDataUri(speciesId, stage) {
  const c = document.createElement("canvas");
  c.width = 48;
  c.height = 48;
  const ctx = c.getContext("2d");
  drawSprite(ctx, speciesId, stage, 0, 0, 48);
  return c.toDataURL();
}

function makeMonster(speciesId, stage = 0) {
  const species = SPECIES[speciesId - 1];
  const evo = species.evolutionStages[stage];
  return {
    speciesId,
    stage,
    name: evo.name,
    hp: evo.hp,
    maxHp: evo.hp,
    power: evo.power,
    exp: 0,
  };
}

function setLog(msg) {
  refs.battleLog.textContent = msg;
}

function init() {
  STARTER_POOL.forEach((id, idx) => state.party.push(makeMonster(id, idx % 2)));
  bindEvents();
  renderRegions();
  renderBosses();
  renderParty();
  drawBattlefield();
  setLog("Welcome to Mythimon Legends 2D+ edition: 300 sprites, legendary hunts, and 3D-depth arenas.");
}

function bindEvents() {
  refs.btnAttack.addEventListener("click", onAttack);
  refs.btnCatch.addEventListener("click", onCapture);
  refs.btnEvolve.addEventListener("click", evolveActive);
}

function renderRegions() {
  refs.regions.innerHTML = "";
  WORLD.forEach((zone, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${zone.region} (Lv ${zone.level})`;
    btn.addEventListener("click", () => spawnEncounter(i));
    refs.regions.appendChild(btn);
  });
}

function renderBosses() {
  refs.bossList.innerHTML = "";
  WORLD.forEach((zone) => {
    const li = document.createElement("li");
    li.className = state.defeatedBosses.has(zone.bossId) ? "done" : "pending";
    li.textContent = `${zone.bossName} — ${zone.region}`;
    refs.bossList.appendChild(li);
  });
}

function renderParty() {
  refs.party.innerHTML = "";
  state.party.forEach((mon, idx) => {
    const species = SPECIES[mon.speciesId - 1];
    const card = document.createElement("div");
    card.className = `party-card ${species.rarity === "Legendary" ? "legendary-card" : ""}`.trim();

    const img = document.createElement("img");
    img.className = "sprite";
    img.alt = `${mon.name} sprite`;
    img.src = spriteDataUri(mon.speciesId, mon.stage);

    const rarityTag = species.rarity === "Legendary" ? "🌟 Legendary" : species.element;
    const text = document.createElement("div");
    text.innerHTML = `<strong>${mon.name}</strong><br>${rarityTag} • HP ${Math.max(mon.hp, 0)}/${mon.maxHp}<br>Power ${mon.power} • XP ${mon.exp}`;

    const pick = document.createElement("button");
    pick.textContent = idx === state.activeIndex ? "Active" : "Set Active";
    pick.disabled = idx === state.activeIndex;
    pick.addEventListener("click", () => {
      state.activeIndex = idx;
      renderParty();
      drawBattlefield();
    });

    card.append(img, text, pick);
    refs.party.appendChild(card);
  });
}

function rollLegendaryChance(zoneLevel) {
  return 0.02 + Math.max(0, zoneLevel - 18) * 0.002;
}

function spawnEncounter(zoneIndex) {
  const zone = WORLD[zoneIndex];
  const legendaryRoll = Math.random() < rollLegendaryChance(zone.level);
  const isBoss = !legendaryRoll && Math.random() < 0.34;

  if (legendaryRoll) {
    const legendaryId = LEGENDARY_IDS[Math.floor(Math.random() * LEGENDARY_IDS.length)];
    state.encounter = {
      type: "legendary",
      zone,
      foe: makeMonster(legendaryId, 3),
    };
    setLog(`✨ LEGENDARY ALERT in ${zone.region}: ${state.encounter.foe.name} descends!`);
  } else if (isBoss) {
    const bossSpeciesId = zone.bossTeam[Math.floor(Math.random() * zone.bossTeam.length)];
    const bossStage = Math.min(3, Math.floor(zone.level / 10) + 1);
    state.encounter = {
      type: "boss",
      zone,
      foe: makeMonster(bossSpeciesId, bossStage),
    };
    state.encounter.foe.name = `${zone.bossName}'s ${state.encounter.foe.name}`;
    setLog(`Boss sighted in ${zone.region}! ${state.encounter.foe.name} appears.`);
  } else {
    const wildSpeciesId = 1 + Math.floor(Math.random() * 290);
    const wildStage = Math.min(3, Math.floor(zone.level / 12));
    state.encounter = {
      type: "wild",
      zone,
      foe: makeMonster(wildSpeciesId, wildStage),
    };
    setLog(`Wild ${state.encounter.foe.name} emerged in ${zone.region}.`);
  }

  drawBattlefield();
}

function getActive() {
  return state.party[state.activeIndex];
}

function onAttack() {
  if (!state.encounter) {
    setLog("No encounter active. Pick a region first.");
    return;
  }

  const hero = getActive();
  const foe = state.encounter.foe;
  const legendaryEnemy = isLegendary(foe.speciesId);

  const heroHit = Math.max(4, hero.power + Math.floor(Math.random() * 8) - 2);
  foe.hp -= heroHit;

  if (foe.hp <= 0) {
    const reward = state.encounter.type === "legendary" ? 200 : 26 + foe.stage * 14;
    hero.exp += reward;
    setLog(`${hero.name} dealt ${heroHit} and defeated ${foe.name}! +${reward} XP.`);
    if (state.encounter.type === "boss") {
      state.defeatedBosses.add(state.encounter.zone.bossId);
    }
    state.encounter = null;
    postTurnUpdate();
    return;
  }

  const foeHit = Math.max(2, foe.power + Math.floor(Math.random() * (legendaryEnemy ? 8 : 5)) - 2);
  hero.hp -= foeHit;
  setLog(`${hero.name} dealt ${heroHit}. ${foe.name} hit back for ${foeHit}.`);

  if (hero.hp <= 0) {
    hero.hp = 1;
    setLog(`${hero.name} almost fainted, but held on with 1 HP.`);
  }

  postTurnUpdate();
}

function onCapture() {
  if (!state.encounter || state.encounter.type === "boss") {
    setLog("You can capture only non-boss encounters.");
    return;
  }

  const foe = state.encounter.foe;
  const species = SPECIES[foe.speciesId - 1];
  const hpFactor = 1 - foe.hp / foe.maxHp;
  const rarityPenalty = species.rarity === "Legendary" ? 0.2 : 0;
  const chance = Math.max(0.03, species.captureRate + hpFactor * 0.4 - rarityPenalty);

  if (Math.random() < chance) {
    state.party.push(makeMonster(foe.speciesId, foe.stage));
    setLog(`Captured ${foe.name}! Your roster now has ${state.party.length} Mythimon.`);
    state.encounter = null;
  } else {
    setLog(`Capture failed! ${foe.name} broke free.`);
  }

  postTurnUpdate();
}

function evolveActive() {
  const hero = getActive();
  const species = SPECIES[hero.speciesId - 1];
  if (hero.stage >= 3) {
    setLog(`${hero.name} is already at max evolution (★★★★).`);
    return;
  }

  const nextStage = hero.stage + 1;
  const requirement = species.evolutionStages[nextStage].expNeeded;
  if (hero.exp < requirement) {
    setLog(`${hero.name} needs ${requirement - hero.exp} more XP to evolve.`);
    return;
  }

  const evolved = species.evolutionStages[nextStage];
  hero.stage = nextStage;
  hero.name = evolved.name;
  hero.maxHp = evolved.hp;
  hero.hp = evolved.hp;
  hero.power = evolved.power;
  setLog(`${species.baseName} evolved into ${hero.name} (${evolved.tier})!`);

  postTurnUpdate();
}

function drawParallax3DBackground(ctx) {
  const w = refs.canvas.width;
  const h = refs.canvas.height;

  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#0f1634");
  sky.addColorStop(0.4, "#1e2a57");
  sky.addColorStop(1, "#0b1026");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(80, 120, 180, 0.35)";
  ctx.beginPath();
  ctx.moveTo(0, 120);
  for (let i = 0; i <= w; i += 28) {
    ctx.lineTo(i, 100 + Math.sin(i * 0.03) * 11);
  }
  ctx.lineTo(w, 170);
  ctx.lineTo(0, 170);
  ctx.closePath();
  ctx.fill();

  // Faux-3D perspective floor grid.
  ctx.strokeStyle = "rgba(86, 165, 255, 0.35)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 14; i++) {
    const y = 155 + i * 8.5;
    const curve = i * i * 0.9;
    ctx.beginPath();
    ctx.moveTo(40 - curve, y);
    ctx.lineTo(w - 40 + curve, y);
    ctx.stroke();
  }

  for (let i = 0; i <= 16; i++) {
    const x = w / 2 + (i - 8) * 32;
    ctx.beginPath();
    ctx.moveTo(w / 2, 148);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.ellipse(118, 204, 96, 34, 0, 0, Math.PI * 2);
  ctx.ellipse(304, 98, 94, 30, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBattlefield() {
  const ctx = refs.canvas.getContext("2d");
  ctx.clearRect(0, 0, refs.canvas.width, refs.canvas.height);

  drawParallax3DBackground(ctx);

  const hero = getActive();
  if (hero) {
    drawSprite(ctx, hero.speciesId, hero.stage, 75, 152, 86);
    ctx.fillStyle = "#fff";
    ctx.fillText(`${hero.name} HP ${Math.max(hero.hp, 0)}/${hero.maxHp}`, 24, 246);
  }

  if (state.encounter) {
    drawSprite(ctx, state.encounter.foe.speciesId, state.encounter.foe.stage, 262, 32, 86);
    ctx.fillStyle = "#fff";
    ctx.fillText(`${state.encounter.foe.name} HP ${Math.max(state.encounter.foe.hp, 0)}/${state.encounter.foe.maxHp}`, 148, 24);
  }
}

function postTurnUpdate() {
  renderParty();
  renderBosses();
  drawBattlefield();

  if (state.defeatedBosses.size === WORLD.length) {
    setLog("Legend complete! You defeated all 10 main bosses.");
  }
}

init();
