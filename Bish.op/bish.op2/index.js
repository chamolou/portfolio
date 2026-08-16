// Theme toggle (black/white inversion), persisted across pages via localStorage.
(function () {
    const STORAGE_KEY = 'bishop-theme';

    // CSS transitions on color/background fight GSAP's per-frame variable updates.
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        html.theme-animating,
        html.theme-animating * {
            transition: none !important;
        }
        html.theme-animating [class$="-galery"],
        html.theme-animating [class$="-menu"],
        html.theme-animating [class$="_menu"] {
            border-top-color: var(--color-black) !important;
            border-bottom-color: var(--color-black) !important;
        }
    `;
    document.head.appendChild(animStyle);

    // localStorage can throw (private browsing, opaque file:// origin, blocked
    // storage settings, etc). Never let that exception kill the rest of this
    // script — it would silently prevent the toggle click listener below from
    // ever being attached.
    function readStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (err) {
            return null;
        }
    }

    function writeStoredTheme(value) {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (err) {
            // Ignore — theme just won't persist across pages/reloads.
        }
    }

    // Apply the stored theme as early as possible to avoid a flash of the wrong theme.
    const stored = readStoredTheme();
    if (stored === 'inverted') {
        document.documentElement.setAttribute('data-theme', 'inverted');
    }

    document.addEventListener('DOMContentLoaded', function () {
        const clockEl = document.querySelector('.middle-down-second-texte-element');
        if (clockEl) {
            function updateClock() {
                const now = new Date();
                const date = now.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });
                const time = now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                clockEl.textContent = date + ' – ' + time;
            }

            updateClock();
            setInterval(updateClock, 1000);
        }

        // Either toggle label can exist on a given page (home/about use one class,
        // the gallery page uses the other).
        const toggle = document.querySelector('.middle-color-texte-element, .left-color-texte-element');
        if (!toggle) return;

        function currentLabels() {
            // Each toggle's text always names the *current* background color.
            return toggle.classList.contains('left-color-texte-element')
                ? { normal: 'white', inverted: 'black' }
                : { normal: 'black', inverted: 'white' };
        }

        function updateText() {
            const inverted = document.documentElement.getAttribute('data-theme') === 'inverted';
            const labels = currentLabels();
            toggle.textContent = inverted ? labels.inverted : labels.normal;
        }

        function setTheme(inverted) {
            if (inverted) {
                document.documentElement.setAttribute('data-theme', 'inverted');
                writeStoredTheme('inverted');
            } else {
                document.documentElement.removeAttribute('data-theme');
                writeStoredTheme('normal');
            }
            updateText();
        }

        function updateStarFilter(t) {
            document.querySelectorAll('.star-svg').forEach(function (star) {
                star.style.filter = 'invert(' + t + ')';
            });
        }

        function clearStarFilter() {
            document.querySelectorAll('.star-svg').forEach(function (star) {
                star.style.removeProperty('filter');
            });
        }

        function doToggle() {
            const inverted = document.documentElement.getAttribute('data-theme') === 'inverted';

            if (window.gsap) {
                // Interpolate t: 0 = normal (black=#000, white=#fff)
                //               t: 1 = inverted (black=#fff, white=#000)
                // We build rgb() strings manually — gsap.utils.interpolate returns
                // "rgb(...)" which some browsers reject inside CSS custom properties
                // used as border-color values.
                document.documentElement.classList.add('theme-animating');
                const proxy = { t: inverted ? 1 : 0 };
                gsap.to(proxy, {
                    t: inverted ? 0 : 1,
                    duration: 0.4,
                    ease: 'none',
                    onUpdate: function () {
                        const v     = proxy.t;
                        const dark  = Math.round(v * 255);
                        const light = 255 - dark;
                        const colorBlack = 'rgb(' + dark  + ',' + dark  + ',' + dark  + ')';
                        const colorWhite = 'rgb(' + light + ',' + light + ',' + light + ')';
                        document.documentElement.style.setProperty('--color-black',  colorBlack);
                        document.documentElement.style.setProperty('--color-white',  colorWhite);
                        document.documentElement.style.setProperty('--color-border', colorBlack);
                        updateStarFilter(v);
                    },
                    onComplete: function () {
                        document.documentElement.style.removeProperty('--color-black');
                        document.documentElement.style.removeProperty('--color-white');
                        document.documentElement.style.removeProperty('--color-border');
                        clearStarFilter();
                        document.documentElement.classList.remove('theme-animating');
                        setTheme(!inverted);
                    }
                });
            } else {
                setTheme(!inverted);
            }
        }

        toggle.addEventListener('click', doToggle);
        updateText();
    });
})();