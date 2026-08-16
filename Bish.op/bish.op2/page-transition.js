// Page transition: fade out on leave, fade in on load.
(function () {
    // Inject the transition styles once.
    const style = document.createElement('style');
    style.textContent = `
        html {
            background-color: var(--color-white, #ffffff);
        }
        body {
            opacity: 0;
            transition: opacity 0.45s ease;
        }
        body.is-loaded {
            opacity: 1;
        }
        body.is-leaving {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    function fadeIn() {
        // Double rAF so the browser registers opacity:0 before transitioning to 1.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.classList.add('is-loaded');
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fadeIn);
    } else {
        fadeIn();
    }

    // Restore visibility instantly if the page is restored from bfcache.
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            document.body.classList.remove('is-leaving');
            document.body.classList.add('is-loaded');
        }
    });

    // Intercept clicks on internal links and fade out before navigating.
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Ignore external links, anchors, mailto/tel, and links opening in a new tab.
        const isExternal = link.target === '_blank' || /^https?:\/\//i.test(href) || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:');
        if (isExternal) return;

        e.preventDefault();
        document.body.classList.remove('is-loaded');
        document.body.classList.add('is-leaving');

        setTimeout(() => {
            window.location.href = href;
        }, 350);
    });
})();