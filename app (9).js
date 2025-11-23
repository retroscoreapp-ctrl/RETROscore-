// RETROscore teletext-style frontend
// Version 1.2 – multi-page LIVE view + keyboard + on-screen controls
//
// Drop this file in as `app.js`. It expects an element with id="live-matches"
// in index.html and will render LIVE scores in teletext style.
//
// API: api-football (api-sports.io)
//
// 1. ======= BASIC CONFIG =========
const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const API_BASE = "https://v3.football.api-sports.io";
const TIMEZONE = "Europe/Athens";

// Πόσοι αγώνες ανά σελίδα
const MATCHES_PER_PAGE = 10;

// 2. ======= DOM HELPERS =========
function qs(sel, parent = document) {
  return parent.querySelector(sel);
}

function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// 3. ======= GLOBAL STATE =========
let allLiveMatches = [];
let currentPage = 0;
let autoRefreshTimer = null;

// 4. ======= API CALLS =========
async function apiFetch(path, params = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": API_KEY,
      "x-rapidapi-host": "v3.football.api-sports.io",
    },
  });

  if (!res.ok) {
    throw new Error("API error: " + res.status + " " + res.statusText);
  }

  const data = await res.json();
  if (!data || !Array.isArray(data.response)) {
    throw new Error("Άκυρη απάντηση API");
  }
  return data.response;
}

async function loadLiveMatches() {
  const container = qs("#live-matches");
  if (!container) return;

  try {
    container.textContent = "ΦΟΡΤΩΣΗ LIVE ΑΓΩΝΩΝ...";

    const response = await apiFetch("/fixtures", {
      live: "all",
      timezone: TIMEZONE,
    });

    allLiveMatches = response.map(wrapFixtureForUI);
    if (allLiveMatches.length === 0) {
      container.innerHTML = "<div>ΔΕΝ ΥΠΑΡΧΟΥΝ LIVE ΑΓΩΝΕΣ ΤΩΡΑ</div>";
      return;
    }

    currentPage = 0;
    renderCurrentPage();
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<div>ΣΦΑΛΜΑ ΣΥΝΔΕΣΗΣ ΜΕ ΤΟ LIVE ΚΕΝΤΡΟ…</div>";
  }
}

// 5. ======= TRANSFORM FIXTURE =========
function wrapFixtureForUI(fix) {
  const home = fix.teams?.home;
  const away = fix.teams?.away;
  const goals = fix.goals || {};
  const statusShort = fix.fixture?.status?.short || "";
  const statusLong = fix.fixture?.status?.long || "";
  const elapsed = fix.fixture?.status?.elapsed;

  let score = `${goals.home ?? 0} - ${goals.away ?? 0}`;

  let minuteText = "";
  if (statusShort === "HT") {
    minuteText = "HT";
  } else if (statusShort === "FT") {
    minuteText = "FT";
  } else if (elapsed != null) {
    minuteText = `${elapsed}'`;
  } else {
    minuteText = statusShort || statusLong || "";
  }

  const rawId = String(fix.fixture?.id ?? 0);
  const code = rawId.slice(-4).padStart(4, "0");

  const leagueName = fix.league?.name || "";
  const country = fix.league?.country || "";

  return {
    id: fix.fixture?.id,
    code,
    homeName: home?.name || "",
    awayName: away?.name || "",
    score,
    minuteText,
    leagueName,
    country,
  };
}

// 6. ======= RENDER LIVE PAGE =========
function buildMatchRow(match) {
  const row = createEl("div", "match-row");

  const code = createEl("div", "code", match.code);
  const teams = createEl(
    "div",
    "teams",
    `${match.homeName} - ${match.awayName}`
  );
  const score = createEl("div", "score", match.score);
  const minute = createEl("div", "minute", match.minuteText);

  row.appendChild(code);
  row.appendChild(teams);
  row.appendChild(score);
  row.appendChild(minute);

  row.addEventListener("click", () => {
    showMatchDetails(match);
  });

  return row;
}

