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
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function drawSprite(ctx, speciesId, stage, x, y, size = 78) {
  const step = size / 8;
  const seed = speciesId * 13 + stage * 101;
  const hue = Math.floor(seeded(seed) * 360);

  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = `hsl(${hue} 75% 60%)`;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 1;

  for (let py = 0; py < 8; py++) {
    for (let px = 0; px < 8; px++) {
      const value = seeded(seed + px * 7 + py * 19);
      if (value > 0.38 || (Math.abs(px - 3.5) + Math.abs(py - 3.5) < 4 - stage * 0.2)) {
        ctx.fillRect(px * step, py * step, step, step);
      }
    }
  }

  ctx.fillStyle = "#fff";
  ctx.fillRect(step * 2, step * 2, step, step);
  ctx.fillRect(step * 5, step * 2, step, step);
  ctx.fillStyle = "#111";
  ctx.fillRect(step * 2.2, step * 2.4, step * 0.45, step * 0.45);
  ctx.fillRect(step * 5.35, step * 2.4, step * 0.45, step * 0.45);

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
  setLog("Welcome to Mythimon Legends. Pick a region to find creatures and challenge bosses.");
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
    card.className = "party-card";

    const img = document.createElement("img");
    img.className = "sprite";
    img.alt = `${mon.name} sprite`;
    img.src = spriteDataUri(mon.speciesId, mon.stage);

    const text = document.createElement("div");
    text.innerHTML = `<strong>${mon.name}</strong><br>${species.element} • HP ${Math.max(mon.hp, 0)}/${mon.maxHp}<br>Power ${mon.power} • XP ${mon.exp}`;

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

function spawnEncounter(zoneIndex) {
  const zone = WORLD[zoneIndex];
  const isBoss = Math.random() < 0.35;

  if (isBoss) {
    const bossSpeciesId = zone.bossTeam[Math.floor(Math.random() * zone.bossTeam.length)];
    const bossStage = Math.min(3, Math.floor(zone.level / 7) + 1);
    state.encounter = {
      type: "boss",
      zone,
      foe: makeMonster(bossSpeciesId, bossStage),
    };
    state.encounter.foe.name = `${zone.bossName}'s ${state.encounter.foe.name}`;
    setLog(`Boss sighted in ${zone.region}! ${state.encounter.foe.name} appears.`);
  } else {
    const wildSpeciesId = 1 + Math.floor(Math.random() * SPECIES.length);
    const wildStage = Math.min(3, Math.floor(zone.level / 9));
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

  const heroHit = Math.max(3, hero.power + Math.floor(Math.random() * 6) - 1);
  foe.hp -= heroHit;

  if (foe.hp <= 0) {
    hero.exp += 18 + foe.stage * 10;
    setLog(`${hero.name} dealt ${heroHit} and defeated ${foe.name}!`);
    if (state.encounter.type === "boss") {
      state.defeatedBosses.add(state.encounter.zone.bossId);
    }
    state.encounter = null;
    postTurnUpdate();
    return;
  }

  const foeHit = Math.max(2, foe.power + Math.floor(Math.random() * 4) - 2);
  hero.hp -= foeHit;
  setLog(`${hero.name} dealt ${heroHit}. ${foe.name} hit back for ${foeHit}.`);

  if (hero.hp <= 0) {
    hero.hp = 1;
    setLog(`${hero.name} almost fainted, but held on with 1 HP.`);
  }

  postTurnUpdate();
}

function onCapture() {
  if (!state.encounter || state.encounter.type !== "wild") {
    setLog("You can only capture during wild encounters.");
    return;
  }

  const foe = state.encounter.foe;
  const species = SPECIES[foe.speciesId - 1];
  const hpFactor = 1 - foe.hp / foe.maxHp;
  const chance = species.captureRate + hpFactor * 0.45;

  if (Math.random() < chance) {
    state.party.push(makeMonster(foe.speciesId, foe.stage));
    setLog(`Captured ${foe.name}! Your roster now has ${state.party.length} Mythimon.`);
    state.encounter = null;
  } else {
    setLog(`Capture failed! ${foe.name} resisted.`);
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

function drawBattlefield() {
  const ctx = refs.canvas.getContext("2d");
  ctx.clearRect(0, 0, refs.canvas.width, refs.canvas.height);

  ctx.fillStyle = "#0f1737";
  ctx.fillRect(0, 0, refs.canvas.width, refs.canvas.height);
  ctx.fillStyle = "#223c67";
  ctx.beginPath();
  ctx.ellipse(120, 200, 95, 32, 0, 0, Math.PI * 2);
  ctx.ellipse(305, 95, 95, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  const hero = getActive();
  if (hero) {
    drawSprite(ctx, hero.speciesId, hero.stage, 78, 156, 82);
    ctx.fillStyle = "#fff";
    ctx.fillText(`${hero.name} HP ${Math.max(hero.hp, 0)}/${hero.maxHp}`, 28, 245);
  }

  if (state.encounter) {
    drawSprite(ctx, state.encounter.foe.speciesId, state.encounter.foe.stage, 264, 34, 82);
    ctx.fillStyle = "#fff";
    ctx.fillText(`${state.encounter.foe.name} HP ${Math.max(state.encounter.foe.hp, 0)}/${state.encounter.foe.maxHp}`, 165, 24);
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
