// app_debug.js
console.log("[DEBUG] app_debug.js loaded");

// Simple tab click logger
document.addEventListener("DOMContentLoaded", () => {
    console.log("[DEBUG] DOM Loaded");

    const tabs = document.querySelectorAll(".nav-item");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            console.log("[DEBUG] Tab clicked:", tab.dataset.tab);
        });
    });

    // API test
    const API_KEY = "cb2d16c85426c896fa8f25d7fc8833c5";
    console.log("[DEBUG] Using API Key:", API_KEY);

    fetch("https://v3.football.api-sports.io/fixtures?live=all", {
        method: "GET",
        headers: {
            "x-apisports-key": API_KEY,
            "x-rapidapi-host": "v3.football.api-sports.io"
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("[DEBUG] API Response:", data);
    })
    .catch(err => console.error("[DEBUG] API ERROR:", err));
});
