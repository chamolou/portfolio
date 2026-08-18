







document.querySelector('.but5').addEventListener('click', function () {
 
    const secc1 = document.querySelector('.secc1');
    const secc2 = document.querySelector('.secc2');
    const secc3 = document.querySelector('.secc3');
    const secc4 = document.querySelector('.secc4');

   

    // Afficher/masquer les sections
    secc1.style.display = 'none';
    secc2.style.display = 'grid';
    secc3.style.display = 'grid';
    secc4.style.display = 'grid';



demarrer()


  });



    
    function demarrer() {


 const smoother = ScrollSmoother.create({
  content: "#smoothContent",
  smooth: 2,
  effects: true

  });
 

ScrollTrigger.create({
  trigger: ".secc3d1",          // Élément déclencheur
  start: "top -4%",                  // Début de l'effet (quand le haut de l'élément atteint le haut de la fenêtre)
  end: "+=40%",                      // Fin de l'effet (500px de défilement après le début)
  pin: true,                         // Activer l'épinglage
  pinSpacing: false,                 // Supprimer l'espacement ajouté par défaut
  markers: false,    
})

}