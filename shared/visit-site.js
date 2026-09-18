(function () {
    const TABLET_MAX = 1024;
    const MESSAGE = 'Please open this site on desktop.';
    const AUTO_HIDE_MS = 4500;

    function isMobileOrTablet() {
        return window.innerWidth <= TABLET_MAX;
    }

    function hideDesktopOnlyMessage() {
        const notice = document.getElementById('desktop-only-notice');
        if (!notice) return;
        notice.classList.remove('is-visible');
    }

    function showDesktopOnlyMessage() {
        let notice = document.getElementById('desktop-only-notice');

        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'desktop-only-notice';
            notice.className = 'desktop-only-notice';
            notice.setAttribute('role', 'alert');
            notice.innerHTML = `
                <p>${MESSAGE}</p>
                <button type="button" class="desktop-only-notice__close" aria-label="Close">×</button>
            `;
            document.body.appendChild(notice);
            notice.querySelector('.desktop-only-notice__close').addEventListener('click', hideDesktopOnlyMessage);
        }

        notice.classList.add('is-visible');
        clearTimeout(notice._hideTimer);
        notice._hideTimer = setTimeout(hideDesktopOnlyMessage, AUTO_HIDE_MS);
    }

    document.addEventListener('click', (event) => {
        if (!isMobileOrTablet()) return;

        const link = event.target.closest('a.lp3');
        if (!link) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showDesktopOnlyMessage();
    }, true);
})();
