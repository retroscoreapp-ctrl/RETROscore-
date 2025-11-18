// RETROscore - app.js (Production)

const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const API_BASE = "https://v3.football.api-sports.io";
const TIMEZONE = "Europe/Athens";

// DOM references
const matchesContainer = document.getElementById("matches");
const sectionTitleEl = document.getElementById("section-title");
const navItems = document.querySelectorAll(".nav-item");
const settingsPanel = document.getElementById("settings-panel");
const toggleFontBtn = document.getElementById("toggle-font");

// Format time
function formatTime(dateStr) {
  try {
    const d = new Date(dateStr);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  } catch {
    return "-";
  }
}

// Clear match list
function clearMatches() {
  matchesContainer.innerHTML = "";
}

// Show simple message
function showMessage(msg) {
  clearMatches();
  const div = document.createElement("div");
  div.className = "match-row";
  div.textContent = msg;
  matchesContainer.appendChild(div);
}

// Create one match row
function renderMatch(m) {
  const row = document.createElement("div");
  row.className = "match-row";

  const minute =
    m.fixture.status.elapsed != null
      ? `${m.fixture.status.elapsed}'`
      : m.fixture.status.long || "-";

  row.innerHTML = `
    <div class="league-badge">${m.league.name}</div>
    <div class="teams-line">
      <div class="team home">${m.teams.home.name}</div>
      <div class="score-big">${m.goals.home ?? "-"} - ${m.goals.away ?? "-"}</div>
      <div class="team away">${m.teams.away.name}</div>
    </div>
    <div class="minute-chip">${minute}</div>
    <div class="date-time">${formatTime(m.fixture.date)}</div>
  `;

  matchesContainer.appendChild(row);
}

// Fetch matches (live or today)
async function fetchMatches(mode) {
  clearMatches();
  showMessage("Φόρτωση αγώνων...");

  let url;

  if (mode === "live") {
    url = `${API_BASE}/fixtures?live=all&timezone=${encodeURIComponent(TIMEZONE)}`;
  } else {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    url = `${API_BASE}/fixtures?date=${dateStr}&timezone=${encodeURIComponent(TIMEZONE)}`;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY,
        accept: "application/json",
      },
    });

    if (!res.ok) {
      showMessage(`Σφάλμα API (${res.status}).`);
      return;
    }

    const data = await res.json();
    const list = data.response || [];

    if (!list.length) {
      if (mode === "live") {
        showMessage("Δεν υπάρχουν LIVE αγώνες αυτή τη στιγμή.");
      } else {
        showMessage("Δεν υπάρχουν αγώνες σήμερα.");
      }
      return;
    }

    clearMatches();
    list.forEach(renderMatch);
  } catch {
    showMessage("Πρόβλημα σύνδεσης. Προσπάθησε ξανά.");
  }
}

// Switch tabs
function setActiveTab(tab) {
  navItems.forEach((item) => {
    const t = item.getAttribute("data-tab");
    if (t === tab) {
      item.classList.add("active");
      item.classList.remove("inactive");
    } else {
      item.classList.remove("active");
      item.classList.add("inactive");
    }
  });

  if (tab === "settings") {
    sectionTitleEl.textContent = "ΡΥΘΜΙΣΕΙΣ";
    settingsPanel.style.display = "block";
    clearMatches();
  } else if (tab === "live") {
    sectionTitleEl.textContent = "LIVE ΑΓΩΝΕΣ";
    settingsPanel.style.display = "none";
    fetchMatches("live");
  } else {
    sectionTitleEl.textContent = "ΣΗΜΕΡΙΝΟ ΠΡΟΓΡΑΜΜΑ";
    settingsPanel.style.display = "none";
    fetchMatches("today");
  }
}

// Navigation listeners
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const tab = item.getAttribute("data-tab");
    setActiveTab(tab);
  });
});

// Font size toggle
if (toggleFontBtn) {
  toggleFontBtn.addEventListener("click", () => {
    document.body.classList.toggle("big-font");
    const isOn = document.body.classList.contains("big-font");
    toggleFontBtn.classList.toggle("on", isOn);
    toggleFontBtn.textContent = isOn ? "ON" : "OFF";
  });
}

// Default tab
window.addEventListener("load", () => {
  setActiveTab("today");
});
