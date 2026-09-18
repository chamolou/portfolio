// Lightbox générique pour les images des pages projet individuelles (.right)
document.addEventListener('DOMContentLoaded', function () {
    const gallery = document.querySelector('.right');
    if (!gallery) return;

    const images = gallery.querySelectorAll('img');
    if (!images.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'img-lightbox';
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

    images.forEach(function (img) {
        img.classList.add('is-zoomable');
        img.addEventListener('click', function (e) {
            e.stopPropagation();
            openLightbox(img);
        });
    });

    lightbox.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });
});
