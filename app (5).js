
// RETROscore - Teletext LIVE with Stats (Inline Expand)

// === CONFIG ===
const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const FIXTURES_URL = "https://v3.football.api-sports.io/fixtures";

// === ELEMENTS ===
const matchesDiv = document.getElementById("matches");
const settingsDiv = document.getElementById("settings-panel");
const titleDiv = document.getElementById("section-title");

// === LOAD LIVE MATCHES ===
async function loadLive() {
    matchesDiv.innerHTML = "<div>Φόρτωση LIVE αγώνων...</div>";

    try {
        const res = await fetch(FIXTURES_URL + "?live=all", {
            headers: { "x-apisports-key": API_KEY }
        });
        const data = await res.json();
        const list = data.response || [];

        if (list.length === 0) {
            matchesDiv.innerHTML = "<div>Δεν υπάρχουν LIVE αγώνες αυτή τη στιγμή.</div>";
            return;
        }

        let html = "";
        list.forEach((m) => {
            const id = m.fixture.id;
            html += `
                <div class="match-item" onclick="toggleStats(${id})">
                    <div class="league">${m.league.name}</div>
                    <div class="teams">${m.teams.home.name} - ${m.teams.away.name}</div>
                    <div class="score">${m.goals.home ?? "-"} : ${m.goals.away ?? "-"}</div>
                    <div class="status">${m.fixture.status.long}</div>
                    <div id="stats-${id}" class="stats-box" style="display:none;"></div>
                </div>
            `;
        });

        matchesDiv.innerHTML = html;

    } catch (err) {
        matchesDiv.innerHTML = "<div>Σφάλμα κατά τη φόρτωση των αγώνων.</div>";
    }
}

// === TOGGLE STATS BOX ===
async function toggleStats(id) {
    const box = document.getElementById("stats-" + id);

    // Close if open
    if (box.style.display === "block") {
        box.style.display = "none";
        return;
    }

    // Close all others (accordion behavior)
    document.querySelectorAll(".stats-box").forEach(b => b.style.display = "none");

    box.innerHTML = "<div>Φόρτωση στατιστικών...</div>";
    box.style.display = "block";

    try {
        const res = await fetch(FIXTURES_URL + "?id=" + id, {
            headers: { "x-apisports-key": API_KEY }
        });
        const data = await res.json();
        const match = data.response[0];

        const stats = match.statistics || [];
        const events = match.events || [];

        let home = match.teams.home.name;
        let away = match.teams.away.name;

        // Extract basic stats
        function findStat(team, type) {
            const t = stats.find(s => s.team.name === team);
            if (!t) return "-";
            const st = t.statistics.find(x => x.type === type);
            return st ? st.value : "-";
        }

        let goalsList = events
            .filter(e => e.type === "Goal")
            .map(e => `• ${e.player.name} ${e.time.elapsed}'`)
            .join("<br>");

        if (goalsList === "") goalsList = "• Δεν υπάρχουν γκολ";

        let possession = `${findStat(home, "Ball Possession")} - ${findStat(away, "Ball Possession")}`;
        let shots = `${findStat(home, "Total Shots")} - ${findStat(away, "Total Shots")}`;
        let shotsOn = `${findStat(home, "Shots on Goal")} - ${findStat(away, "Shots on Goal")}`;
        let corners = `${findStat(home, "Corner Kicks")} - ${findStat(away, "Corner Kicks")}`;
        let cards = `${findStat(home, "Yellow Cards")} - ${findStat(away, "Yellow Cards")}`;

        let referee = match.fixture.referee || "Άγνωστος";
        let stadium = match.fixture.venue.name || "Άγνωστο";

        box.innerHTML = `
            <div class="tele-box">
            ────────────────────────────<br>
            <b>GOALS</b><br>
            ${goalsList}<br><br>

            <b>STATS</b><br>
            Possession: ${possession}<br>
            Shots: ${shots}<br>
            Shots on target: ${shotsOn}<br>
            Corners: ${corners}<br>
            Cards: ${cards}<br><br>

            <b>INFO</b><br>
            Referee: ${referee}<br>
            Stadium: ${stadium}<br>
            ────────────────────────────
            </div>
        `;

    } catch (err) {
        box.innerHTML = "<div>Σφάλμα στατιστικών.</div>";
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
