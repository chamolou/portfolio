// Intro screen: the Messi mark and a 000 → 100 counter cover the page on the first
// visit of a browser session, while the 3D scene downloads. The counter follows the
// real loading progress reported by index2.js, and the cover lifts once the scene is
// ready. Loaded in <head> so the cover is in place before the first paint.
//
// Exposes window.MessiIntro only while the intro is playing, so index2.js can tell
// whether there is one:
//   MessiIntro.setProgress(p)  real loading progress, 0 → 1
//   MessiIntro.onLeave(fn)     runs fn as the cover starts to lift
(function () {
    const STORAGE_KEY = 'messi-intro-shown';
    const MIN_MS = 1500;      // the counter never runs faster than this, even from the cache
    const MAX_WAIT_MS = 12000; // never keep the page covered longer than this
    const LEAVE_MS = 900;     // curtain transition, see .intro.is-leaving in style.css
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

    const leaveCallbacks = [];
    let realProgress = 0;

    window.MessiIntro = {
        setProgress: function (p) {
            realProgress = Math.max(realProgress, Math.min(1, p));
        },
        onLeave: function (fn) {
            leaveCallbacks.push(fn);
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const intro = document.getElementById('intro');
        if (!intro) {
            html.classList.remove('has-intro');
            leaveCallbacks.forEach(function (fn) { fn(); });
            return;
        }

        const count = intro.querySelector('.intro-count');
        const bar = intro.querySelector('.intro-bar');
        const content = document.getElementById('smoothContent');

        // Nothing behind the cover can take focus while it plays.
        if (content) content.inert = true;

        let left = false;
        let shown = 0;
        let last;
        let start;

        function leave() {
            if (left) return;
            left = true;
            count.textContent = '100';
            bar.style.transform = 'scaleX(1)';
            if (content) content.inert = false;
            intro.classList.add('is-leaving');
            leaveCallbacks.forEach(function (fn) { fn(); });
            setTimeout(function () {
                intro.remove();
                html.classList.remove('has-intro');
            }, LEAVE_MS);
        }

        setTimeout(leave, MAX_WAIT_MS);
        intro.addEventListener('click', leave); // click to skip

        function tick(now) {
            if (left) return;
            if (start === undefined) {
                start = now;
                last = now;
            }
            // The counter can't get ahead of the real progress, nor of the minimum
            // duration; it eases towards whichever is lower.
            const target = Math.min(realProgress, (now - start) / MIN_MS);
            const dt = Math.min((now - last) / 1000, 0.1);
            last = now;
            shown += (target - shown) * (1 - Math.pow(0.0005, dt));
            if (target >= 1 && shown > 0.995) shown = 1;

            count.textContent = String(Math.round(shown * 100)).padStart(3, '0');
            bar.style.transform = 'scaleX(' + shown + ')';

            if (shown >= 1) {
                leave();
            } else {
                requestAnimationFrame(tick);
            }
        }

        // The lines and the mark animate from CSS as soon as the cover is painted. The
        // counter starts once its font is ready (1.2s at the latest) so the digits
        // don't swap fonts halfway through the count.
        const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        Promise.race([
            fontsReady,
            new Promise(function (resolve) { setTimeout(resolve, 1200); })
        ]).then(function () {
            requestAnimationFrame(tick);
        });
    });
})();
