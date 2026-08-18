/* Désactive le scroll GSAP piné sur tablette/mobile — desktop inchangé */
(function () {
    const DESKTOP_SCROLL_MIN = 1025;

    function isDesktopScrollLayout() {
        return window.innerWidth >= DESKTOP_SCROLL_MIN;
    }

    function patchProjectScroll() {
        if (typeof buildScroll !== 'function' || typeof destroyScroll !== 'function') return;
        if (buildScroll.__responsivePatched) return;

        const originalBuild = buildScroll;
        const originalDestroy = destroyScroll;

        buildScroll = function patchedBuildScroll() {
            if (!isDesktopScrollLayout()) {
                originalDestroy();
                document.body.classList.add('is-mobile-project');
                return;
            }
            document.body.classList.remove('is-mobile-project');
            originalBuild();
        };
        buildScroll.__responsivePatched = true;

        destroyScroll = function patchedDestroyScroll() {
            originalDestroy();
            if (!isDesktopScrollLayout()) {
                document.body.classList.add('is-mobile-project');
            }
        };

        window.addEventListener('resize', () => {
            clearTimeout(window.__projectScrollResize);
            window.__projectScrollResize = setTimeout(buildScroll, 150);
        });
    }

    patchProjectScroll();
})();
