




gsap.registerPlugin(ScrollTrigger, ScrollSmoother);



var smoother = ScrollSmoother.create({
    content: "#smoothContent",
    smooth: 2,
    effects: true

});

// First visit of the session: intro.js covers the page while the scene loads (it only
// defines window.MessiIntro in that case). The page can't scroll under the cover.
const messiIntro = window.MessiIntro;
if (messiIntro) {
    smoother.paused(true);
    messiIntro.onLeave(() => smoother.paused(false));
}

// The intro counter follows the real loading progress: the model is most of the weight.
const loadProgress = { model: 0, texture: 0 };

function reportProgress() {
    const total = loadProgress.model * 0.7 + loadProgress.texture * 0.3;
    if (total >= 1) {
        // Draw once now so the 4096px texture is uploaded to the GPU while the intro
        // still covers the page, not during the reveal.
        renderer.render(scene, camera);
    }
    if (messiIntro) messiIntro.setProgress(total);
}




// Créer une scène
const scene = new THREE.Scene();

// Créer une caméra

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Créer un rendu
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Ajouter la classe 'start' au canvas
renderer.domElement.classList.add('startdos');

// Ajouter le canvas au document
document.body.appendChild(renderer.domElement);




//agrandir la scene en fonction de la fenetre

window.addEventListener('resize', (event) => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    renderer.setSize(newWidth, newHeight);

    // Mettez à jour le rapport d'aspect de la caméra
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
});


const container = new THREE.Object3D();
scene.add(container);


//creation materiel
const material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 1, // 1 pour un matériau métallique
    roughness: 0.2, // Rugosité (0 à 1, 0 = lisse, 1 = rugueux)
});


//:light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0); // Couleur blanche avec une intensité de 1
directionalLight.position.set(1, 1, 1); // Position de la lumière directionnelle
scene.add(directionalLight);


const loader = new THREE.GLTFLoader();

let mixer; // Déclarez une variable pour stocker l'animation mixer
// Charger le modèle

//const bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })


// Texture loader
const textureLoader = new THREE.TextureLoader();

// Same baked texture and model as before, re-encoded lighter (the model without the PBR
// textures it carried but never used: 4.8 MB instead of 17.3 MB, texture 1.7 MB instead of 4.2 MB)
const bakedTexture = textureLoader.load('3d2/textures/Textured_baseColor_lite.jpg', () => {
    loadProgress.texture = 1;
    reportProgress();
}, undefined, () => {
    loadProgress.texture = 1; // don't keep the intro waiting on a failed texture
    reportProgress();
});
bakedTexture.flipY = false;
bakedTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });


loader.load('3d2/animasionmessi13_lite.glb', (gltf) => {
    const model = gltf.scene;
    // Changer la taille du modèle
    const scale = 1.7; // Modifiez cette valeur en fonction de la taille souhaitée

    model.scale.set(scale, scale, scale);
    model.position.x = 0.1;
    model.position.y = -0.1;
    model.rotation.y = 8;
    





    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = bakedMaterial;
        }
    });




    mixer = new THREE.AnimationMixer(model);
    let totalDuration;


    gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);

        // Mettre l'animation en pause au début après avoir mis en play
        action.play();
        action.paused = true;
        totalDuration = clip.duration;///elles ont toute la meme duree


        gsap.to(action, {
            time: totalDuration, // Définissez ici le pourcentage de progression souhaité (0 à 1)

            scrollTrigger: {
                trigger: ".section1",
                start: "top 20%",
                end: "+=550%",
                scrub: true,
                markers: false
            }
        });
    });

    // gsap.to (model.scale,
    //     {
    //         x:  0.2, // Rotation de 360 degrés autour de l'axe X
    //   y: 0.2, // Rotation de 360 degrés autour de l'axe Y

    //    scrollTrigger:{
    //     trigger: '.section1',
    //     start: "40% center",
    //     end: "center 10%",
    //     scrub:true,

    //               }

    //     })

    container.add(model);

    // Vous pouvez ajouter des transformations, des matériaux, etc. au modèle ici
    loadProgress.model = 1;
    reportProgress();
}, (event) => {
    if (event.lengthComputable) {
        loadProgress.model = Math.min(event.loaded / event.total, 0.99);
        reportProgress();
    }
}, (error) => {
    console.error('Erreur de chargement du modèle:', error);
    loadProgress.model = 1; // don't keep the intro waiting on a failed model
    reportProgress();
});













