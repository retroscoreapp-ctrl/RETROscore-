// ----------------------
// BASIC TAB NAVIGATION
// ----------------------
function switchTab(tab) {
    const pages = {
        live: document.getElementById("matches"),
        today: document.getElementById("matches"),
        settings: document.getElementById("settings-panel")
    };

    document.getElementById("matches").style.display = "none";
    document.getElementById("settings-panel").style.display = "none";

    const title = document.getElementById("section-title");
    if (tab === "live") title.innerText = "LIVE ΑΓΩΝΕΣ";
    if (tab === "today") title.innerText = "ΣΗΜΕΡΙΝΟ ΠΡΟΓΡΑΜΜΑ";
    if (tab === "settings") title.innerText = "ΡΥΘΜΙΣΕΙΣ";

    if (tab === "settings") {
        document.getElementById("settings-panel").style.display = "block";
    } else {
        document.getElementById("matches").style.display = "block";
    }

    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.classList.remove("active");
        btn.classList.add("inactive");
        if (btn.dataset.tab === tab) {
            btn.classList.add("active");
            btn.classList.remove("inactive");
        }
    });

    if (tab === "live") loadLiveMatches();
    if (tab === "today") loadTodayMatches();
}

const API_KEY = "b3aa34afa3833358e6fb8cec2a30bac6";
const BASE = "https://v3.football.api-sports.io";

async function api(endpoint) {
    const res = await fetch(BASE + endpoint, {
        headers: {
            "x-apisports-key": API_KEY,
            "x-rapidapi-host": "v3.football.api-sports.io"
        }
    });

    const json = await res.json();
    return json.response || [];
}

async function loadLiveMatches() {
    const matchesBox = document.getElementById("matches");
    matchesBox.innerHTML = "<div>Φόρτωμα LIVE...</div>";

    const matches = await api("/fixtures?live=all");

    if (!matches.length) {
        matchesBox.innerHTML = "<div>Δεν υπάρχουν LIVE αγώνες.</div>";
        return;
    }

    matchesBox.innerHTML = matches.map(m => `
        <div class="match-card">
            <div>${m.teams.home.name} ${m.goals.home} - ${m.goals.away} ${m.teams.away.name}</div>
        </div>
    `).join("");
}

async function loadTodayMatches() {
    const today = new Date().toISOString().split("T")[0];
    const matchesBox = document.getElementById("matches");
    matchesBox.innerHTML = "<div>Φόρτωμα...</div>";

    const matches = await api(`/fixtures?date=${today}`);

    if (!matches.length) {
        matchesBox.innerHTML = "<div>Δεν υπάρχουν αγώνες σήμερα.</div>";
        return;
    }

    matchesBox.innerHTML = matches.map(m => `
        <div class="match-card">
            <div>${m.teams.home.name} vs ${m.teams.away.name}</div>
            <div>${m.fixture.date.slice(11, 16)}</div>
        </div>
    `).join("");
}

document.getElementById("toggle-font").addEventListener("click", () => {
    const t = document.getElementById("toggle-font");

    if (t.innerText === "OFF") {
        t.innerText = "ON";
        t.classList.add("on");
        document.body.style.fontSize = "20px";
    } else {
        t.innerText = "OFF";
        t.classList.remove("on");
        document.body.style.fontSize = "14px";
    }
});

window.onload = () => {
    switchTab("today");

    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            switchTab(btn.dataset.tab);
        });
    });
};
