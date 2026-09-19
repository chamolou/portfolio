// ============================================

const EXPLORE_TRANSITION_MS = 1600;
const EXPLORE_FIRST_DELAY_MS = 80;
// Entrée du carrousel au chargement : alignée sur la page qui se révèle (avec ou sans intro)
const CAROUSEL_ENTRANCE_DELAY_MS = 120;
const CAROUSEL_ENTRANCE_AFTER_SPLASH_MS = 480;
const COMPACT_HOME_MAX = 1024;
let exploreTimers = [];
let burstTimeout = null;
let isExploring = false;
let homeLayoutTimeout = null;

function isCompactHomeLayout() {
    return window.innerWidth <= COMPACT_HOME_MAX;
}

function initCompactHomeView() {
    clearExploreTimers();
    const grillElements = document.querySelectorAll('.grill');
    const grElements = document.querySelectorAll('.gr');
    const listeSections = document.querySelectorAll('.sec-liste');
    const egrillElement = document.querySelector('.egrill');

    destroyInfiniteCarousel();
    preloadExploreImages();

    isExploring = true;
    document.body.classList.add('is-exploring', 'is-compact-home');

    grillElements.forEach((element) => {
        element.classList.add('is-hidden');
        element.style.display = 'none';
    });

    if (egrillElement) {
        egrillElement.style.display = 'none';
    }

    grElements.forEach((element) => {
        element.style.display = 'block';
        element.style.transitionDelay = '0ms';
        element.classList.add('is-shown', 'is-settled');
    });

    listeSections.forEach((listeSection) => {
        listeSection.style.display = 'flex';
        listeSection.style.transitionDelay = '0ms';
        listeSection.classList.add('is-visible', 'is-settled');
    });
}

function restoreDesktopHomeView() {
    clearExploreTimers();
    const grillElements = document.querySelectorAll('.grill');
    const grElements = document.querySelectorAll('.gr');
    const listeSections = document.querySelectorAll('.sec-liste');
    const egrillElement = document.querySelector('.egrill');

    isExploring = false;
    document.body.classList.remove('is-exploring', 'is-compact-home');

    grillElements.forEach((element) => {
        element.classList.remove('is-hidden');
        element.style.display = '';
    });

    grElements.forEach((element) => {
        element.style.display = 'none';
        element.style.transitionDelay = '';
        element.classList.remove('is-shown', 'is-settled');
    });

    listeSections.forEach((listeSection) => {
        listeSection.style.display = 'none';
        listeSection.style.transitionDelay = '';
        listeSection.classList.remove('is-visible', 'is-settled');
    });

    if (egrillElement) {
        egrillElement.style.display = '';
        egrillElement.textContent = 'EXPLORE';
    }

    ensureCarouselInit();
}

function applyHomeLayout() {
    if (isCompactHomeLayout()) {
        initCompactHomeView();
        return;
    }

    restoreDesktopHomeView();

    if (carouselState.track) {
        carouselState.loopWidth = measureCarouselLoopWidth(carouselState.track);
        wrapCarouselOffset();
        applyCarouselTransform();
        if (isCarouselVisible()) startCarouselLoop();
    }
}

// Timers de la transition en cours : annulés à chaque clic pour que le dernier clic gagne
function scheduleExploreTimer(callback, delay) {
    exploreTimers.push(setTimeout(callback, delay));
}

// Bloque le défilement de la page : overflow:hidden pour le scroll natif, et arrêt de Lenis
// (window.scrollTo ignore overflow:hidden)
function setPageScrollLocked(locked) {
    document.documentElement.classList.toggle('is-leaving-explore', locked);

    if (locked) {
        window.smoothScroll?.stop();
    } else {
        window.smoothScroll?.start();
    }
}

function clearExploreTimers() {
    exploreTimers.forEach(clearTimeout);
    exploreTimers = [];
    setPageScrollLocked(false);
}

function setExploreLabel(egrillElement, text) {
    if (!egrillElement) return;

    egrillElement.classList.add('is-swapping');
    scheduleExploreTimer(() => {
        egrillElement.textContent = text;
        egrillElement.classList.remove('is-swapping');
    }, 200);
}

function settleExploreElements(grElements, listeSections) {
    grElements.forEach((element) => {
        element.style.transitionDelay = '';
        element.classList.add('is-settled');
    });
    listeSections.forEach((listeSection) => {
        listeSection.style.transitionDelay = '';
        listeSection.classList.add('is-settled');
    });
}

