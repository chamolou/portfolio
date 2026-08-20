// ============================================
// PROJECT — page-specific script
// (le clic sur ".h2" et le comportement du header/carrousel
// restent gérés par index.js, commun à toutes les pages)
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const grid = document.querySelector('.pj-grid');
    if (!grid) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'pj-lightbox';
    const lightboxImg = document.createElement('img');
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    function openLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    grid.addEventListener('click', function (e) {
        const img = e.target.closest('.pj-item img');
        if (img) openLightbox(img);
    });

    lightbox.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });
});