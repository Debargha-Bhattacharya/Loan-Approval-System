document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const phone = document.querySelector('.phone');
    let currentIndex = 0;
    let autoChangeInterval;
    
    // For debugging
    console.log('LoanSteps.js loaded!');
    console.log('Found timeline items:', timelineItems.length);
    console.log('Found phone element:', phone);
    
    // Setup the phone image once
    if (phone && phone.querySelector('img')) {
        // Image already exists in HTML
        console.log('Image already exists in HTML');
    } else if (phone) {
        // Create and append single phone screen image
        const img = document.createElement('img');
        img.src = 'mo.png';
        img.alt = 'Phone Preview';
        img.className = 'phone-screen';
        phone.appendChild(img);
        console.log('Added image to phone element');
    } else {
        console.error('Phone element not found!');
    }

    // Function to update active state
    const updateActiveState = (index) => {
        console.log('Updating active state to index:', index);
        
        // Remove active class from all items
        timelineItems.forEach(item => {
            item.classList.remove('active');
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                dot.classList.remove('active');
            }
        });
        
        // Add active class to current item
        const currentItem = timelineItems[index];
        if (currentItem) {
            currentItem.classList.add('active');
            const dot = currentItem.querySelector('.timeline-dot');
            if (dot) {
                dot.classList.add('active');
            }
        }
    };
    
    // Function to move to the next step
    const nextStep = () => {
        currentIndex = (currentIndex + 1) % timelineItems.length;
        console.log('Moving to next step:', currentIndex);
        updateActiveState(currentIndex);
    };
    
    // Initialize auto-change interval (4 seconds)
    const startAutoChange = () => {
        if (autoChangeInterval) clearInterval(autoChangeInterval);
        autoChangeInterval = setInterval(nextStep, 4000);
        console.log('Auto-change interval started');
    };
    
    // Initialize first item as active
    updateActiveState(currentIndex);
    startAutoChange();
    
    // Handle manual clicks on timeline items
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            console.log('Timeline item clicked:', index);
            currentIndex = index;
            updateActiveState(currentIndex);
            
            // Reset the timer when manually clicked
            startAutoChange();
        });
    });
    
    // Pause on hover
    const timelineContainer = document.querySelector('.steps-timeline');
    if (timelineContainer) {
        timelineContainer.addEventListener('mouseenter', () => {
            console.log('Pausing auto-change on hover');
            clearInterval(autoChangeInterval);
        });
        
        timelineContainer.addEventListener('mouseleave', () => {
            console.log('Resuming auto-change after hover');
            startAutoChange();
        });
    }
}); 