function preloadExploreImages() {
    document.querySelectorAll('.gr img[loading="lazy"]').forEach((img) => {
        if (img.dataset.preloaded === 'true') return;
        img.loading = 'eager';
        img.dataset.preloaded = 'true';
        if (typeof img.decode === 'function') {
            img.decode().catch(() => {});
        }
    });
}

// Charge et décode les images d'EXPLORE avant le clic, pour que l'ouverture ne les attende pas
function schedulePreloadExploreImages() {
    const run = () => preloadExploreImages();

    if ('requestIdleCallback' in window) {
        requestIdleCallback(run, { timeout: 2000 });
    } else {
        setTimeout(run, 500);
    }
}

function prepareExploreTransition(grElements, listeSections) {
    grElements.forEach((element) => {
        element.classList.remove('is-settled');
    });
    listeSections.forEach((listeSection) => {
        listeSection.classList.remove('is-settled');
    });
}

function showExploreElements(grElements, listeSections) {
    prepareExploreTransition(grElements, listeSections);

    grElements.forEach((element, index) => {
        element.style.display = 'block';

        // us1 suit le même rythme que .sec-liste (1re étape)
        if (element.classList.contains('us1')) {
            element.style.transitionDelay = `${EXPLORE_FIRST_DELAY_MS}ms`;
        } else {
            element.style.transitionDelay = `${120 + index * 90}ms`;
        }
    });

    listeSections.forEach((listeSection, index) => {
        listeSection.style.display = 'flex';
        // après us1 : +280ms par section
        listeSection.style.transitionDelay = `${EXPLORE_FIRST_DELAY_MS + (index + 1) * 280}ms`;
    });

    // un seul reflow pour tout le lot (au lieu d'un par élément)
    document.body.offsetHeight;

    grElements.forEach((element) => element.classList.add('is-shown'));
    listeSections.forEach((listeSection) => listeSection.classList.add('is-visible'));

    scheduleExploreTimer(() => {
        if (isExploring) settleExploreElements(grElements, listeSections);
    }, EXPLORE_TRANSITION_MS + 400);
}

function hideExploreElements(grElements, listeSections) {
    prepareExploreTransition(grElements, listeSections);

    grElements.forEach((element) => {
        element.style.transitionDelay = '0ms';
        element.classList.remove('is-shown');
    });

    listeSections.forEach((listeSection) => {
        listeSection.style.transitionDelay = '0ms';
        listeSection.classList.remove('is-visible');
    });

    scheduleExploreTimer(() => {
        grElements.forEach((element) => {
            element.style.display = 'none';
            element.style.transitionDelay = '';
        });
        listeSections.forEach((listeSection) => {
            listeSection.style.display = 'none';
            listeSection.style.transitionDelay = '';
        });
    }, EXPLORE_TRANSITION_MS);
}

function toggleGrillElements() {
    if (isCompactHomeLayout()) return;

    const grillElements = document.querySelectorAll('.grill');
    const grElements = document.querySelectorAll('.gr');
    const egrillElement = document.querySelector('.egrill');
    const listeSections = document.querySelectorAll('.sec-liste');

    if (!grillElements.length) return;

    clearExploreTimers();
    // la cascade d'intro est finie dès qu'on interagit ; ses règles !important retarderaient l'animation
    document.body.classList.remove('mobile-reveal-stagger');
    isExploring = !isExploring;

    document.body.classList.toggle('is-exploring', isExploring);

    if (egrillElement) {
        // relance l'animation même si un clic précédent la joue encore
        egrillElement.classList.remove('is-bursting');
        egrillElement.offsetWidth;
        egrillElement.classList.add('is-bursting');
        clearTimeout(burstTimeout);
        burstTimeout = setTimeout(() => egrillElement.classList.remove('is-bursting'), 550);
    }

    if (isExploring) {
        // Stopper le carrousel tout de suite pour libérer le main thread au scroll
        destroyInfiniteCarousel();
        preloadExploreImages();

        grillElements.forEach((element) => {
            element.classList.add('is-hidden');
        });

        scheduleExploreTimer(() => {
            grillElements.forEach((element) => {
                element.style.display = 'none';
            });
        }, EXPLORE_TRANSITION_MS);

        showExploreElements(grElements, listeSections);
        setExploreLabel(egrillElement, 'BACK');
    } else {
        grillElements.forEach((element) => {
            element.style.display = '';
            element.offsetHeight;
            element.classList.remove('is-hidden');
        });

        playCarouselEntrance();
        hideExploreElements(grElements, listeSections);
        setExploreLabel(egrillElement, 'EXPLORE');

        // La page ne défile pas tant que les sections d'EXPLORE finissent de disparaître
        setPageScrollLocked(true);
        scheduleExploreTimer(() => setPageScrollLocked(false), EXPLORE_TRANSITION_MS);

        // Relancer le carrousel dès que la grille redevient visible
        scheduleExploreTimer(() => {
            buildInfiniteCarousel();
        }, 80);
    }
}

