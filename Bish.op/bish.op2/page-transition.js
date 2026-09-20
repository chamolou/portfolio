// Page transition: a curtain wipes up over the page when a menu link is clicked, then
// lifts off the next page to reveal it (same motion as the intro's exit).
// Loaded in <head> on every page so the curtain is in place before the first paint.
(function () {
    // Reduced motion: no transition at all, pages just swap.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const STORAGE_KEY = 'bishop-transition';
    const COVER_MS = 600;          // curtain rising over the page
    const LIFT_MS = 700;           // curtain lifting off the new page
    const FLAG_TTL_MS = 5000;      // a "mid-transition" flag older than this is stale
    const MAX_LOAD_WAIT_MS = 1500; // never keep the new page covered longer than this
    const GIVE_UP_MS = 8000;       // if the navigation never happens, give the page back
    const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
    const html = document.documentElement;

    // Apply the stored theme right away (index.js does the same at the end of <body>)
    // so the curtain has the right color from the very first paint.
    try {
        if (localStorage.getItem('bishop-theme') === 'inverted') {
            html.setAttribute('data-theme', 'inverted');
        }
    } catch (err) {
        // Storage blocked — index.js copes with that the same way.
    }

    // sessionStorage can throw (blocked site data, opaque file:// origin, etc).
    // Without it the curtain still covers the old page, the new one just fades in.
    function setFlag() {
        try {
            sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch (err) {
            // Ignore.
        }
    }

    function takeFlag() {
        try {
            const at = Number(sessionStorage.getItem(STORAGE_KEY));
            sessionStorage.removeItem(STORAGE_KEY);
            return Date.now() - at < FLAG_TTL_MS;
        } catch (err) {
            return false;
        }
    }

    // The curtain is a pseudo-element of <html>, so it exists before <body> does.
    const style = document.createElement('style');
    style.textContent = `
        html {
            background-color: var(--color-white, #ffffff);
        }
        /* Direct loads (first visit, reload, browser back) fade in. */
        body {
            opacity: 0;
            transition: opacity 0.45s ease;
        }
        body.is-loaded {
            opacity: 1;
        }
        html::after {
            content: '';
            position: fixed;
            inset: 0;
            z-index: 3000; /* above the intro (2000) and the lightbox (1000) */
            background-color: var(--color-black, #000000);
            transform: translateY(100%);
            pointer-events: none;
        }
        html.pt-leaving::after {
            transform: translateY(0);
            transition: transform ${COVER_MS}ms ${EASE};
            pointer-events: auto; /* no clicks on the old page while it is covered */
            will-change: transform;
        }
        /* Arriving through a transition: the curtain already covers the new page. */
        html.pt-arriving::after {
            transform: translateY(0);
        }
        html.pt-arriving body {
            opacity: 1;
            transition: none;
        }
        html.pt-lifting::after {
            transform: translateY(-100%);
            transition: transform ${LIFT_MS}ms ${EASE};
            will-change: transform;
        }
    `;
    document.head.appendChild(style);

    // ── arriving ──

    const arriving = takeFlag();
    if (arriving) html.classList.add('pt-arriving');

    // Two frames, so the state set before has been painted when it changes.
    function afterPaint(fn) {
        requestAnimationFrame(function () {
            requestAnimationFrame(fn);
        });
    }

    function lift() {
        afterPaint(function () {
            document.body.classList.add('is-loaded');
            html.classList.add('pt-lifting');
            html.classList.remove('pt-arriving', 'pt-leaving');
            setTimeout(function () {
                html.classList.remove('pt-lifting');
            }, LIFT_MS + 50);
        });
    }

    function onReady() {
        if (!arriving) {
            afterPaint(function () {
                document.body.classList.add('is-loaded');
            });
            return;
        }

        // Lift once the page (images included) has loaded, so the reveal isn't half-empty.
        const loaded = new Promise(function (resolve) {
            if (document.readyState === 'complete') resolve();
            else window.addEventListener('load', resolve, { once: true });
        });
        const timeout = new Promise(function (resolve) {
            setTimeout(resolve, MAX_LOAD_WAIT_MS);
        });
        Promise.race([loaded, timeout]).then(lift);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

    // ── leaving ──

    let leaving = false;
    let giveUpTimer;

    // Back/forward can restore this page from the bfcache exactly as it was left,
    // curtain included: lift it.
    window.addEventListener('pageshow', function (e) {
        if (!e.persisted || !html.classList.contains('pt-leaving')) return;
        clearTimeout(giveUpTimer);
        leaving = false;
        html.classList.add('pt-arriving');
        lift();
    });

    // Intercept clicks on internal links and cover the page before navigating.
    document.addEventListener('click', function (e) {
        if (leaving || e.defaultPrevented) return;
        // Modified clicks (new tab, new window...) are left to the browser.
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Ignore external links, anchors, mailto/tel, downloads and links opening in a new tab.
        const isExternal = link.target === '_blank' || link.hasAttribute('download') || /^https?:\/\//i.test(href) || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:');
        if (isExternal) return;

        e.preventDefault();
        // Already on that page: nothing to transition to.
        if (link.pathname === window.location.pathname) return;

        leaving = true;
        if (link.parentElement.querySelector(':scope > .plus-svg')) {
            link.parentElement.setAttribute('data-active', '');
        }
        setFlag();
        html.classList.add('pt-leaving');

        setTimeout(function () {
            window.location.href = href;
        }, COVER_MS);

        // If the navigation never happens (stopped, offline), give the page back.
        giveUpTimer = setTimeout(function () {
            leaving = false;
            html.classList.remove('pt-leaving');
        }, COVER_MS + GIVE_UP_MS);
    });
})();
