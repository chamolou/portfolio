gsap.registerPlugin(ScrollTrigger);

// Vérifier si on arrive avec une ancre #gallery dans l'URL
window.addEventListener('load', function() {
  if (window.location.hash === '#gallery') {
    // Petit délai pour laisser le temps au ScrollSmoother de s'initialiser
    setTimeout(() => {
      const gallerySection = document.querySelector('.s5');
      const offset = gallerySection.getBoundingClientRect().top + window.scrollY;
      
      // Si on a un ScrollSmoother actif
      if (window.smoother) {
        window.smoother.scrollTo(offset, true);
      } else {
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
});

// Navigation handlers
document.querySelector('.nv11').addEventListener('click', function() {
  const section = document.querySelector('.nv1');
  const offset = section.getBoundingClientRect().top + window.scrollY;
  if (window.smoother) {
    window.smoother.scrollTo(offset, true);
  } else {
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
  }
});

document.querySelector('.nv12').addEventListener('click', function() {
  const section = document.querySelector('.s5');
  const offset = section.getBoundingClientRect().top + window.scrollY;
  if (window.smoother) {
    window.smoother.scrollTo(offset, true);
  } else {
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    });
  }
});

document.querySelector('.nv13').addEventListener('click', function() {
  window.location.href = 'index3.html';
});

// Animation de la barre de navigation d21
gsap.to('.d21', {
  backgroundSize: '100% 1px, 100% 1px',
  borderLeftColor: 'black',
  borderRightColor: 'black',
  duration: 1,
  ease: 'power2.inOut'
});

// Animation des lignes nvb1 et nvb2 au chargement
gsap.set('.nvb1', { scaleY: 0, transformOrigin: 'top' });
gsap.set('.nvb2', { scaleX: 0, transformOrigin: 'left' });
gsap.set('.secc1', { left: '0%' });

// Create the main timeline for nv1 animations
const nv1Timeline = gsap.timeline({paused: true});

// Add animations to the timeline
nv1Timeline
    .to('.nvb1', {
        scaleY: 1,
        duration: 1,
        ease: 'power2.out'
    })
    .to('.nvb2', {
        scaleX: 1,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.7")
    .to('.sec1img', {
        height: '100%',
        duration: 1.5,
        ease: 'power2.out'
    }, "-=0.5")
    .to('.cercle circle', {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut'
    }, "-=1")
    .from('.logo', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    }, "-=1.5");

// Initial states
gsap.set('.nvb1', { scaleY: 0, transformOrigin: 'top' });
gsap.set('.nvb2', { scaleX: 0, transformOrigin: 'left' });
gsap.set('.sec1img', { height: '0%' }); // Set initial state for the image
gsap.set('.sec1img', { height: '0%' });
gsap.set('.logo', { opacity: 0, y: 50 });

// L'animation de l'étoile est maintenant gérée dans l'événement du bouton explore

const d21 = document.querySelector('.d21');
const section2 = document.getElementById('section2');
let section2Top;

function updateSection2Position() {
  section2Top = section2.getBoundingClientRect().top + window.scrollY;
}

// Mettre à jour la position au chargement et au redimensionnement
window.addEventListener('load', updateSection2Position);
window.addEventListener('resize', updateSection2Position);

// Gestion du scroll
window.addEventListener('scroll', function() {
  if (!section2Top) updateSection2Position();
  
  if (window.scrollY >= section2Top) {
    d21.classList.add('fixed');
  } else {
    d21.classList.remove('fixed');
  }
});

// Épinglage de secc3d1
ScrollTrigger.create({
  trigger: ".secc3d1",
  start: "top -4%",
  end: "+=40%",
  pin: true,
  pinSpacing: false,
  markers: false
});

// Épinglage de secc3d12
ScrollTrigger.create({
  trigger: ".secc3d12",
  start: "top -4%",
  end: "+=40%",
  pin: true,
  pinSpacing: false,
  markers: false
});

// Épinglage de secc3d13
ScrollTrigger.create({
  trigger: ".secc3d13",
  start: "top -4%",
  end: "+=40%",
  pin: true,
  pinSpacing: false,
  markers: false
});

// Épinglage de secc3d14
ScrollTrigger.create({
  trigger: ".secc3d14",
  start: "top -4%",
  end: "+=40%",
  pin: true,
  pinSpacing: false,
  markers: false
});

function demarrer() {
  // Configuration de ScrollSmoother
  window.smoother = ScrollSmoother.create({
    wrapper: "#smoothWrapper",
    content: "#smoothContent",
    smooth: 5,
    effects: true,
    normalizeScroll: true,
    ignoreMobileResize: true
  });

  // Configuration initiale des éléments
  gsap.set('.nvb11', {
    height: '100%',
    scaleY: 0,
    transformOrigin: 'top'
  });

  gsap.set('.sb11', {
    height: '104%',
    scaleY: 0,
    transformOrigin: 'top'
  });

  gsap.set(['.nb65', '.nb66', '.sb12'], {
    width: '100%',
    scaleX: 0,
    transformOrigin: 'left'
  });

  // Animation de la ligne verticale nvb11 dans la section2
  gsap.to('.nvb11', {
    scaleY: 1,
    duration: 1.5,
    ease: 'power2.inOut',
  scrollTrigger: {
      trigger: '.nv1',
      start: 'bottom 80%',
      scroller: '#smoothWrapper',
    markers: false,
      toggleActions: 'play none none reverse'
    }
  });

  // Animation de la ligne verticale sb11
  gsap.to('.sb11', {
    scaleY: 1,
    duration: 1.5,
    delay: 0.3,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.nv1',
      start: 'bottom 80%',
      scroller: '#smoothWrapper',
      toggleActions: 'play none none reverse'
    }
  });

  // Animation de la première ligne horizontale nb65
  gsap.to('.nb65', {
    scaleX: 1,
    duration: 1.5,
    delay: 0.2,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.nv1',
      start: 'bottom 80%',
      scroller: '#smoothWrapper',
      toggleActions: 'play none none reverse'
    }
  });

  // Animation de la deuxième ligne horizontale nb66
  gsap.to('.nb66', {
    scaleX: 1,
    duration: 1.5,
    delay: 0.4,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.nv1',
      start: 'bottom 80%',
      scroller: '#smoothWrapper',
      toggleActions: 'play none none reverse'
    }
  });

  // Animation de la ligne horizontale sb12
  gsap.to('.sb12', {
    scaleX: 1,
    duration: 1.5,
    delay: 0.5,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '.nv1',
      start: 'bottom 80%',
      scroller: '#smoothWrapper',
      toggleActions: 'play none none reverse'
    }
  });
}