// Tableau des images du dossier Guggenheim
const guggenheimImages = [
    'guggenhiem/g1.webp',
    'guggenhiem/g2.jpeg',
    'guggenhiem/g3.jpeg',
    'guggenhiem/g4.png'
];

let currentImageIndex = 0;
let imageInterval;
let carouselInitialized = false;
let resizeTimeout = null;

const CAROUSEL_BASE_SPEED = 2;
const CAROUSEL_DRAG_THRESHOLD = 6;

const projectRoutes = {
    pj1: 'guggenhiem/guggenheime.html',
    pj2: 'agro-vida/agro_vida.html',
    pj3: 'ian-campo/ian_campo.html',
    pj4: 'control/control.html',
    pj5: 'Bish.op/bish_op.html',
    pj6: 'messi/messi.html'
};

const carouselState = {
    carousel: null,
    track: null,
    offset: 0,
    speed: CAROUSEL_BASE_SPEED,
    direction: -1,
    loopWidth: 0,
    rafId: null,
    running: false,
    isDragging: false,
    pointerActive: false,
    dragStartX: 0,
    dragOrigin: 0,
    lastPointerX: 0,
    lastPointerTime: 0,
    velocity: 0,
    didDrag: false,
    pressedCard: null,
    listenersBound: false
};

function isCarouselVisible() {
    const carousel = document.querySelector('.projects-carousel');
    if (!carousel || document.body.classList.contains('is-exploring')) return false;
    if (carousel.classList.contains('is-hidden')) return false;

    const style = window.getComputedStyle(carousel);
    return style.display !== 'none' && style.visibility !== 'hidden';
}

// Les cartes montent depuis le bas, de la gauche vers la droite
function playCarouselEntrance(baseDelay = 0) {
    const carousel = carouselState.carousel || document.querySelector('.projects-carousel');
    const track = carousel && carousel.querySelector('.carousel-track');
    if (!track || !isCarouselVisible()) return;

    const cards = Array.from(track.children);
    const onScreen = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return rect.right > 0 && rect.left < window.innerWidth;
    });
    const visibleCount = onScreen.filter(Boolean).length;

    // Rang d'apparition = position à l'écran (le carrousel a pu défiler avant) ;
    // les cartes hors champ montent en dernier, quand elles arrivent
    let rank = 0;
    cards.forEach((card, index) => {
        card.style.setProperty('--i', onScreen[index] ? rank++ : visibleCount);
    });

    carousel.style.setProperty('--rise-base', `${baseDelay}ms`);
    carousel.classList.remove('is-entering');
    carousel.offsetWidth; // relance l'animation si elle jouait déjà
    carousel.classList.add('is-entering');
}

function ensureCarouselClones(track) {
    if (track.dataset.cloned === 'true') return;

    const originals = Array.from(track.children);
    originals.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    track.dataset.cloned = 'true';
}

function measureCarouselLoopWidth(track) {
    const cards = Array.from(track.children);
    if (cards.length < 2) return 0;

    const half = Math.floor(cards.length / 2);
    // Distance jusqu'au début du set cloné (= largeur d'un cycle)
    return cards[half].offsetLeft - cards[0].offsetLeft;
}

function wrapCarouselOffset() {
    const { loopWidth } = carouselState;
    if (loopWidth <= 0) return;

    while (carouselState.offset <= -loopWidth) {
        carouselState.offset += loopWidth;
    }
    while (carouselState.offset > 0) {
        carouselState.offset -= loopWidth;
    }
}

function applyCarouselTransform() {
    if (!carouselState.track) return;
    carouselState.track.style.transform = `translate3d(${carouselState.offset}px, 0, 0)`;
}

