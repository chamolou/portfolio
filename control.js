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

document.addEventListener('DOMContentLoaded', () => {
    buildScroll();
    setupWheelProxy();

    window.addEventListener('load', () => {
        buildScroll();
        ScrollTrigger.refresh();
    });

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            buildScroll();
            ScrollTrigger.refresh();
        }, 150);
    });
});
