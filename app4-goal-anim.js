
// app4-goal-anim.js
// RETROscore – Teletext 2025 Goal Detection & Animation
// Δεν πειράζει το API. Απλά "διαβάζει" τον πίνακα και όταν δει αλλαγή στο σκορ,
// κάνει flash/pulse τη γραμμή του αγώνα.

(function () {
  const REFRESH_MS = 10000; // κάθε 10 δευτερόλεπτα ελέγχουμε

  // Αποθηκεύουμε τα προηγούμενα σκορ ανά κωδικό αγώνα
  let lastScoresByCode = {};

  function readCurrentRows() {
    const rows = document.querySelectorAll('#live-matches .match-row');
    const data = [];

    rows.forEach(row => {
      const codeEl = row.querySelector('.code');
      const scoreEl = row.querySelector('.score');
      const minuteEl = row.querySelector('.minute');

      if (!codeEl || !scoreEl) return;

      const code = codeEl.textContent.trim();
      const scoreText = scoreEl.textContent.trim();
      const minuteText = minuteEl ? minuteEl.textContent.trim() : "";

      data.push({ row, code, scoreText, minuteText });
    });

    return data;
  }

  function applyGoalAnimations() {
    const rowsData = readCurrentRows();

    rowsData.forEach(({ row, code, scoreText, minuteText }) => {
      const prevScore = lastScoresByCode[code];

      // Αν δεν είχαμε ποτέ τιμή, απλά την αποθηκεύουμε
      if (prevScore === undefined) {
        lastScoresByCode[code] = scoreText;
        return;
      }

      // Αν το σκορ άλλαξε → ΓΚΟΛ!
      if (prevScore !== scoreText) {
        lastScoresByCode[code] = scoreText;

        // Προσθέτουμε κλάση για flash/pulse
        row.classList.add('goal-flash');

        // Αν το λεπτό είναι "κρίσιμο" (90' ή 45') κάνουμε hot flash
        const minuteEl = row.querySelector('.minute');
        if (minuteEl) {
          const cleanMinute = minuteText.replace(/[^0-9]/g, '');
          if (cleanMinute === '90' || cleanMinute === '45') {
            minuteEl.classList.add('minute-hot');
          }
        }

        // Αφαιρούμε το εφέ μετά από λίγο για να μπορεί να ξαναπαιχτεί στο επόμενο γκολ
        setTimeout(() => {
          row.classList.remove('goal-flash');
        }, 1200);
      }
    });
  }

  function initGoalWatcher() {
    const container = document.querySelector('#live-matches');
    if (!container) {
      // Αν δεν βρέθηκε ο πίνακας, ξαναδοκίμασε λίγο αργότερα
      setTimeout(initGoalWatcher, 2000);
      return;
    }

    // Πρώτη ανάγνωση για να γεμίσουμε το lastScoresByCode
    readCurrentRows().forEach(({ code, scoreText }) => {
      lastScoresByCode[code] = scoreText;
    });

    // Κάθε REFRESH_MS ελέγχουμε για αλλαγές
    setInterval(applyGoalAnimations, REFRESH_MS);
  }

  // Εκκίνηση όταν φορτώσει το DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoalWatcher);
  } else {
    initGoalWatcher();
  }
})();
