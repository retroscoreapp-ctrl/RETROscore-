  // --- RETROscore Teletext Version ---
// ΒΑΣΙΚΟ app.js – Κομμάτι 1

const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const API_URL = "https://v3.football.api-sports.io/";

// Ρυθμίσεις βασικών διοργανώσεων
const BIG_LEAGUES = [
  39, 140, 135, 61, 78, 2, 3, 848, 9, 10, 11, 13
];

// Φέρνουμε LIVE αγώνες
async function loadLive() {
  const container = document.getElementById("live-matches");
  container.innerHTML = "Φόρτωση...";

  try {
    const res = await fetch(API_URL + "fixtures?live=all", {
      headers: {
        "x-apisports-key": API_KEY
      }
    });

    const data = await res.json();
    if (!data.response || data.response.length === 0) {
      container.innerHTML = "Δεν υπάρχουν live αγώνες.";
      return;
    }

    renderMatches(data.response);
  } catch (err) {
    container.innerHTML = "Σφάλμα φόρτωσης.";
    console.error(err);
  }
}
        // --- ΚΟΜΜΑΤΙ 2: TELEVIDEO ΠΙΝΑΚΑΣ ---

function renderMatches(matches) {
  const container = document.getElementById("live-matches");
  container.innerHTML = "";

  matches.forEach((m, index) => {
    const code = 2700 + index; // Teletext style ID
    const home = m.teams.home.name;
    const away = m.teams.away.name;
    const score = `${m.goals.home} - ${m.goals.away}`;

    let minute = "---";
    let color = "#ccc";

    if (m.fixture.status.short === "1H" || m.fixture.status.short === "2H") {
      minute = m.fixture.status.elapsed + "'";
      color = m.fixture.status.elapsed >= 75 ? "#f00" : "#0f0";
    }

    if (m.fixture.status.short === "HT") {
      minute = "ΗΤ";
      color = "#ff0";
    }

    if (m.fixture.status.short === "FT") {
      minute = "ΤΕΛ";
      color = "#888";
    }

    const row = document.createElement("div");
    row.className = "match-row";
    row.innerHTML = `
      <div class="code" style="color:#0ff">${code}</div>
      <div class="teams">${home} - ${away}</div>
      <div class="score">${score}</div>
      <div class="minute" style="color:${color}">${minute}</div>
    `;

    container.appendChild(row);
  });
}
