// ==============================
// RETROscore DEBUG VERSION
// ==============================

// ---- DEBUG PANEL ----
function debug(msg, type = "log") {
    const panel = document.getElementById("debug-panel");
    if (!panel) return;
    const line = document.createElement("div");
    line.textContent = `[${type.toUpperCase()}] ${msg}`;
    if (type === "error") line.style.color = "#ff4444";
    panel.appendChild(line);
}

// Create the debug panel
window.addEventListener("load", () => {
    const panel = document.createElement("div");
    panel.id = "debug-panel";
    panel.style.position = "fixed";
    panel.style.bottom = "0";
    panel.style.left = "0";
    panel.style.width = "100%";
    panel.style.height = "150px";
    panel.style.overflowY = "auto";
    panel.style.background = "rgba(0,0,0,0.85)";
    panel.style.color = "lime";
    panel.style.fontSize = "12px";
    panel.style.fontFamily = "monospace";
    panel.style.padding = "5px";
    panel.style.zIndex = "99999";
    panel.style.borderTop = "2px solid #444";
    document.body.appendChild(panel);

    debug("DEBUG PANEL ACTIVE");
    debug("app.js loaded");
});

// ---- MAIN APP ----

const API_KEY = "23dcd3335da98a4bcadd30f8afdf7b60";  // Your key
const API_BASE = "https://v3.football.api-sports.io/";

// Example function: fetch today matches
async function loadTodayMatches() {
    debug("Fetching today matches...");

    const today = new Date().toISOString().split("T")[0];

    try {
        const response = await fetch(`${API_BASE}fixtures?date=${today}`, {
            headers: {
                "x-apisports-key": API_KEY
            }
        });

        debug("API call sent");

        if (!response.ok) {
            debug("API error: " + response.status, "error");
            return;
        }

        const data = await response.json();
        debug("API response received");

        if (!data.response) {
            debug("Unexpected API structure!", "error");
            debug(JSON.stringify(data));
            return;
        }

        debug("Matches found: " + data.response.length);
    }
    catch (err) {
        debug("JS error: " + err.message, "error");
    }
}

window.addEventListener("load", () => {
    debug("Running loadTodayMatches()");
    loadTodayMatches();
});