// Initialiser ScrollSmoother au chargement
demarrer();

// Gestion du clic sur l'image avec la classe image-one, image-two, image-three ou image-four
document.querySelector('.img1').addEventListener('click', function() {
  // Masquer toutes les sections principales dans tous les cas
  document.querySelector('.nv1').style.display = 'none';
  document.querySelector('#section2').style.display = 'none';
  document.querySelector('.s3').style.display = 'none';
  document.querySelector('.s4').style.display = 'none';
  document.querySelector('.s5').style.display = 'none';
  document.querySelector('.s55').style.display = 'none';
  document.querySelector('.s6').style.display = 'none';
  document.querySelector('.secc1').style.display = 'none';
  document.querySelector('.green-background').style.display = 'none';

  // Récupérer le conteneur des sections
  let container = document.querySelector('.sections-container');
  container.innerHTML = ''; // Vider le conteneur

  if (this.classList.contains('image-one')) {
    // Déplacer les sections dans le conteneur pour image-one
    const secc2 = document.querySelector('.secc2');
    const secc3 = document.querySelector('.secc3');
    const secc4 = document.querySelector('.secc4');

    container.appendChild(secc2);
    container.appendChild(secc3);
    container.appendChild(secc4);

    // Afficher les sections dans l'ordre
    secc2.style.display = 'grid';
    secc3.style.display = 'grid';
    secc4.style.display = 'grid';

    // Ajouter la classe d'animation pour secc2t3
    document.querySelector('.secc2t3').classList.add('secc2t3-split-animation');

    // Créer le split text pour secc2t3
    let splitSecc2t3 = new SplitText(".secc2t3", { 
      type: "lines, words, chars",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char"
    });

    // Masquer les balises split-line vides pour secc2t3
    document.querySelectorAll('.secc2t3 .split-line').forEach(line => {
      if (!line.innerHTML.trim()) {
        line.style.display = 'none';
      }
    });

    // Animation des mots pour secc2t3
    gsap.set('.secc2t3-split-animation .split-word', { top: '85%' });
    gsap.to('.secc2t3-split-animation .split-word', {
      top: '-25%',
      duration: 1,
      stagger: 0.02,
      ease: 'power2.inOut'
    });
  } else if (this.classList.contains('image-two')) {
    // Déplacer les sections dans le conteneur pour image-two
    const secc22 = document.querySelector('.secc22');
    const secc32 = document.querySelector('.secc32');
    const secc42 = document.querySelector('.secc42');

    container.appendChild(secc22);
    container.appendChild(secc32);
    container.appendChild(secc42);

    // Afficher les sections dans l'ordre
    secc22.style.display = 'grid';
    secc32.style.display = 'grid';
    secc42.style.display = 'grid';

    // Ajouter la classe d'animation pour secc2t32
    document.querySelector('.secc2t32').classList.add('secc2t32-split-animation');

    // Créer le split text pour secc2t32
    let splitSecc2t32 = new SplitText(".secc2t32", { 
      type: "lines, words, chars",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char"
    });

    // Masquer les balises split-line vides pour secc2t32
    document.querySelectorAll('.secc2t32 .split-line').forEach(line => {
      if (!line.innerHTML.trim()) {
        line.style.display = 'none';
      }
    });

    // Animation des mots pour secc2t32
    gsap.set('.secc2t32-split-animation .split-word', { top: '85%' });
    gsap.to('.secc2t32-split-animation .split-word', {
      top: '-25%',
      duration: 1,
      stagger: 0.02,
      ease: 'power2.inOut'
    });
  } else if (this.classList.contains('image-three')) {
    // Déplacer les sections dans le conteneur pour image-three
    const secc23 = document.querySelector('.secc23');
    const secc33 = document.querySelector('.secc33');
    const secc43 = document.querySelector('.secc43');

    container.appendChild(secc23);
    container.appendChild(secc33);
    container.appendChild(secc43);

    // Afficher les sections dans l'ordre
    secc23.style.display = 'grid';
    secc33.style.display = 'grid';
    secc43.style.display = 'grid';

    // Ajouter la classe d'animation pour secc2t33
    document.querySelector('.secc2t33').classList.add('secc2t33-split-animation');

    // Créer le split text pour secc2t33
    let splitSecc2t33 = new SplitText(".secc2t33", { 
      type: "lines, words, chars",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char"
    });

    // Masquer les balises split-line vides pour secc2t33
    document.querySelectorAll('.secc2t33 .split-line').forEach(line => {
      if (!line.innerHTML.trim()) {
        line.style.display = 'none';
      }
    });

    // Animation des mots pour secc2t33
    gsap.set('.secc2t33-split-animation .split-word', { top: '85%' });
    gsap.to('.secc2t33-split-animation .split-word', {
      top: '-25%',
      duration: 1,
      stagger: 0.02,
      ease: 'power2.inOut'
    });
  } else if (this.classList.contains('image-four')) {
    // Déplacer les sections dans le conteneur pour image-four
    const secc24 = document.querySelector('.secc24');
    const secc34 = document.querySelector('.secc34');
    const secc44 = document.querySelector('.secc44');

    container.appendChild(secc24);
    container.appendChild(secc34);
    container.appendChild(secc44);

    // Afficher les sections dans l'ordre
    secc24.style.display = 'grid';
    secc34.style.display = 'grid';
    secc44.style.display = 'grid';

    // Ajouter la classe d'animation pour secc2t34
    document.querySelector('.secc2t34').classList.add('secc2t34-split-animation');

    // Créer le split text pour secc2t34
    let splitSecc2t34 = new SplitText(".secc2t34", { 
      type: "lines, words, chars",
      linesClass: "split-line",
      wordsClass: "split-word",
      charsClass: "split-char"
    });

    // Masquer les balises split-line vides pour secc2t34
    document.querySelectorAll('.secc2t34 .split-line').forEach(line => {
      if (!line.innerHTML.trim()) {
        line.style.display = 'none';
      }
    });

    // Animation des mots pour secc2t34
    gsap.set('.secc2t34-split-animation .split-word', { top: '85%' });
    gsap.to('.secc2t34-split-animation .split-word', {
      top: '-25%',
      duration: 1,
      stagger: 0.02,
      ease: 'power2.inOut'
    });
  }

  // Animer l'image ip21 vers la gauche
  gsap.to('.ip21', {
    left: '0%',
    duration: 1,
    ease: 'power2.out'
  });

  // S'assurer que la page commence au début
  window.scrollTo(0, 0);

  // Réinitialiser ScrollSmoother
  if (window.smoother) {
    window.smoother.kill();
  }
  demarrer();

  // Masquer l'étoile
  etoil.style.display = 'none';
  but5Clicked = true;
  
  // S'assurer que green-background reste caché
  if (greenDiv) {
    greenDiv.style.display = 'none';
    greenDiv.style.opacity = '0';
  }
});

