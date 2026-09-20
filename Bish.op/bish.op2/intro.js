// Intro screen: the BISH.OP wordmark and a 000 → 100 counter cover the home page
// on the first visit of a browser session, then lift to reveal the page.
// Loaded in <head> so the cover is in place before the first paint.
(function () {
    const STORAGE_KEY = 'bishop-intro-shown';
    const COUNT_MS = 2000;    // duration of the 000 → 100 counter
    const MAX_WAIT_MS = 6000; // never keep the page covered longer than this
    const LEAVE_MS = 900;     // curtain transition, see .intro.is-leaving in style.css
    const REVEAL_MS = 1600;   // longest page reveal animation, see .intro-reveal in style.css
    const html = document.documentElement;

    // sessionStorage can throw (blocked site data, opaque file:// origin, etc).
    // The intro then simply plays on every visit instead of breaking the page.
    function alreadyShown() {
        try {
            return sessionStorage.getItem(STORAGE_KEY) === '1';
        } catch (err) {
            return false;
        }
    }

    function markShown() {
        try {
            sessionStorage.setItem(STORAGE_KEY, '1');
        } catch (err) {
            // Ignore — the intro just plays again on the next visit.
        }
    }

    if (alreadyShown() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    markShown();

    // The cover only exists while this class is on <html>: a repeat visit, reduced
    // motion or a page without JS never sees it.
    html.classList.add('has-intro');

    document.addEventListener('DOMContentLoaded', function () {
        const intro = document.getElementById('intro');
        if (!intro) {
            html.classList.remove('has-intro');
            return;
        }

        const main = document.querySelector('main');
        const count = intro.querySelector('.intro-count');
        const bar = intro.querySelector('.intro-bar');
        const star = intro.querySelector('.intro-star');

        // Nothing behind the cover can take focus while it plays.
        if (main) main.inert = true;

        let counted = false;
        let loaded = document.readyState === 'complete';
        let left = false;

        function leave() {
            if (left) return;
            left = true;
            if (main) main.inert = false;
            intro.classList.add('is-leaving');
            html.classList.add('intro-reveal');
            setTimeout(function () {
                intro.remove();
                html.classList.remove('has-intro');
            }, LEAVE_MS);
            setTimeout(function () {
                html.classList.remove('intro-reveal');
            }, REVEAL_MS);
        }

        // The cover lifts once the counter is done AND the page (carousel images
        // included) has loaded, so the reveal never shows a half-loaded page.
        function maybeLeave() {
            if (counted && loaded) leave();
        }

        window.addEventListener('load', function () {
            loaded = true;
            maybeLeave();
        });
        setTimeout(leave, MAX_WAIT_MS);
        intro.addEventListener('click', leave); // click to skip

        let start;
        function tick(now) {
            if (left) return;
            if (start === undefined) start = now;
            const t = Math.min((now - start) / COUNT_MS, 1);
            // ease-in-out cubic
            const p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            count.textContent = String(Math.round(p * 100)).padStart(3, '0');
            bar.style.transform = 'scaleX(' + p + ')';
            star.style.transform = 'rotate(' + p * 180 + 'deg)';
            if (t < 1) {
                requestAnimationFrame(tick);
            } else {
                counted = true;
                maybeLeave();
            }
        }

        function begin() {
            intro.classList.add('is-running');
            requestAnimationFrame(tick);
        }

        // Start once the wordmark font is ready (1.2s at the latest) so the huge
        // letters don't swap fonts halfway through their animation.
        const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        Promise.race([
            fontsReady,
            new Promise(function (resolve) { setTimeout(resolve, 1200); })
        ]).then(begin);
    });
})();
