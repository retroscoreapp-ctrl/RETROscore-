// app2.js
// RETROscore Teletext UI Layer (safe add-on, does NOT replace app.js)

document.addEventListener("DOMContentLoaded", () => {
  console.log("app2.js loaded safely.");

  // Simple Teletext style injection
  const style = document.createElement("style");
  style.innerHTML = `
    body {
      background: black;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      text-align: center;
    }
    .retro-title {
      font-size: 32px;
      color: #ffe600;
      letter-spacing: 4px;
      margin-top: 20px;
      font-weight: bold;
    }
    .retro-sub {
      font-size: 14px;
      color: #ffe600;
      letter-spacing: 3px;
      margin-bottom: 20px;
    }
    .ribbon {
      width: 100%;
      height: 40px;
      margin: 20px 0;
      background: linear-gradient(
        to bottom,
        #0000ff 0%,
        #0000ff 33%,
        #ff0000 33%,
        #ff0000 66%,
        #00ff00 66%,
        #00ff00 100%
      );
    }
    .section-title {
      font-size: 26px;
      color: #ffe600;
      margin-top: 20px;
      letter-spacing: 2px;
    }
    .small-note {
      color: #ffe600;
      font-size: 14px;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    .match-row {
      font-size: 20px;
      font-family: 'Courier New', monospace;
      white-space: pre;
      margin: 6px 0;
    }
    .red { color: #ff0000; }
    .yellow { color: #ffe600; }
    .green { color: #00ff00; }
  `;
  document.head.appendChild(style);

  // Create layout
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="retro-title">RETROscore</div>
    <div class="retro-sub">WHERE FOOTBALL FEELS RETRO AGAIN</div>

    <div class="ribbon"></div>

    <div class="section-title">LIVE SCORE</div>
    <div class="small-note">ΟΙ ΣΕΛΙΔΕΣ ΑΝΑΝΕΩΝΟΝΤΑΙ ΑΥΤΟΜΑΤΑ</div>

    <div class="match-row">Z789  ANTIK-MOUNI     1-0     <span class="red">90</span></div>
    <div class="match-row">Z792  OUNIO-KOLO      0-1     <span class="yellow">78</span></div>
    <div class="match-row">Z795  SOUNIO-NAPO     0-0     <span class="green">78</span></div>
    <div class="match-row">Z797  PATRO-INTZI     0-0     <span class="green">48</span></div>

    <br><br>
    <div style="background:#ff0000; padding:10px; color:#ffe600; font-size:20px;">
      ΟΛΑ ΤΑ ΓΚΟΛ ΣΤΟ ΚΙΝΗΤΟ ΣΟΥ LIVE!
    </div>

    <br>
    <div style="display:flex; justify-content:space-around; font-size:22px;">
      <span style="color:#ff0000;">ΠΟΔΟΣΦΟΡ</span>
      <span style="color:#00ff00;">ΑΘΛ. ΕΝΗΜ.</span>
      <span style="color:#00ff00;">ΓΝΩΡΙΜΙΕΣ</span>
    </div>
  `;
  document.body.appendChild(container);
});