// Animation de changement d'images sur sec1img
const images = [
  'image/p1IMG.jpg',
  'image/i1.jpg',
  'image/i2.avif',

];

let currentImageIndex = 0;
let imageInterval;
const sec1img = document.querySelector('.sec1img');

// Fonction pour changer l'image
function changeImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  sec1img.src = images[currentImageIndex];
}

// Événements de la souris
sec1img.addEventListener('mouseenter', () => {
  // Démarrer le changement d'image toutes les 0.1 secondes
  imageInterval = setInterval(changeImage, 70);
});

sec1img.addEventListener('mouseleave', () => {
  // Arrêter le changement d'image et garder l'image actuelle
  clearInterval(imageInterval);
});

const etoil = document.querySelector('.animeetoil');
const greenDiv = document.querySelector('.green-background');

// Variable pour suivre si but5 a été cliqué
let but5Clicked = false;

// Ajouter l'event listener sur nv11
document.querySelector('.nv11').addEventListener('click', () => {
  if (but5Clicked) {
    window.location.reload(); // Recharge la page seulement si but5 a été cliqué
  }
});

// Ajouter l'event listener sur nv12
document.querySelector('.nv12').addEventListener('click', () => {
  if (but5Clicked) {
    window.location.href = window.location.origin + window.location.pathname + '#gallery';
    window.location.reload();
  }
});

