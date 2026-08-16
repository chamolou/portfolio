




gsap.registerPlugin(ScrollTrigger, ScrollSmoother);



var smoother = ScrollSmoother.create({
    content: "#smoothContent",
    smooth: 2,
    effects: true

});




// Créer une scène
const scene = new THREE.Scene();

// Créer une caméra

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// Créer un rendu
const renderer = new THREE.WebGLRenderer({ alpha: true });
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

const bakedTexture = textureLoader.load('3d2/textures/Textured_baseColor.jpeg');
bakedTexture.flipY = false;
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });


loader.load('3d2/animasionmessi13.glb', (gltf) => {
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
}, undefined, (error) => {
    console.error('Erreur de chargement du modèle:', error);
});













const mouse = { x: 0, y: 0 };

document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Utilisez la position de la souris pour effectuer des modifications légères
    const rotationIntensity = 0.09; // Augmentez cette valeur pour un effet plus fort

    gsap.to(camera.rotation,
        {
            duration: 2,
            x: (mouse.y / window.innerHeight - 0.5) * rotationIntensity,
            y: (mouse.x / window.innerWidth - 0.5) * rotationIntensity,

        });
    // Mettez à jour la scène
    renderer.render(scene, camera);
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
            

gsap.to(".arturo4", {
  opacity:1, duration: 5, stagger:1,  scrollTrigger: {
          trigger: ".section4",
          start: "top 50%",
          markers: false
      }
});
          
   








gsap.to("#t1 path", {
    fill: "white", // Couleur de destination en descendant
    duration: 1,
    scrollTrigger: {
      trigger: ".section2",
      start: "top 10%",
      markers: false,
      onEnter: () => {
        // Animation lorsque tu scrolles vers le bas
        gsap.to("#t1 path", { fill: "white", duration: 1 });
        gsap.to("#t2 path", { fill: "rgb(149, 22, 22)", duration: 1 });
      },
      onLeaveBack: () => {
        // Animation lorsque tu scrolles vers le haut (inversée)
        gsap.to("#t1 path", { fill: "rgb(149, 22, 22)", duration: 1 });
        gsap.to("#t2 path", { fill: "white", duration: 1 });
      }
    }
  });



  gsap.to("#t2 path", {
    fill: "white", // Couleur de destination en descendant
    duration: 1,
    scrollTrigger: {
      trigger: ".section4",
      start: "top 10%",
      markers: false,
      onEnter: () => {
        // Animation lorsque tu scrolles vers le bas
        gsap.to("#t2 path", { fill: "white", duration: 1 });
        gsap.to("#t3 path", { fill: "rgb(149, 22, 22)", duration: 1 });
      },
      onLeaveBack: () => {
        // Animation lorsque tu scrolles vers le haut (inversée)
        gsap.to("#t2 path", { fill: "rgb(149, 22, 22)", duration: 1 });
        gsap.to("#t3 path", { fill: "white", duration: 1 });
      }
    }
  });


  gsap.to("#t3 path", {
    fill: "white", // Couleur de destination en descendant
    duration: 1,
    scrollTrigger: {
      trigger: ".section6",
      start: "top 10%",
      markers: false,
      onEnter: () => {
        // Animation lorsque tu scrolles vers le bas
        gsap.to("#t3 path", { fill: "white", duration: 1 });
        gsap.to("#t4 path", { fill: "rgb(149, 22, 22)", duration: 1 });
      },
      onLeaveBack: () => {
        // Animation lorsque tu scrolles vers le haut (inversée)
        gsap.to("#t3 path", { fill: "rgb(149, 22, 22)", duration: 1 });
        gsap.to("#t4 path", { fill: "white", duration: 1 });
      }
    }
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


gsap.from('.startdos', { duration: 4, opacity: 0, stagger: 0.5, delay:0.5 })


document.querySelector('.qadc').addEventListener('mouseover', function() {
  document.querySelector('canvas').style.mixBlendMode = 'luminosity';
});

document.querySelector('.qadc').addEventListener('mouseout', function() {
  document.querySelector('canvas').style.mixBlendMode = 'color-dodge'; 
});

document.querySelector('.qadq').addEventListener('mouseover', function() {
  document.querySelector('canvas').style.mixBlendMode = 'normal';
});

document.querySelector('.qadq').addEventListener('mouseout', function() {
  document.querySelector('canvas').style.mixBlendMode = 'color-dodge'; 
});


document.querySelector('.qadt').addEventListener('mouseover', function() {
  document.querySelector('canvas').style.mixBlendMode = 'plus-lighter';
});

document.querySelector('.qadt').addEventListener('mouseout', function() {
  document.querySelector('canvas').style.mixBlendMode = 'color-dodge'; 
});

document.querySelector('.qadd').addEventListener('mouseover', function() {
  document.querySelector('canvas').style.mixBlendMode = 'soft-light';
  document.querySelector('canvas').style.filter = 'brightness(2)';
});

document.querySelector('.qadd').addEventListener('mouseout', function() {
  document.querySelector('canvas').style.mixBlendMode = 'color-dodge'; 
  document.querySelector('canvas').style.filter = 'brightness(1.1)'; 
});



document.querySelector('.qadu').addEventListener('mouseover', function() {
  document.querySelector('canvas').style.mixBlendMode = 'difference';
});

document.querySelector('.qadu').addEventListener('mouseout', function() {
  document.querySelector('canvas').style.mixBlendMode = 'color-dodge'; 
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



