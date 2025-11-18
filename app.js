// RETROscore - Teletext LIVE με Στατιστικά (Ελληνική έκδοση UI)

// === CONFIG ===
const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const FIXTURES_URL = "https://v3.football.api-sports.io/fixtures";

// === ELEMENTS ===
const matchesDiv = document.getElementById("matches");
const settingsDiv = document.getElementById("settings-panel");
const titleDiv = document.getElementById("section-title");

// === Μετάφραση status αγώνα σε ελληνικά ===
const STATUS_MAP_GR = {
    "Not Started": "Δεν ξεκίνησε",
    "First Half": "1ο Ημίχρονο",
    "Halftime": "Ημίχρονο",
    "Second Half": "2ο Ημίχρονο",
    "Extra Time": "Παράταση",
    "Penalty In Progress": "Πέναλτι",
    "Match Finished": "Τελικό",
    "Finished": "Τελικό",
    "Suspended": "Διακόπηκε",
    "Postponed": "Αναβλήθηκε",
    "Canceled": "Ακυρώθηκε"
};

function translateStatus(longStatus) {
    if (!longStatus) return "";
    return STATUS_MAP_GR[longStatus] || longStatus;
}

// === Φόρτωση LIVE αγώνων ===
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
            const statusText = translateStatus(m.fixture.status.long);
            html += `
                <div class="match-item" onclick="toggleStats(${id})">
                    <div class="league">${m.league.name}</div>
                    <div class="teams">${m.teams.home.name} - ${m.teams.away.name}</div>
                    <div class="score">${m.goals.home ?? "-"} : ${m.goals.away ?? "-"}</div>
                    <div class="status">${statusText}</div>
                    <div id="stats-${id}" class="stats-box" style="display:none;"></div>
                </div>
            `;
        });

        matchesDiv.innerHTML = html;

    } catch (err) {
        matchesDiv.innerHTML = "<div>Σφάλμα κατά τη φόρτωση των αγώνων.</div>";
    }
}

// === Άνοιγμα / κλείσιμο στατιστικών για έναν αγώνα ===
async function toggleStats(id) {
    const box = document.getElementById("stats-" + id);

    // Αν είναι ανοιχτό, κλείσ' το
    if (box.style.display === "block") {
        box.style.display = "none";
        return;
    }

    // Κλείσε όλα τα υπόλοιπα (σαν accordion)
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

        const home = match.teams.home.name;
        const away = match.teams.away.name;

        // Βοηθητικό για εύρεση στατιστικού
        function getStat(teamName, type) {
            const t = stats.find(s => s.team && s.team.name === teamName);
            if (!t) return "-";
            const st = t.statistics.find(x => x.type === type);
            return st && st.value !== null ? st.value : "-";
        }

        // Γκολ / σκόρερ
        let goalsList = events
            .filter(e => e.type === "Goal")
            .map(e => {
                const player = e.player && e.player.name ? e.player.name : "Άγνωστος";
                const minute = e.time && e.time.elapsed ? e.time.elapsed : "?";
                return `• ${player} ${minute}'`;
            })
            .join("<br>");

        if (!goalsList) {
            goalsList = "• Δεν υπάρχουν γκολ";
        }

        // Βασικά στατιστικά
        const possession = `${getStat(home, "Ball Possession")} - ${getStat(away, "Ball Possession")}`;
        const shots = `${getStat(home, "Total Shots")} - ${getStat(away, "Total Shots")}`;
        const shotsOn = `${getStat(home, "Shots on Goal")} - ${getStat(away, "Shots on Goal")}`;
        const corners = `${getStat(home, "Corner Kicks")} - ${getStat(away, "Corner Kicks")}`;
        const yellowCards = `${getStat(home, "Yellow Cards")} - ${getStat(away, "Yellow Cards")}`;

        const referee = match.fixture.referee || "Άγνωστος";
        const stadium = (match.fixture.venue && match.fixture.venue.name) || "Άγνωστο";

        box.innerHTML = `
            <div class="tele-box">
            ─────────────────────────────<br>
            <b>ΣΚΟΡΕΡ</b><br>
            ${goalsList}<br><br>

            <b>ΣΤΑΤΙΣΤΙΚΑ</b><br>
            Κατοχή μπάλας: ${possession}<br>
            Συνολικά σουτ: ${shots}<br>
            Σουτ στην εστία: ${shotsOn}<br>
            Κόρνερ: ${corners}<br>
            Κίτρινες κάρτες: ${yellowCards}<br><br>

            <b>ΠΛΗΡΟΦΟΡΙΕΣ ΑΓΩΝΑ</b><br>
            Διαιτητής: ${referee}<br>
            Γήπεδο: ${stadium}<br>
            ─────────────────────────────
            </div>
        `;

    } catch (err) {
        box.innerHTML = "<div>Σφάλμα στατιστικών.</div>";
    }
}

// === Tabs ===
function setupTabs() {
    document.querySelectorAll(".nav-item").forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll(".nav-item").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const tabId = tab.dataset.tab;

            if (tabId === "live") {
                titleDiv.innerText = "LIVE ΑΓΩΝΕΣ";
                settingsDiv.style.display = "none";
                matchesDiv.style.display = "block";
                loadLive();
            }

            if (tabId === "today") {
                titleDiv.innerText = "ΣΗΜΕΡΑ";
                settingsDiv.style.display = "none";
                matchesDiv.style.display = "block";
                matchesDiv.innerHTML = "<div>Το σημερινό πρόγραμμα θα προστεθεί σύντομα.</div>";
            }

            if (tabId === "settings") {
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
