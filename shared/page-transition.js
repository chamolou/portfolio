(function () {
    const ENTER_MS = 40;
    const LEAVE_MS = 360;
    const html = document.documentElement;
    let isLeaving = false;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function revealPage() {
        html.classList.remove('pt-leaving');
        html.classList.add('pt-pending');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                html.classList.add('pt-visible');
            });
        });
    }

    function navigateTo(url) {
        if (!url || isLeaving) return;

        if (prefersReducedMotion()) {
            window.location.href = url;
            return;
        }

        isLeaving = true;
        html.classList.remove('pt-visible');
        html.classList.add('pt-leaving');

        setTimeout(() => {
            window.location.href = url;
        }, LEAVE_MS);
    }

    function isInternalNavLink(anchor) {
        if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
            return false;
        }

        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return false;
        }

        if (/^https?:\/\//i.test(href)) {
            try {
                const url = new URL(href, window.location.href);
                if (url.origin !== window.location.origin) return false;
            } catch (_) {
                return false;
            }
        }

        const resolved = new URL(href, window.location.href);
        if (resolved.pathname === window.location.pathname && resolved.search === window.location.search) {
            return false;
        }

        return true;
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(revealPage, ENTER_MS);

        document.addEventListener('click', (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const anchor = event.target.closest('a[href]');
            if (!isInternalNavLink(anchor)) return;

            event.preventDefault();
            navigateTo(anchor.getAttribute('href'));
        }, true);
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            isLeaving = false;
            html.classList.remove('pt-leaving');
            html.classList.add('pt-visible');
        }
    });

    window.navigateTo = navigateTo;
})();
