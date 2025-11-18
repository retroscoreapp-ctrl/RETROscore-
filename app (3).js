
const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const BASE_URL = "https://v3.football.api-sports.io";

async function fetchLeagues() {
    try {
        const res = await fetch(BASE_URL + "/leagues", {
            method: "GET",
            headers: { "x-apisports-key": API_KEY }
        });
        const data = await res.json();
        console.log("LEAGUES:", data);
        renderLeagues(data.response);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

function renderLeagues(list) {
    const box = document.getElementById("matches");
    if (!box) return;
    box.innerHTML = "";
    list.forEach(lg => {
        const div = document.createElement("div");
        div.className = "match-item";
        div.innerHTML = `<b>${lg.league.name}</b> — ${lg.country.name}`;
        box.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchLeagues();
});
