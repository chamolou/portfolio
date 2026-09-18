// Applique le thème "in black" choisi sur index.html, pour que le choix
// reste actif en naviguant vers cette page (index2 / index3).
(function () {
    function applyStoredTheme() {
        if (localStorage.getItem('yawTheme') !== 'dark') return;

        document.querySelectorAll('*').forEach(function (element) {
            var cs = window.getComputedStyle(element);

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
    }

    document.addEventListener('DOMContentLoaded', applyStoredTheme);
})();