function tickCarousel(now) {
    if (!carouselState.running) return;

    if (!carouselState.isDragging) {
        if (Math.abs(carouselState.velocity) > 0.02) {
            carouselState.offset += carouselState.velocity;
            carouselState.velocity *= 0.95;
            if (Math.abs(carouselState.velocity) <= 0.02) {
                carouselState.velocity = 0;
                carouselState.speed = CAROUSEL_BASE_SPEED;
            }
        } else {
            carouselState.offset += carouselState.speed * carouselState.direction;
        }

        wrapCarouselOffset();
        applyCarouselTransform();
    }

    carouselState.rafId = requestAnimationFrame(tickCarousel);
}

function startCarouselLoop() {
    if (carouselState.running) return;
    carouselState.running = true;
    carouselState.rafId = requestAnimationFrame(tickCarousel);
}

function stopCarouselLoop() {
    carouselState.running = false;
    if (carouselState.rafId) {
        cancelAnimationFrame(carouselState.rafId);
        carouselState.rafId = null;
    }
}

function destroyInfiniteCarousel() {
    stopCarouselLoop();
    carouselState.isDragging = false;
    carouselState.velocity = 0;

    if (carouselState.carousel) {
        carouselState.carousel.classList.remove('is-dragging');
    }
}

function buildInfiniteCarousel() {
    const carousel = document.querySelector('.projects-carousel');
    const track = document.querySelector('.carousel-track');

    if (!carousel || !track) return;

    carouselState.carousel = carousel;
    carouselState.track = track;

    if (!isCarouselVisible()) {
        destroyInfiniteCarousel();
        return;
    }

    ensureCarouselClones(track);
    carouselState.loopWidth = measureCarouselLoopWidth(track);
    wrapCarouselOffset();
    applyCarouselTransform();
    bindCarouselPointerControls();
    startCarouselLoop();
}

function navigateFromCard(card) {
    if (!card) return;

    const routeKey = Object.keys(projectRoutes).find((key) => card.classList.contains(key));
    if (!routeKey) return;

    window.navigateTo
        ? window.navigateTo(projectRoutes[routeKey])
        : (window.location.href = projectRoutes[routeKey]);
}

function bindCarouselPointerControls() {
    const { carousel } = carouselState;
    if (!carousel || carouselState.listenersBound) return;

    const onPointerDown = (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        if (!isCarouselVisible()) return;

        carouselState.pointerActive = true;
        carouselState.isDragging = false;
        carouselState.didDrag = false;
        carouselState.pressedCard = event.target.closest('.project-card');
        carouselState.dragStartX = event.clientX;
        carouselState.dragOrigin = carouselState.offset;
        carouselState.lastPointerX = event.clientX;
        carouselState.lastPointerTime = performance.now();
        carouselState.velocity = 0;
    };

    const onPointerMove = (event) => {
        if (!carouselState.pointerActive) return;

        const dx = event.clientX - carouselState.dragStartX;

        if (!carouselState.isDragging) {
            if (Math.abs(dx) <= CAROUSEL_DRAG_THRESHOLD) return;

            carouselState.isDragging = true;
            carouselState.didDrag = true;
            carousel.classList.add('is-dragging');

            try {
                carousel.setPointerCapture(event.pointerId);
            } catch (_) {
                /* ignore */
            }
        }

        carouselState.offset = carouselState.dragOrigin + dx;
        wrapCarouselOffset();
        applyCarouselTransform();

        const now = performance.now();
        const dt = now - carouselState.lastPointerTime;
        if (dt > 0) {
            const frameVelocity = (event.clientX - carouselState.lastPointerX) / dt;
            carouselState.velocity = frameVelocity * 16;
        }
        carouselState.lastPointerX = event.clientX;
        carouselState.lastPointerTime = now;
    };

    const finishPointer = (event) => {
        if (!carouselState.pointerActive) return;

        const wasDragging = carouselState.didDrag;
        const card = carouselState.pressedCard;

        carouselState.pointerActive = false;
        carouselState.isDragging = false;
        carouselState.pressedCard = null;
        carousel.classList.remove('is-dragging');

        if (Math.abs(carouselState.velocity) > 0.3) {
            carouselState.direction = carouselState.velocity < 0 ? -1 : 1;
            carouselState.speed = CAROUSEL_BASE_SPEED;
        }

        try {
            if (carousel.hasPointerCapture?.(event.pointerId)) {
                carousel.releasePointerCapture(event.pointerId);
            }
        } catch (_) {
            /* ignore */
        }

        // Clic simple (sans drag) → ouvrir le projet
        if (!wasDragging) {
            navigateFromCard(card);
        }

        carouselState.didDrag = false;
    };

    carousel.addEventListener('pointerdown', onPointerDown);
    carousel.addEventListener('pointermove', onPointerMove);
    carousel.addEventListener('pointerup', finishPointer);
    carousel.addEventListener('pointercancel', finishPointer);

    // Molette / trackpad : oriente le défilement
    carousel.addEventListener('wheel', (event) => {
        if (!isCarouselVisible()) return;

        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (delta === 0) return;

        event.preventDefault();
        carouselState.direction = delta > 0 ? -1 : 1;
        carouselState.offset += -delta;
        carouselState.velocity = 0;
        wrapCarouselOffset();
        applyCarouselTransform();
    }, { passive: false });

    carouselState.listenersBound = true;
}