// Créer un conteneur fixe pour l'étoile
const etoilContainer = document.createElement('div');
etoilContainer.style.position = 'fixed';
etoilContainer.style.top = '0';
etoilContainer.style.left = '0';
etoilContainer.style.width = '100%';
etoilContainer.style.height = '100%';
etoilContainer.style.pointerEvents = 'none';
etoilContainer.style.zIndex = '1000';
document.body.appendChild(etoilContainer);

// Déplacer l'étoile dans le conteneur fixe
etoilContainer.appendChild(etoil);

// Position initiale de l'étoile
gsap.set(etoil, {
  position: 'absolute',
  top: '60%',
  left: '50%',
  xPercent: -50,
  yPercent: -50,
  scale: 1,
  rotation: 0,
  opacity: 0,
  force3D: true
});

// Animation de rotation et scale pendant le scroll
ScrollTrigger.create({
  trigger: '.s55',
  start: 'top 80%',
  end: '80% top',
  scrub: 2.5,
  scroller: '#smoothWrapper',
  onEnter: () => {
    gsap.to(etoil, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    });
    if (greenDiv && !but5Clicked) {
      greenDiv.style.opacity = '0';
      greenDiv.style.display = 'none';
    }
  },
  onLeave: () => {
    gsap.to(etoil, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });
    if (greenDiv && !but5Clicked) {
      greenDiv.style.display = 'grid';
      gsap.to(greenDiv, {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  },
  onEnterBack: () => {
    gsap.to(etoil, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    });
    if (greenDiv && !but5Clicked) {
      greenDiv.style.opacity = '0';
      greenDiv.style.display = 'none';
    }
  },
  onLeaveBack: () => {
    gsap.to(etoil, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });
    if (greenDiv && !but5Clicked) {
      greenDiv.style.opacity = '0';
      greenDiv.style.display = 'none';
    }
  },
  onUpdate: self => {
    const progress = self.progress;
    etoil.style.transform = `translate(-50%, -50%) scale(${1 + (progress * 150)}) rotate(${progress * 720}deg)`;
  }
});

//// split elements with the class "split" into words and characters
let split = SplitText.create(".split", { 
    type: "lines, words, chars",
    linesClass: "split-line", // Classe pour les lignes
    wordsClass: "split-word", // Classe pour les mots
    charsClass: "split-char"  // Classe pour les caractères
});

