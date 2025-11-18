// RETROscore - app.js (Collapsible Leagues, All Competitions)

const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
const API_URL = "https://v3.football.api-sports.io/fixtures";

// Utility
function qs(x){ return document.querySelector(x); }
function qsa(x){ return document.querySelectorAll(x); }

// DOM
const matchesDiv = qs("#matches");
const settingsDiv = qs("#settings-panel");
const titleDiv = qs("#section-title");

// Group matches by league
function groupByLeague(fixtures){
    const map = {};
    fixtures.forEach(f=>{
        const lid = f.league.id;
        if(!map[lid]) map[lid] = { league: f.league, matches: [] };
        map[lid].matches.push(f);
    });
    return Object.values(map).sort((a,b)=> a.league.name.localeCompare(b.league.name));
}

// Render collapsible league groups
function renderGroups(groups){
    matchesDiv.innerHTML = "";
    groups.forEach(g=>{
        const box = document.createElement("div");
        box.className = "league-box";
        box.innerHTML = `
            <div class="league-header">
                <span>${g.league.name}</span>
                <span class="count">(${g.matches.length})</span>
            </div>
            <div class="league-content" style="display:none;"></div>
        `;
        const content = box.querySelector(".league-content");
        g.matches.forEach(m=>{
            const row = document.createElement("div");
            row.className = "match-row-small";
            row.innerHTML = `
                <div>${m.teams.home.name} - ${m.teams.away.name}</div>
                <div>${m.goals.home ?? "-"} : ${m.goals.away ?? "-"}</div>
            `;
            content.appendChild(row);
        });
        box.querySelector(".league-header").onclick = ()=>{
            const d = content.style.display === "none" ? "block" : "none";
            content.style.display = d;
        };
        matchesDiv.appendChild(box);
    });
}

// Fetch Today or Live matches
async function fetchMode(mode){
    matchesDiv.innerHTML = "<div>Φόρτωση...</div>";
    let url;
    if(mode==="live"){
        url = `${API_URL}?live=all`;
    } else {
        const d = new Date().toISOString().slice(0,10);
        url = `${API_URL}?date=${d}`;
    }
    try{
        const res = await fetch(url,{ headers:{ "x-apisports-key":API_KEY }});
        const data = await res.json();
        const list = data.response || [];
        if(list.length===0){
            matchesDiv.innerHTML = "<div>Δεν υπάρχουν αγώνες.</div>";
            return;
        }
        const groups = groupByLeague(list);
        renderGroups(groups);
    }catch(e){
        matchesDiv.innerHTML = "<div>Σφάλμα API.</div>";
    }
}

// Tabs handling
function setupTabs(){
    qsa(".nav-item").forEach(tab=>{
        tab.onclick = ()=>{
            qsa(".nav-item").forEach(t=> t.classList.remove("active"));
            tab.classList.add("active");
            const t = tab.dataset.tab;
            if(t==="live"){ 
                titleDiv.innerText="LIVE ΑΓΩΝΕΣ";
                settingsDiv.style.display="none";
                matchesDiv.style.display="block";
                fetchMode("live");
            }
            if(t==="today"){
                titleDiv.innerText="ΣΗΜΕΡΙΝΟ ΠΡΟΓΡΑΜΜΑ";
                settingsDiv.style.display="none";
                matchesDiv.style.display="block";
                fetchMode("today");
            }
            if(t==="settings"){
                titleDiv.innerText="ΡΥΘΜΙΣΕΙΣ";
                settingsDiv.style.display="block";
                matchesDiv.style.display="none";
            }
        };
    });
}

window.onload = ()=>{
    setupTabs();
    fetchMode("today");
};
