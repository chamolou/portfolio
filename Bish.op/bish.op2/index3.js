// Infinite star rotation (index3 / contact page).
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const star = document.querySelector('.star-svg');
        if (!star || !window.gsap) return;

        gsap.to(star, {
            rotation: 360,
            duration: 3,
            ease: 'none',
            repeat: -1,
            transformOrigin: '50% 50%'
        });
    });
})();
