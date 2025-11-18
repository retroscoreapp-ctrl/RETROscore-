console.log("[DEBUG] app_debug.js loaded");

// -----------------------------
//  API CONFIG
// -----------------------------
const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const API_URL = "https://v3.football.api-sports.io/fixtures";

async function loadTodayMatches() {
    console.log("[DEBUG] Running loadTodayMatches()");

    try {
        const today = new Date().toISOString().split("T")[0];
        console.log("[DEBUG] Fetching matches for date:", today);

        const response = await fetch(`${API_URL}?date=${today}`, {
            headers: { "x-apisports-key": API_KEY }
        });

        console.log("[DEBUG] API call sent");

        const data = await response.json();
        console.log("[DEBUG] API response received:", data);

        if (!data.response || data.response.length === 0) {
            console.log("[DEBUG] No matches found");
            document.getElementById("matches").innerHTML =
                "<div style='color:yellow; padding:10px;'>Δεν υπάρχουν σημερινοί αγώνες.</div>";
            return;
        }

        console.log("[DEBUG] Matches found:", data.response.length);

        let html = "";
        data.response.forEach(match => {
            html += `
                <div class="match">
                    <div>${match.teams.home.name} - ${match.teams.away.name}</div>
                    <div>${match.fixture.status.long}</div>
                </div>
            `;
        });

        document.getElementById("matches").innerHTML = html;

    } catch (error) {
        console.log("[DEBUG] ERROR in loadTodayMatches():", error);
        document.getElementById("matches").innerHTML =
            "<div style='color:red;'>Σφάλμα κατά τη φόρτωση των αγώνων.</div>";
    }
}

function setupTabs() {
    console.log("[DEBUG] Setting up tabs...");

    const tabs = document.querySelectorAll(".nav-item");
    const matches = document.getElementById("matches");
    const settings = document.getElementById("settings-panel");
    const title = document.getElementById("section-title");

    tabs.forEach(tab => {
        tab.onclick = () => {
            console.log("[DEBUG] TAB clicked:", tab.dataset.tab);
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            let selected = tab.dataset.tab;

            if (selected === "live") {
                title.innerText = "LIVE ΑΓΩΝΕΣ";
                settings.style.display = "none";
                matches.style.display = "block";
                loadTodayMatches();
            }

            if (selected === "today") {
                title.innerText = "ΣΗΜΕΡΙΝΟ ΠΡΟΓΡΑΜΜΑ";
                settings.style.display = "none";
                matches.style.display = "block";
                loadTodayMatches();
            }

            if (selected === "settings") {
                title.innerText = "ΡΥΘΜΙΣΕΙΣ";
                matches.style.display = "none";
                settings.style.display = "block";
            }
        };
    });
}

window.onload = () => {
    console.log("[DEBUG] Window loaded");
    setupTabs();
    loadTodayMatches();
};
