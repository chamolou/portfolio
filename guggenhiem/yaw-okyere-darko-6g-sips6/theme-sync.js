// Applique le thème "in black" choisi sur index.html, pour que le choix
// reste actif en naviguant vers cette page (index2 / index3).
(function () {
    function applyStoredTheme() {
        if (localStorage.getItem('yawTheme') !== 'dark') return;

        // Toutes les couleurs sont relevées avant d'en inverser une seule : sinon un
        // texte qui hérite du blanc tout juste donné à son parent serait réinversé
        // en noir (texte noir sur fond noir)
        var snapshot = Array.prototype.map.call(document.querySelectorAll('*'), function (element) {
            var cs = window.getComputedStyle(element);
            return { element: element, color: cs.color, backgroundColor: cs.backgroundColor, borderColor: cs.borderColor };
        });

        snapshot.forEach(function (item) {
            var element = item.element, cs = item;

            if (cs.color === 'rgb(0, 0, 0)') {
                element.style.color = 'white';
            } else if (cs.color === 'rgb(255, 255, 255)') {
                element.style.color = 'black';
            }

            if (cs.backgroundColor === 'rgb(0, 0, 0)') {
                element.style.backgroundColor = 'white';
            } else if (cs.backgroundColor === 'rgb(255, 255, 255)') {
                element.style.backgroundColor = 'black';
            }

            if (cs.borderColor === 'rgb(0, 0, 0)') {
                element.style.borderColor = 'white';
            } else if (cs.borderColor === 'rgb(255, 255, 255)') {
                element.style.borderColor = 'black';
            }
        });

        // Les logos SVG sont noirs : inversés en blanc, comme le logo de l'accueil
        document.querySelectorAll('img[src$=".svg"]').forEach(function (img) {
            img.style.filter = 'invert(1)';
        });
    }

    document.addEventListener('DOMContentLoaded', applyStoredTheme);
})();
