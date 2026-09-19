// Défilement fluide (Lenis) — commun à toutes les pages du portfolio.
//
// Lenis lisse la molette mais laisse le scroll natif en place (pas de wrapper ni de
// transform sur la page) : ScrollTrigger, le pin des pages projet et le header en
// position:fixed continuent de fonctionner tels quels.
//
// Sans Lenis (fichier absent) ou avec prefers-reduced-motion, rien n'est créé et le scroll
// reste natif. Les autres scripts testent window.smoothScroll avant de s'en servir.
(function () {
    if (typeof Lenis === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hasScrollTrigger = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    const lenis = new Lenis({
        lerp: 0.1,
        // Avec GSAP, c'est son ticker qui cadence Lenis (plus bas) : les deux avancent dans la
        // même frame. Sans GSAP, Lenis a sa propre boucle.
        autoRaf: !hasScrollTrigger
    });

    if (hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        // ScrollTrigger lit la position lissée par Lenis à chaque frame
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        // Sans ça, GSAP rattrape d'un coup une frame longue et les animations au scroll sautent
        gsap.ticker.lagSmoothing(0);
    }

    window.smoothScroll = lenis;
})();