// Masquer les balises split-line vides
document.querySelectorAll('.split-line').forEach(line => {
    if (!line.innerHTML.trim()) {
        line.style.display = 'none';
    }
});

gsap.to('.split-word', {
  top:'0%', 
  duration:1,
  stagger:0.02,
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: '.seee2',
    start: 'bottom 20%',
    scroller: '#smoothWrapper',
    toggleActions: 'play none none reverse',
    markers:false
  }
});

// Variable pour suivre l'état du thème
let isDarkTheme = false;

// Fonction pour passer en mode sombre (appelée une seule fois par nvbb2)
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    
    // Animer la transition de couleur pour nvbb et nvbb2
    gsap.to(['.nvbb', '.nvbb2'], {
        color: isDarkTheme ? '#FFFFFF' : '#000000',
        duration: 0.5,
        ease: 'power2.inOut'
    });

    applyTheme();
}

// Fonction pour revenir au mode clair (appelée par nvbb)
function revertTheme() {
    if (isDarkTheme) {
        isDarkTheme = false;
        applyTheme();
    }
}

// Fonction qui applique le thème
function applyTheme() {
    // Sélectionner tous les éléments avec du texte ou des bordures
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
        // Obtenir les styles calculés de l'élément
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        const borderColor = computedStyle.borderColor;
        
        // Inverser la couleur du texte si elle est noire ou blanche
        if (color === 'rgb(0, 0, 0)') {
            element.style.color = 'white';
        } else if (color === 'rgb(255, 255, 255)') {
            element.style.color = 'black';
        }
        
        // Inverser la couleur de fond si elle est noire ou blanche
        if (backgroundColor === 'rgb(0, 0, 0)') {
            element.style.backgroundColor = 'white';
        } else if (backgroundColor === 'rgb(255, 255, 255)') {
            element.style.backgroundColor = 'black';
        }
        
        // Inverser la couleur des bordures si elles sont noires ou blanches
        if (borderColor === 'rgb(0, 0, 0)') {
            element.style.borderColor = 'white';
        } else if (borderColor === 'rgb(255, 255, 255)') {
            element.style.borderColor = 'black';
        }
    });
    
    // Traitement spécifique pour d21
    const d21 = document.querySelector('.d21');
    if (d21) {
        const borderColor = isDarkTheme ? 'white' : 'black';
        d21.style.borderBottom = `1px solid ${borderColor}`;
        d21.style.backgroundImage = `linear-gradient(${borderColor}, ${borderColor}), linear-gradient(${borderColor}, ${borderColor})`;
    }

    // Obtenir la couleur de fond actuelle de la page
    const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
    // Définir la couleur opposée
    const invertedColor = isDarkTheme ? 'white' : 'black';

    // Traitement spécifique pour secc2t3
    const secc2t3 = document.querySelector('.secc2t3');
    if (secc2t3) {
        secc2t3.style.setProperty('color', invertedColor, 'important');
        secc2t3.style.setProperty('z-index', '9999', 'important');
        const styleId = 'secc2t3-style';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `
            .secc2t3 { 
                color: ${invertedColor} !important;
                position: relative !important;
                z-index: 9999 !important;
            }
            .secc2t3 * {
                color: ${invertedColor} !important;
            }
        `;
        Array.from(secc2t3.children).forEach(child => {
            child.style.setProperty('color', invertedColor, 'important');
        });
    }

    // Traitement spécifique pour secc2t32
    const secc2t32 = document.querySelector('.secc2t32');
    if (secc2t32) {
        secc2t32.style.setProperty('color', invertedColor, 'important');
        secc2t32.style.setProperty('z-index', '9999', 'important');
        const styleId = 'secc2t32-style';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `
            .secc2t32 { 
                color: ${invertedColor} !important;
                position: relative !important;
                z-index: 9999 !important;
            }
            .secc2t32 * {
                color: ${invertedColor} !important;
            }
        `;
        Array.from(secc2t32.children).forEach(child => {
            child.style.setProperty('color', invertedColor, 'important');
        });
    }

    // Traitement spécifique pour bu20
    const bu20 = document.querySelector('.bu20');
    if (bu20) {
        bu20.style.setProperty('color', invertedColor, 'important');
        bu20.style.setProperty('border-right', `3px solid ${invertedColor}`, 'important');
        const styleId = 'bu20-style';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `.bu20 { color: ${invertedColor} !important; }`;
    }

    // Traitement spécifique pour secc2t1
    const secc2t1 = document.querySelector('.secc2t1');
    if (secc2t1) {
        secc2t1.style.color = isDarkTheme ? 'white' : 'black';
        secc2t1.style.setProperty('color', isDarkTheme ? 'white' : 'black', 'important');
    }
    
    // Inverser les couleurs des SVG
    const svgPaths = document.querySelectorAll('svg path, svg circle');
    svgPaths.forEach(element => {
        const stroke = element.getAttribute('stroke');
        if (stroke === 'black') {
            element.setAttribute('stroke', 'white');
        } else if (stroke === 'white') {
            element.setAttribute('stroke', 'black');
        }
    });

    // Traitement spécifique pour le cercle SVG
    const circleSvg = document.querySelector('.cercle circle');
    if (circleSvg) {
        circleSvg.setAttribute('stroke', invertedColor);
        const styleId = 'circle-style';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `.cercle circle { stroke: ${invertedColor} !important; }`;
    }

    // Traitement spécifique pour le logo SVG
    const logo = document.querySelector('.logo');
    if (logo) {
        // Créer un filtre pour inverser les couleurs si on est en mode sombre
        const styleId = 'logo-style';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        if (isDarkTheme) {
            // En mode sombre, on inverse les couleurs
            styleElement.textContent = `
                .logo {
                    filter: invert(1) brightness(100%) !important;
                }
            `;
        } else {
            // En mode clair, on retire le filtre
            styleElement.textContent = `
                .logo {
                    filter: none !important;
                }
            `;
        }
    }

    // Traitement spécifique pour animeetoil
    const animeetoil = document.querySelector('.animeetoil');
    if (animeetoil) {
        if (isDarkTheme) {
            animeetoil.style.filter = 'brightness(0) invert(1)';
        } else {
            animeetoil.style.filter = 'none';
        }
    }

    // Traitement spécifique pour secc2t33
    const secc2t33 = document.querySelector('.secc2t33');
    if (secc2t33) {
        secc2t33.style.setProperty('color', invertedColor, 'important');
        secc2t33.style.setProperty('z-index', '9999', 'important');
        const styleId = 'secc2t33-style';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `
            .secc2t33 { 
                color: ${invertedColor} !important;
                position: relative !important;
                z-index: 9999 !important;
            }
            .secc2t33 * {
                color: ${invertedColor} !important;
            }
        `;
        Array.from(secc2t33.children).forEach(child => {
            child.style.setProperty('color', invertedColor, 'important');
        });
    }

    // Traitement spécifique pour secc2t34
    const secc2t34 = document.querySelector('.secc2t34');
    if (secc2t34) {
        secc2t34.style.setProperty('color', invertedColor, 'important');
        secc2t34.style.setProperty('z-index', '9999', 'important');
        const styleId = 'secc2t34-style';
        let styleElement = document.getElementById(styleId);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = `
            .secc2t34 { 
                color: ${invertedColor} !important;
                position: relative !important;
                z-index: 9999 !important;
            }
            .secc2t34 * {
                color: ${invertedColor} !important;
            }
        `;
        Array.from(secc2t34.children).forEach(child => {
            child.style.setProperty('color', invertedColor, 'important');
        });
    }
}

