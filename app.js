// ==========================
// RETROscore – Live Matches
// ==========================

const API_KEY = "23dcd3335da98a4bcadd30f8afdf7b60";

// ΣΗΜΕΡΙΝΗ ΗΜΕΡΟΜΗΝΙΑ YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];

// Element όπου θα μπαίνουν οι αγώνες
const matchesContainer = document.getElementById("matches");

// API endpoint του API-FOOTBALL
const API_URL = `https://v3.football.api-sports.io/fixtures?date=${today}`;

// ----------------------------
//   ΦΕΡΝΕΙ ΑΓΩΝΕΣ ΣΗΜΕΡΑ
// ----------------------------
async function loadMatches() {
    matchesContainer.innerHTML = "<div class='loading'>Φόρτωση...</div>";

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "x-apisports-key": API_KEY,
                "x-rapidapi-host": "v3.football.api-sports.io"
            }
        });

        const data = await response.json();

        if (!data.response || data.response.length === 0) {
            matchesContainer.innerHTML = "<div class='empty'>Δεν υπάρχουν αγώνες σήμερα.</div>";
            return;
        }

        displayMatches(data.response);

    } catch (err) {
        matchesContainer.innerHTML = "<div class='error'>Σφάλμα φόρτωσης!</div>";
        console.error("API ERROR:", err);
    }
}

// ----------------------------
//   ΕΜΦΑΝΙΣΗ ΑΓΩΝΩΝ ΣΤΟ HTML
// ----------------------------
function displayMatches(list) {
    matchesContainer.innerHTML = "";

    list.forEach(match => {
        const league = match.league.name;
        const home = match.teams.home.name;
        const away = match.teams.away.name;
        const homeLogo = match.teams.home.logo;
        const awayLogo = match.teams.away.logo;

        const status = match.fixture.status.short;  
        const time = match.fixture.date.substring(11, 16);
        const goalsHome = match.goals.home ?? "-";
        const goalsAway = match.goals.away ?? "-";

        const row = document.createElement("div");
        row.className = "match-row";

        row.innerHTML = `
            <div class="match-league">${league}</div>

            <div class="match-team">
                <img src="${homeLogo}" class="team-logo">
                <span>${home}</span>
            </div>

            <div class="match-score">
                <span>${goalsHome} - ${goalsAway}</span>
            </div>

            <div class="match-team">
                <span>${away}</span>
                <img src="${awayLogo}" class="team-logo">
            </div>

            <div class="match-status">${status === "NS" ? time : status}</div>
        `;

        matchesContainer.appendChild(row);
    });
}

// ----------------------------
//   AUTO REFRESH κάθε 60'' 
// ----------------------------
loadMatches();
setInterval(loadMatches, 60000);