// One reusable tween per axis instead of a new one on every mouse event; the render loop
// below already redraws the scene every frame.
const cameraRotX = gsap.quickTo(camera.rotation, 'x', { duration: 2 });
const cameraRotY = gsap.quickTo(camera.rotation, 'y', { duration: 2 });

document.addEventListener('mousemove', function (e) {
    // Utilisez la position de la souris pour effectuer des modifications légères
    const rotationIntensity = 0.09; // Augmentez cette valeur pour un effet plus fort

    cameraRotX((e.clientY / window.innerHeight - 0.5) * rotationIntensity);
    cameraRotY((e.clientX / window.innerWidth - 0.5) * rotationIntensity);
});




const clock = new THREE.Clock();
// Animation
const animate = () => {

    container.rotation.x += 0.0000001;
    container.rotation.y += 0.000001;

    if (mixer) {
        const delta = clock.getDelta(); // Utilisez une instance de Clock pour suivre le temps
        mixer.update(delta);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();


gsap.to(".arturo", {
    opacity:1, duration: 2, scrollTrigger: {
            trigger: ".section2",
            start: "top 50%",
            markers: false
        }
 });
    
gsap.to(".arturo2", {
        opacity:1, duration: 3, scrollTrigger: {
                trigger: ".section2",
                start: "top 50%",
                markers: false
            }
});
gsap.to(".arturo3", {
    opacity:1, duration: 3, scrollTrigger: {
            trigger: ".section3",
            start: "top 50%",
            markers: false
        }
});
            

   








// Menu diamonds: the one for the current part of the page is lit (red), the others are white.
// Between two parts of the page the red is handed over from one diamond to the next as you
// scroll: it drains out of the current diamond from the top while it fills the next one. Each
// hand-off is scrubbed over the last third of a screen before the next part reaches the top,
// so it follows the (smoothed) scroll and reverses exactly when scrolling back up.
const diamonds = [...document.querySelectorAll('.menu .t')];
const handoffs = [0, 0, 0]; // progress 0 → 1 of the hand-off between diamond i and i + 1

// the red copy of each diamond, clipped to its lit part in style.css
diamonds.forEach((diamond) => {
  const base = diamond.querySelector('path');
  const lit = base.cloneNode();
  lit.classList.add('t-lit');
  base.after(lit);
});

function paintDiamonds() {
  diamonds.forEach((diamond, index) => {
    const arrived = index === 0 ? 1 : handoffs[index - 1];
    const left = index === diamonds.length - 1 ? 0 : handoffs[index];
    diamond.style.setProperty('--a', left);
    diamond.style.setProperty('--b', arrived);
  });

  // the "current" diamond changes halfway through a hand-off
  const current = handoffs.filter((progress) => progress >= 0.5).length;
  diamonds.forEach((diamond, index) => diamond.classList.toggle('is-active', index === current));
}

// hand-off 1 leads into section 2, 2 into section 4, 3 into section 6
['.section2', '.section4', '.section6'].forEach((selector, index) => {
  ScrollTrigger.create({
    trigger: selector,
    start: "top 45%",
    end: "top 10%",
    // the progress is stored on every update and on every refresh (page load, resize), so
    // the result depends only on where the page is, not on the order the callbacks run in
    onUpdate: (self) => { handoffs[index] = self.progress; paintDiamonds(); },
    onRefresh: (self) => { handoffs[index] = self.progress; paintDiamonds(); }
  });
});

  // let top = ScrollSmother.create({});

  //     button.addEventListener("click", () => top.scrollTo("#oo", true, "top 100px"));   

  // gsap.from('.startdos', { duration: 1, opacity: 0, stagger: 0.5, delay:2, })

  const video = document.getElementById('video');

        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

// The 13 MB film only starts downloading when section 6 is one screen away, so it doesn't
// compete with the 3D scene at load. "metadata" is enough to show its first frame.
const videoSection = document.querySelector('.section6');
if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            video.preload = 'metadata';
            video.load();
            videoObserver.disconnect();
        }
    }, { rootMargin: '100% 0px' });
    videoObserver.observe(videoSection);
} else {
    video.preload = 'metadata';
}

