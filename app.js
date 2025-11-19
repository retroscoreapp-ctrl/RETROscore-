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
