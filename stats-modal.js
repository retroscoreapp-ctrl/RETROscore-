
// stats-modal.js
console.log("Stats modal addon loaded");

function openStatsModal(html) {
  const modal = document.getElementById("stats-modal");
  const body = document.getElementById("stats-body");
  body.innerHTML = html;
  modal.classList.add("active");
}

function closeStatsModal() {
  document.getElementById("stats-modal").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("stats-modal")) {
    const div = document.createElement("div");
    div.id = "stats-modal";
    div.innerHTML = `
      <div class="stats-box">
        <div class="stats-close" onclick="closeStatsModal()">X</div>
        <div id="stats-body">LOADING...</div>
      </div>
    `;
    document.body.appendChild(div);
  }
});

// Hook into clicking matches
document.addEventListener("click", async (e) => {
  const row = e.target.closest(".match-row");
  if (!row || row.classList.contains("header")) return;

  const children = row.children;
  const homeAway = children[1].innerText;
  const score = children[2].innerText;

  // Temporary fake stats (safe)
  const html = `
    <div class="stat-title">${homeAway}</div>
    <div class="stat-row"><span>ΣΚΟΡ</span><span>${score}</span></div>
    <div class="stat-row"><span>ΚΑΤΟΧΗ</span><span>51% - 49%</span></div>
    <div class="stat-row"><span>ΣΟΥΤ</span><span>12 - 9</span></div>
    <div class="stat-row"><span>ΚΟΡΝΕΡ</span><span>5 - 3</span></div>
    <div class="stat-row"><span>ΚΑΡΤΕΣ</span><span>1 - 2</span></div>
  `;
  openStatsModal(html);
});
