// Déclaration globale de smoother
let smoother;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
  // Navigation handlers
  document.querySelector('.d21 div:nth-child(2)').addEventListener('click', function() {
    // Retour à index.html et scroll vers nv1
    window.location.href = 'index.html';
  });

  document.querySelector('.d21 div:nth-child(3)').addEventListener('click', function() {
    // Retour à index.html et scroll vers s5
    window.location.href = 'index.html#gallery';
  });

  document.querySelector('.d21 div:nth-child(4)').addEventListener('click', function() {
    // Déjà sur index3.html, pas besoin de redirection
    document.querySelector('.tres').scrollIntoView({ behavior: 'smooth' });
  });

  // Nouveaux gestionnaires de navigation
  document.querySelector('.stt19 a').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'index.html';
  });

  document.querySelector('.stt20 a').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'index.html#gallery';
  });

  document.querySelector('.stt21 a').addEventListener('click', function(e) {
    e.preventDefault();
    const tresSection = document.querySelector('.tres');
    if (tresSection) {
      smoother.scrollTo(tresSection, true);
    }
  });
});

function demarrer() {
  smoother = ScrollSmoother.create({
    wrapper: "#smoothWrapper",
    content: "#smoothContent",
    smooth: 2,
    effects: true,
    normalizeScroll: true,
    ignoreMobileResize: true
  });

  // Configuration initiale des lignes
  gsap.set('.stb1', { scaleX: 0, transformOrigin: 'left' });
  gsap.set('.stb2', { scaleY: 0, transformOrigin: 'top' });
  gsap.set('.stb3', { scaleX: 0, transformOrigin: 'left' });

  // Animation des lignes au chargement
  gsap.to('.stb1', {
    scaleX: 1,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.to('.stb2', {
    scaleY: 1,
    duration: 1,
    delay: 0.3,
    ease: 'power2.out'
  });

  gsap.to('.stb3', {
    scaleX: 1,
    duration: 1,
    delay: 0.6,
    ease: 'power2.out'
  });

  // Animation d'écriture pour stt7
  const stt7Text = document.querySelector('.stt7');
  
  // Rendre le texte visible immédiatement
  gsap.set(stt7Text, { opacity: 1 });

  // Animation de l'étoile avec séquence
  gsap.timeline()
    .to(".etoile", {
      // Animation initiale
      scale: 1.2,
      duration: 1,
      ease: "power2.out"
    })
    .to(".etoile", {
      // Rotation infinie après l'animation initiale
      rotation: 360,
      duration: 10,
      ease: "none",
      repeat: -1
    });

  gsap.to(".vite2", {
    scrollTrigger: {
      trigger: ".vite2",
      start: "top 50%",
      end: "+=15%",
      pin: true,
      pinSpacing: false,
      // markers: {
      //   startColor: "red",
      //   endColor: "red",
      //   fontSize: "12px",
      //   fontWeight: "bold",
      //   indent: 20
      // },
      onEnter: () => console.log('Première animation vite2 lancée')
    },
    ease: "power2.out",

  });

  gsap.to(".vite2", {
    scrollTrigger: {
      trigger: ".vite2",
      start: "top 30%",
      end: "+=15%",
      pin: true,
      pinSpacing: false,
      // markers: {
      //   startColor: "pink",
      //   endColor: "pink",
      //   fontSize: "12px",
      //   fontWeight: "bold",
      //   indent: 20
      // },
      onEnter: () => console.log('deuxieme animation vite2 lancée')
    },
    ease: "power2.out",

  });

  gsap.to(".vite3", {
    scrollTrigger: {
      trigger: ".vite3",
      start: "top 30%",
      end: "+=15%",
      pin: true,
      pinSpacing: false,
      // markers: {
      //   startColor: "blue",
      //   endColor: "blue",
      //   fontSize: "12px",
      //   fontWeight: "bold",
      //   indent: 20
      // },
      onEnter: () => console.log('deuxieme animation vite2 + vite3 lancée')
    },
    ease: "power2.out",

  });

  gsap.to(".vite4", {
    scrollTrigger: {
      trigger: ".vite4",
      start: "top 10%",
      end: "+=15%",
      pin: true,
      pinSpacing: false,
      // markers: {
      //   startColor: "blue",
      //   endColor: "blue",
      //   fontSize: "12px",
      //   fontWeight: "bold",
      //   indent: 20
      // },
      onEnter: () => console.log('troisieme animation vite2 + vite3 lancée')
    },
    ease: "power2.out",

  });

  gsap.to(".vite2", {
    scrollTrigger: {
      trigger: ".vite2",
      start: "top 10%",
      end: "+=15%",
      pin: true,
      pinSpacing: false,
      // markers: {
      //   startColor: "blue",
      //   endColor: "blue",
      //   fontSize: "12px",
      //   fontWeight: "bold",
      //   indent: 20
      // },
      onEnter: () => console.log('troisieme animation vite2 + vite3 lancée')
    },
    ease: "power2.out",

  });

  gsap.to(".vite3", {
    scrollTrigger: {
      trigger: ".vite3",
      start: "top 10%",
      end: "+=15%",
      pin: true,
      pinSpacing: false,
      // markers: {
      //   startColor: "blue",
      //   endColor: "blue",
      //   fontSize: "12px",
      //   fontWeight: "bold",
      //   indent: 20
      // },
      onEnter: () => console.log('troisieme animation vite2 + vite3 lancée')
    },
    ease: "power2.out",
  
  });
}

demarrer();

gsap.registerPlugin(ScrollTrigger);

// Animation de la barre de navigation d21
gsap.to('.d21', {
  backgroundSize: '100% 1px, 100% 1px',
  borderLeftColor: 'black',
  borderRightColor: 'black',
  duration: 1,
  ease: 'power2.inOut'
});

// Gestion du positionnement fixed de d21
ScrollTrigger.create({
  start: "top -50",
  end: 99999,
  toggleClass: {
    className: "fixed",
    targets: ".d21"
  }
});

// gsap.to('.vite3, .vite4, .vite5', {
//   rotation: 360,
//   scrollTrigger: {
//     trigger: '.vite',
//     start: "top 20%",
//     scrub: true,
//     markers: true
//   }
// });


