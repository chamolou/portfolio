(function () {
    var MOBILE_MAX = 768;
    var HOLD_MS = 900;
    var LEAVE_MS = 420;

    function isPhone() {
        return window.innerWidth <= MOBILE_MAX;
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    if (!isPhone() || sessionStorage.getItem('yawSplashShown')) {
        document.addEventListener('DOMContentLoaded', function () {
            var existing = document.getElementById('splash');
            if (existing) existing.remove();
        });
        return;
    }

    sessionStorage.setItem('yawSplashShown', '1');

    function revealPageBehindSplash() {
        var html = document.documentElement;
        html.classList.remove('pt-pending', 'pt-leaving');
        html.classList.add('pt-visible');
    }

    function dismissSplash(splash) {
        revealPageBehindSplash();
        splash.classList.add('is-leaving');
        document.body.classList.add('mobile-reveal-stagger');
        setTimeout(function () {
            splash.remove();
            document.body.classList.remove('has-mobile-splash');
        }, LEAVE_MS);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var splash = document.getElementById('splash');
        if (!splash) return;

        document.body.classList.add('has-mobile-splash');

        if (prefersReducedMotion()) {
            revealPageBehindSplash();
            splash.remove();
            document.body.classList.remove('has-mobile-splash');
            return;
        }

        // Attend que la page (images comprises) soit prête avant de lancer le
        // décompte, pour ne jamais révéler un écran vide derrière le splash.
        window.addEventListener('load', function () {
            setTimeout(function () {
                dismissSplash(splash);
            }, HOLD_MS);
        });
    });
})();