function ensureCarouselInit() {
    if (carouselInitialized) {
        buildInfiniteCarousel();
        return;
    }

    carouselInitialized = true;
    buildInfiniteCarousel();

    window.addEventListener('load', () => {
        if (!isCompactHomeLayout()) buildInfiniteCarousel();
    });
}

function initInfiniteCarousel() {
    ensureCarouselInit();
}

// Fonction pour changer l'image de secc1img1
function changeImage() {
    const imgElement = document.querySelector('.secc1img1');
    if (imgElement) {
        currentImageIndex = (currentImageIndex + 1) % guggenheimImages.length;
        imgElement.src = guggenheimImages[currentImageIndex];
    }
}

// Fonction pour démarrer le changement d'images
function startImageRotation() {
    imageInterval = setInterval(changeImage, 80);
}

// Fonction pour arrêter le changement d'images
function stopImageRotation() {
    if (imageInterval) {
        clearInterval(imageInterval);
        imageInterval = null;
    }
}

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    // Masquer tous les éléments avec la classe "gr" au chargement de la page
    const grElements = document.querySelectorAll('.gr');
    grElements.forEach(element => {
        element.style.display = 'none';
        element.classList.remove('is-shown');
    });
    
    // Sélectionner l'élément avec la classe "egrill"
    const egrillElement = document.querySelector('.egrill');
    
    // Ajouter un événement de clic
    if (egrillElement) {
        egrillElement.addEventListener('click', toggleGrillElements);
        egrillElement.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            toggleGrillElements();
        });
        egrillElement.addEventListener('pointerenter', preloadExploreImages, { once: true });
        egrillElement.addEventListener('pointerdown', preloadExploreImages, { once: true });
    }

    if (document.readyState === 'complete') {
        schedulePreloadExploreImages();
    } else {
        window.addEventListener('load', schedulePreloadExploreImages, { once: true });
    }
    
    // Sélectionner l'élément secc1img1 pour le hover
    const secc1img1Element = document.querySelector('.secc1img1');
    
    // Ajouter les événements de hover
    if (secc1img1Element) {
        secc1img1Element.addEventListener('mouseenter', startImageRotation);
        secc1img1Element.addEventListener('mouseleave', stopImageRotation);
    }
    
    // Navigation grille EXPLORE (les cards du carrousel passent par la délégation)
    const exploreLinks = [
        ['.us1', 'guggenhiem/guggenheime.html'],
        ['.us2', 'agro-vida/agro_vida.html'],
        ['.us3', 'ian-campo/ian_campo.html'],
        ['.us4', 'control/control.html'],
        ['.us5', 'Bish.op/bish_op.html'],
        ['.us6', 'messi/messi.html']
    ];

    exploreLinks.forEach(([selector, href]) => {
        const el = document.querySelector(selector);
        if (!el) return;
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            if (window.navigateTo) {
                window.navigateTo(href);
            } else {
                window.location.href = href;
            }
        });
    });

    applyHomeLayout();

    if (document.body.classList.contains('has-mobile-splash')) {
        document.addEventListener('splash:dismissed', () => {
            playCarouselEntrance(CAROUSEL_ENTRANCE_AFTER_SPLASH_MS);
        }, { once: true });
    } else {
        playCarouselEntrance(CAROUSEL_ENTRANCE_DELAY_MS);
    }

    window.addEventListener('resize', () => {
        clearTimeout(homeLayoutTimeout);
        homeLayoutTimeout = setTimeout(applyHomeLayout, 150);
    });
});