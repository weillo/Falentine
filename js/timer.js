(function () {
  const CONFIG_URL = '/timer.json'; // path to your JSON file

  fetch(CONFIG_URL)
    .then(res => res.json())
    .then(config => {
      // ====== SETTINGS FROM JSON ======
      const TARGET_DATE_TIME = config.targetDateTime;
      const PASSCODE = config.passcode;
      // =================================

      // Check for early access permission or expired countdown
      if (
        localStorage.getItem('countdown_early_access') === 'granted' ||
        new Date() >= new Date(TARGET_DATE_TIME)
      ) return;

      // Create overlay elements
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
      `;

      const countdownEl = document.createElement('div');
      countdownEl.style.cssText = `
        font-size: clamp(2rem, 5vw, 4rem);
        font-weight: 300;
        letter-spacing: -0.05em;
        cursor: default;
        user-select: none;
        max-width: 100%;
        line-height: 1.2;
      `;
      countdownEl.textContent = '00:00:00';

      overlay.appendChild(countdownEl);
      document.body.appendChild(overlay);

      // Triple-click handler for passcode prompt
      let clickCount = 0;
      let clickTimer = null;

      countdownEl.addEventListener('click', () => {
        clickCount++;

        if (clickCount === 3) {
          const userInput = prompt('Enter early access passcode:');
          if (userInput === PASSCODE) {
            localStorage.setItem('countdown_early_access', 'granted');
            overlay.remove();
            if (window.countdownInterval) clearInterval(window.countdownInterval);
          }
          clickCount = 0;
          if (clickTimer) clearTimeout(clickTimer);
        } else {
          if (clickTimer) clearTimeout(clickTimer);
          clickTimer = setTimeout(() => { clickCount = 0; }, 300);
        }
      });

      // Countdown logic
      const updateCountdown = () => {
        const now = Date.now();
        const distance = new Date(TARGET_DATE_TIME).getTime() - now;

        if (distance <= 0) {
          overlay.style.visibility = 'hidden';
          localStorage.removeItem('countdown_early_access');
          window.location.reload();
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
          countdownEl.textContent =
            `${days}d ${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
        } else if (hours > 0) {
          countdownEl.textContent =
            `${hours}h ${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
        } else {
          countdownEl.textContent =
            `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
        }
      };

      updateCountdown();
      window.countdownInterval = setInterval(updateCountdown, 1000);
    })
    .catch(err => {
      console.error('Failed to load countdown config:', err);
    });
})();