function renderCurrentPage() {
  const container = qs("#live-matches");
  if (!container) return;

  container.innerHTML = "";

  const headerRow = createEl("div", "match-row header-row");
  headerRow.appendChild(createEl("div", "code", "ΚΩΔ"));
  headerRow.appendChild(createEl("div", "teams", "ΟΜΑΔΑ - ΟΜΑΔΑ"));
  headerRow.appendChild(createEl("div", "score", "ΣΚΟΡ"));
  headerRow.appendChild(createEl("div", "minute", "ΛΕΠΤΟ"));
  container.appendChild(headerRow);

  const start = currentPage * MATCHES_PER_PAGE;
  const end = start + MATCHES_PER_PAGE;
  const pageMatches = allLiveMatches.slice(start, end);

  pageMatches.forEach((m) => container.appendChild(buildMatchRow(m)));

  const totalPages = Math.max(
    1,
    Math.ceil(allLiveMatches.length / MATCHES_PER_PAGE)
  );

  const footer = createEl(
    "div",
    "page-footer",
    `ΣΕΛΙΔΑ ${currentPage + 1}/${totalPages}  •  ΣΥΝΟΛΟ ΑΓΩΝΩΝ: ${
      allLiveMatches.length
    }`
  );
  container.appendChild(footer);

  // on-screen controls (buttons) + hints for 1 / 2 / C
  const controls = createEl("div", "page-controls");

  const btnPrev = createEl("span", "page-btn", "1 ΠΡΟΗΓ. ΣΕΛΙΔΑ");
  const btnNext = createEl("span", "page-btn", "2 ΕΠΟΜΕΝΗ ΣΕΛΙΔΑ");
  const btnRefresh = createEl("span", "page-btn", "C ΑΝΑΝΕΩΣΗ LIVE");

  btnPrev.onclick = () => prevPage();
  btnNext.onclick = () => nextPage();
  btnRefresh.onclick = () => loadLiveMatches();

  // basic inline styling so δουλεύει χωρίς αλλαγές στο index.css
  controls.style.marginTop = "4px";
  controls.style.fontSize = "12px";

  [btnPrev, btnNext, btnRefresh].forEach((b, idx) => {
    b.style.marginRight = idx === 2 ? "0" : "12px";
    b.style.cursor = "pointer";
    b.style.color = "#0ff";
  });

  controls.appendChild(btnPrev);
  controls.appendChild(btnNext);
  controls.appendChild(btnRefresh);

  container.appendChild(controls);
}

// 7. ======= KEYBOARD & AUTO PAGE ========
function setupKeyboardNav() {
  document.addEventListener("keydown", (ev) => {
    if (allLiveMatches.length === 0) return;

    if (ev.key === "ArrowRight" || ev.key === "PageDown") {
      nextPage();
    } else if (ev.key === "ArrowLeft" || ev.key === "PageUp") {
      prevPage();
    } else if (ev.key === "r" || ev.key === "R" || ev.key === "c" || ev.key === "C") {
      loadLiveMatches();
    } else if (ev.key === "1") {
      prevPage();
    } else if (ev.key === "2") {
      nextPage();
    }
  });
}

function nextPage() {
  const totalPages = Math.max(
    1,
    Math.ceil(allLiveMatches.length / MATCHES_PER_PAGE)
  );
  currentPage = (currentPage + 1) % totalPages;
  renderCurrentPage();
}

function prevPage() {
  const totalPages = Math.max(
    1,
    Math.ceil(allLiveMatches.length / MATCHES_PER_PAGE)
  );
  currentPage = (currentPage - 1 + totalPages) % totalPages;
  renderCurrentPage();
}

function startAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => {
    loadLiveMatches();
  }, 25000);
}

// 8. ======= MATCH DETAILS (απλό popup για τώρα) =========
function showMatchDetails(match) {
  const msg =
    `${match.homeName} - ${match.awayName}\n` +
    `ΛΙΓΚΑ: ${match.leagueName} (${match.country})\n` +
    `ΣΚΟΡ: ${match.score}  •  ${match.minuteText}`;
  alert(msg);
}

// 9. ======= BOOTSTRAP =========
window.addEventListener("load", () => {
  setupKeyboardNav();
  loadLiveMatches();
  startAutoRefresh();
});
