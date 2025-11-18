// RETROscore - Teletext LIVE version (Option B)

// === CONFIG ===
const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const API_URL = "https://v3.football.api-sports.io/fixtures";

// === ELEMENTS ===
const matchesDiv = document.getElementById("matches");
const settingsDiv = document.getElementById("settings-panel");
const titleDiv = document.getElementById("section-title");

// === FETCH LIVE MATCHES ===
async function loadLive() {
    matchesDiv.innerHTML = "<div>Φόρτωση LIVE αγώνων...</div>";

    try {
        const res = await fetch(API_URL + "?live=all", {
            headers: { "x-apisports-key": API_KEY }
        });

        const data = await res.json();
        const list = data.response || [];

        if (list.length === 0) {
            matchesDiv.innerHTML = "<div>Δεν υπάρχουν LIVE αγώνες αυτή τη στιγμή.</div>";
            return;
        }

        let html = "";
        list.forEach(m => {
            html += `
                <div class="match-item">
                    <div class="league">${m.league.name}</div>
                    <div class="teams">${m.teams.home.name} - ${m.teams.away.name}</div>
                    <div class="score">${m.goals.home ?? "-"} : ${m.goals.away ?? "-"}</div>
                    <div class="status">${m.fixture.status.long}</div>
                </div>
            `;
        });

        matchesDiv.innerHTML = html;

    } catch (err) {
        matchesDiv.innerHTML = "<div>Σφάλμα κατά τη φόρτωση των αγώνων.</div>";
    }
}

// === TABS ===
function setupTabs() {
    document.querySelectorAll(".nav-item").forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll(".nav-item").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const t = tab.dataset.tab;

            if (t === "live") {
                titleDiv.innerText = "LIVE ΑΓΩΝΕΣ";
                settingsDiv.style.display = "none";
                matchesDiv.style.display = "block";
                loadLive();
            }

            if (t === "today") {
                titleDiv.innerText = "ΣΗΜΕΡΑ";
                settingsDiv.style.display = "none";
                matchesDiv.style.display = "block";
                matchesDiv.innerHTML = "<div>Το σημερινό πρόγραμμα θα προστεθεί σύντομα.</div>";
            }

            if (t === "settings") {
                titleDiv.innerText = "ΡΥΘΜΙΣΕΙΣ";
                matchesDiv.style.display = "none";
                settingsDiv.style.display = "block";
            }
        };
    });
}

// === INIT ===
window.onload = () => {
    setupTabs();
    loadLive();
};