// The "mute" label in the header now does what it says (the film has a soundtrack)
const muteButton = document.getElementById('mute');

muteButton.addEventListener('click', () => {
    video.muted = !video.muted;
    muteButton.textContent = video.muted ? 'unmute' : 'mute';
    muteButton.setAttribute('aria-pressed', String(video.muted));
});

// The header buttons are <div role="button">: Enter and Space activate them too
document.querySelectorAll('.header [role="button"]').forEach((element) => {
    element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            element.click();
        }
    });
});


// With the intro, the title fades in as the cover lifts; without it, straight away as before
const fadeInHero = () => gsap.fromTo('.startdos', { opacity: 0 }, { opacity: 1, duration: 4, stagger: 0.5, delay:0.5 });
if (messiIntro) {
    gsap.set('.startdos', { opacity: 0 });
    messiIntro.onLeave(fadeInHero);
} else {
    fadeInHero();
}


// Hovering one of the blend-mode labels changes how the shoe is blended with the page. CSS can't
// animate mix-blend-mode, so instead of cutting from one look to the next the shoe dissolves out
// (with a blur), the mode is swapped while it is invisible, then it dissolves back in.
const shoeCanvas = document.querySelector('canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEFAULT_LOOK = { mode: 'color-dodge', brightness: 1.1, grayscale: 0.2 };
const shoeLook = { dip: 0, brightness: DEFAULT_LOOK.brightness, grayscale: DEFAULT_LOOK.grayscale };
let shownMode = DEFAULT_LOOK.mode;
let lookTimeline = null;

function paintShoeLook() {
  shoeCanvas.style.opacity = shoeLook.dip ? 1 - shoeLook.dip : '';
  shoeCanvas.style.filter = `brightness(${shoeLook.brightness}) grayscale(${shoeLook.grayscale})`
    + (shoeLook.dip ? ` blur(${shoeLook.dip * 12}px)` : '');
}

function setShoeLook(look) {
  if (lookTimeline) lookTimeline.kill();

  if (reduceMotion) {
    Object.assign(shoeLook, { dip: 0, brightness: look.brightness, grayscale: look.grayscale });
    shoeCanvas.style.mixBlendMode = shownMode = look.mode;
    paintShoeLook();
    return;
  }

  lookTimeline = gsap.timeline({ onUpdate: paintShoeLook });
  // A look that is only passed over (the pointer leaves before the dip is complete) never gets
  // swapped: the shoe just fades back in as it was
  if (look.mode !== shownMode) {
    lookTimeline
      .to(shoeLook, { dip: 1, duration: 0.2, ease: 'power2.in' })
      .call(() => { shoeCanvas.style.mixBlendMode = shownMode = look.mode; });
  }
  lookTimeline.to(shoeLook, {
    dip: 0,
    brightness: look.brightness,
    grayscale: look.grayscale,
    duration: 0.6,
    ease: 'power2.out'
  });
}

[
  ['.qadu', { mode: 'difference', brightness: 1.1, grayscale: 0.2 }],
  ['.qadd', { mode: 'soft-light', brightness: 2, grayscale: 0 }],
  ['.qadt', { mode: 'plus-lighter', brightness: 1.1, grayscale: 0.2 }],
  ['.qadq', { mode: 'normal', brightness: 1.1, grayscale: 0.2 }],
  ['.qadc', { mode: 'luminosity', brightness: 1.1, grayscale: 0.2 }]
].forEach(([selector, look]) => {
  const label = document.querySelector(selector);
  // pointerenter/leave don't bubble from the label's children, unlike mouseover/mouseout
  label.addEventListener('pointerenter', () => setShoeLook(look));
  label.addEventListener('pointerleave', () => setShoeLook(DEFAULT_LOOK));
});




let button = document.getElementById("button");

button.addEventListener("click", () => {
  smoother.scrollTo(".section1", true, "top 100px");
});



const elements = document.querySelectorAll('.grand');


elements.forEach(element => {

    element.addEventListener('mouseenter', () => {

        element.style.cursor = 'pointer';
    });


    element.addEventListener('mouseleave', () => {



        element.style.cursor = '';
    });
});