// Intro section scroll animation
window.addEventListener('scroll', () => {
    const introSection = document.querySelector('.intro-section');
    if (window.scrollY > 50) { // Adjust this value to control when the animation triggers
        introSection.classList.add('scrolled');
    } else {
        introSection.classList.remove('scrolled');
    }
});

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    const exploreButton = document.querySelector('.explore-button');
    const introSection = document.querySelector('.intro-section');
    const etoileParts = document.querySelectorAll('.etoile-part');
    let isExplored = false;

    // Initialiser les états de départ des éléments
    gsap.set('.etoile-part', {
        strokeDashoffset: "100%"
    });
    
    // Initialiser les états de départ des éléments nvm, nvw, nvc et les nouveaux éléments
    gsap.set('.nvm', { 
        opacity: 0,
        y: 50
    });
    gsap.set('.nvw', { 
        opacity: 0,
        y: 50
    });
    gsap.set('.nvc', { 
        opacity: 0,
        y: 50,
        scale: 0.8
    });
    gsap.set('.nvt1', { 
        opacity: 0,
        y: 50,
        scale: 0.8
    });
    gsap.set('.nvbb', { 
        opacity: 0,
        y: 50,
        scale: 0.8
    });
    gsap.set('.nvbb2', { 
        opacity: 0,
        y: 50,
        scale: 0.8
    });



    // Fonction pour animer l'étoile
    function animateEtoile() {
        etoileParts.forEach((part, index) => {
            gsap.to(part, {
                strokeDashoffset: 0,
                duration: 0.5,
                delay: 1,
                stagger: 0.15,
                ease: 'power2.inOut'
            });
        });
    }

    // Gérer le clic sur le bouton explore
    exploreButton.addEventListener('click', function() {
        if (!isExplored) {
            isExplored = true;
            // Cacher la section intro
            introSection.classList.add('hidden');
            
            // Animer l'étoile
            gsap.to('.etoile-part', {
                strokeDashoffset: 0,
                duration: 0.5,
                delay: 1,
                stagger: 0.15,
                ease: 'power2.inOut'
            });

            // Ajouter la rotation infinie après l'animation initiale
            gsap.to('.etoile', {
                rotation: 360,
                duration: 10,
                ease: "none",
                repeat: -1
            });

            // Activer les autres animations après un délai
            setTimeout(() => {
                nv1Timeline.play();
                ScrollTrigger.enable();

                // Animer les éléments nvm, nvw et nvc
                gsap.to('.nvm', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    delay: 0.2
                });

                gsap.to('.nvw', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    delay: 0.4
                });

                gsap.to('.nvc', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)',
                    delay: 0.6
                });

                // Animer les nouveaux éléments avec le même effet élastique
                gsap.to('.nvt1', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)',
                    delay: 0.8
                });

                gsap.to('.nvbb', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    color: '#000000',
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)',
                    delay: 1.0
                });

                gsap.to('.nvbb2', {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    color: '#000000',
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)',
                    delay: 1.2
                });


            }, 700);
        }
    });
});

