// Lightbox: click a gallery image to view it enlarged.
document.addEventListener('DOMContentLoaded', function () {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    // Build the overlay once.
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Fermer">close ✕</button>
        <img src="" alt="">
    `;
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
        overlayImg.src = src;
        overlayImg.alt = alt || '';
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item) {
        const img = item.querySelector('img');
        if (!img) return;
        item.addEventListener('click', function () {
            openLightbox(img.src, img.alt);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    // Click outside the image (on the dark backdrop) closes it.
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeLightbox();
    });

    // Escape key closes it.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeLightbox();
        }
    });
});