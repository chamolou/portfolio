gsap.registerPlugin(ScrollTrigger);

let scrollTween = null;
let resizeTimeout = null;

function getScrollDistance() {
    const rightViewport = document.querySelector('.right');
    const rightContent = document.querySelector('.r2');

    if (!rightViewport || !rightContent) {
        return 0;
    }

    return Math.max(0, rightContent.offsetHeight - rightViewport.clientHeight);
}

function destroyScroll() {
    if (scrollTween) {
        scrollTween.scrollTrigger.kill();
        scrollTween.kill();
        scrollTween = null;
    }

    const rightContent = document.querySelector('.r2');
    if (rightContent) {
        gsap.set(rightContent, { y: 0 });
    }
}

function buildScroll() {
    const section = document.querySelector('.sec1');
    const rightContent = document.querySelector('.r2');

    if (!section || !rightContent) {
        return;
    }

    destroyScroll();

    const scrollDistance = getScrollDistance();
    if (scrollDistance <= 0) {
        return;
    }

    scrollTween = gsap.to(rightContent, {
        y: () => -getScrollDistance(),
        ease: 'none',
        // Garde la colonne en transform 3D (couche GPU) sur toute la course : en "auto", GSAP
        // repasse en translate() 2D dès que l'animation est terminée, au bout du pin
        force3D: true,
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 0,
            anticipatePin: 1,
            invalidateOnRefresh: true
        }
    });
}

function setupWheelProxy() {
    // Avec le défilement fluide (Lenis), la molette est déjà gérée sur toute la page :
    // ce relais la ferait défiler une deuxième fois
    if (window.smoothScroll) {
        return;
    }

    const right = document.querySelector('.right');
    if (!right) {
        return;
    }

    right.addEventListener('wheel', (event) => {
        const scrollTrigger = scrollTween?.scrollTrigger;
        if (!scrollTrigger || !scrollTrigger.isActive) {
            return;
        }

        const delta = event.deltaY !== 0 ? event.deltaY : event.deltaX;
        if (delta === 0) {
            return;
        }

        window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
        event.preventDefault();
    }, { passive: false, capture: true });
}

function setupVideoFullscreenFix() {
    // Sur desktop, le scroll piné applique un CSS transform sur .r2 à chaque tick.
    // Un ancêtre transformé casse le plein écran natif des <video> (bug Chrome/Firefox) :
    // on neutralise ce transform pendant le plein écran, puis on le restaure à la sortie.
    const r2 = document.querySelector('.r2');
    if (!r2) {
        return;
    }

    function handleFullscreenChange() {
        const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
        const isOurVideo = !!fsElement && r2.contains(fsElement);

        document.documentElement.classList.toggle('is-video-fullscreen', isOurVideo);

        if (!isOurVideo) {
            scrollTween?.scrollTrigger?.update();
        }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
}

document.addEventListener('DOMContentLoaded', () => {
    buildScroll();
    setupWheelProxy();
    setupVideoFullscreenFix();

    window.addEventListener('load', () => {
        buildScroll();
        ScrollTrigger.refresh();
    });

    window.addEventListener('resize', () => {
        // Entrer/sortir du plein écran déclenche un resize de la fenêtre. Si on
        // reconstruit le pin à ce moment-là, GSAP détache puis réinsère .sec1 dans
        // le DOM (kill + recréation du pin-spacer) : le navigateur considère que
        // l'élément plein écran est déconnecté du document et quitte le plein
        // écran aussitôt. On ignore donc les resize pendant que le plein écran
        // vidéo est actif.
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            return;
        }

        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (document.fullscreenElement || document.webkitFullscreenElement) {
                return;
            }
            buildScroll();
            ScrollTrigger.refresh();
        }, 150);
    });
});