// Initialize GSAP ScrollTrigger and disable it initially
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
ScrollTrigger.disable(); // Disable all scroll triggers initially

// Create smooth scrolling
const smoother = ScrollSmoother.create({
    wrapper: "#smoothWrapper",
    content: "#smoothContent",
    smooth: 2,
    effects: true
});

// Initial setup for scroll elements
gsap.set(['.nvb11', '.sb11'], {
    height: '104%',
    scaleY: 0,
    transformOrigin: 'top'
});

gsap.set(['.nb65', '.nb66', '.sb12'], {
    width: '100%',
    scaleX: 0,
    transformOrigin: 'left'
});

// Images pour la section green-background
const backgroundImages = [
    { src: 'img1.png', class: 'image-one' },
    { src: 'image/fallingwater.jpg', class: 'image-two' },
    { src: 'image/i1.jpg', class: 'image-three' },
   
];

let currentBackgroundImageIndex = 0;

// Gérer le changement d'image dans green-background
document.querySelector('.change-image-btn').addEventListener('click', function() {
    const img1 = document.querySelector('.green-background .img1');
    const counter = document.querySelector('.but4');
    
    currentBackgroundImageIndex = (currentBackgroundImageIndex + 1) % backgroundImages.length;
    const newImage = backgroundImages[currentBackgroundImageIndex];
    
    // Animation de transition
    gsap.to(img1, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            // Retirer toutes les classes d'image précédentes
            img1.classList.remove('image-one', 'image-two', 'image-three', 'image-four');
            // Ajouter la nouvelle classe
            img1.classList.add(newImage.class);
            // Changer la source de l'image
            img1.src = newImage.src;
            // Mettre à jour le compteur
            const currentNumber = currentBackgroundImageIndex + 1;
            counter.textContent = `${currentNumber}/3`;
            
            gsap.to(img1, {
                opacity: 1,
                duration: 0.5
            });
        }
    });
});

// Initialiser la première classe d'image
document.addEventListener('DOMContentLoaded', function() {
    const img1 = document.querySelector('.green-background .img1');
    img1.classList.add(backgroundImages[0].class);
});