document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.phone-screen-carousel');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineDots = document.querySelectorAll('.timeline-dot');
    let currentSlide = 0;
    const totalSlides = timelineItems.length;

    // Function to update carousel position and timeline
    function updateCarousel() {
        carousel.style.transform = `translateY(-${currentSlide * 25}%)`;
        
        // Update timeline items
        timelineItems.forEach((item, index) => {
            if (index === currentSlide) {
                item.classList.add('active');
                timelineDots[index].classList.add('active');
            } else {
                item.classList.remove('active');
                timelineDots[index].classList.remove('active');
            }
        });
    }

    // Add click event listeners to timeline items
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Auto-advance carousel every 4 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 4000);

    // Add touch/swipe support
    let touchStartY = 0;
    let touchEndY = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < totalSlides - 1) {
                // Swipe up
                currentSlide++;
            } else if (diff < 0 && currentSlide > 0) {
                // Swipe down
                currentSlide--;
            }
            updateCarousel();
        }
    }

    // Initialize first slide
    updateCarousel();
}); 