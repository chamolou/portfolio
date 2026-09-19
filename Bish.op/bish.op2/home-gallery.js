// Home page: "photo one" slides the carousel up from the bottom, the other
// gallery rows show a "not added yet" message instead.
document.addEventListener('DOMContentLoaded', function () {
    const rows = document.querySelectorAll('[class$="-galery"]');
    const carousel = document.querySelector('.carrousel');
    const message = document.querySelector('.gallery-empty');
    if (!rows.length || !carousel || !message) return;

    // "photo one" is already open when the page loads (see index.html).
    let activeRow = document.querySelector('[class$="-galery"][data-active]');

    function panelFor(row) {
        return row.dataset.gallery === 'carousel' ? carousel : message;
    }

    // Where each panel rests when it is closed.
    function closedState(panel) {
        return panel === carousel ? { y: '100%' } : { y: 30, opacity: 0 };
    }

    function showPanel(panel) {
        const wasOpen = panel.classList.contains('is-open');
        panel.classList.add('is-open');
        if (!window.gsap) return;

        gsap.killTweensOf(panel);
        // Interrupting a closing animation keeps the current position.
        if (!wasOpen) gsap.set(panel, closedState(panel));
        gsap.to(panel, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            onComplete: function () {
                gsap.set(panel, { clearProps: 'transform,opacity' });
            }
        });
    }

    function hidePanel(panel) {
        function done() {
            panel.classList.remove('is-open');
            if (window.gsap) gsap.set(panel, { clearProps: 'transform,opacity' });
        }
        if (!window.gsap) return done();

        gsap.killTweensOf(panel);
        gsap.to(panel, Object.assign({
            duration: 0.6,
            ease: 'power3.in',
            onComplete: done
        }, closedState(panel)));
    }

    rows.forEach(function (row) {
        row.addEventListener('click', function () {
            const next = row === activeRow ? null : row;
            const prevPanel = activeRow && panelFor(activeRow);
            const nextPanel = next && panelFor(next);

            if (activeRow) activeRow.removeAttribute('data-active');
            if (next) next.setAttribute('data-active', '');

            if (prevPanel && prevPanel !== nextPanel) hidePanel(prevPanel);
            if (nextPanel && nextPanel !== prevPanel) showPanel(nextPanel);
            activeRow = next;
        });
    });
});
