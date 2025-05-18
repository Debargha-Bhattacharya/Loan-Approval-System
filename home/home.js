document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Form validation
    const emailInput = document.getElementById('email');
    const connectBtn = document.querySelector('.btn-connect');
    
    connectBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showNotification('Please enter your email address', 'error');
        } else if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
        } else {
            showNotification('Thank you for connecting with us!', 'success');
            emailInput.value = '';
        }
    });
    
    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add subtle animations on scroll
    const addScrollAnimation = () => {
        const elements = document.querySelectorAll('.hero-text h1, .hero-text h2, .hero-text p, .stats, .btn-outline, .get-started-box, .dashboard-preview, .user-illustration, .cta h2, .cta p, .footer-contact, .link-column');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    };
    
    // Only add scroll animations if the user doesn't prefer reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Delay the animation slightly to ensure content is visible first
        setTimeout(addScrollAnimation, 500);
    }

    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add any logout logic here (clearing sessions, etc.)
            
            // Redirect to login page
            window.location.href = '/login/login.html';
        });
    }

    // Chat popup functionality
    const chatBubble = document.querySelector('.chat-bubble');
    const chatPopup = document.querySelector('.chat-popup');
    const closePopupBtn = document.querySelector('.close-popup-btn');
    const expandBtn = document.querySelector('.expand-btn');
    
    // Toggle chat popup
    chatBubble.addEventListener('click', function() {
        chatPopup.style.display = 'flex';
        chatPopup.style.animation = 'slideUp 0.3s ease-out forwards';
    });
    
    // Close popup
    closePopupBtn.addEventListener('click', function() {
        chatPopup.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => {
            chatPopup.style.display = 'none';
        }, 300);
    });
    
    // Expand to full chatbot
    expandBtn.addEventListener('click', function() {
        window.location.href = '/chatbot/chatbot.html';
    });
    
    // Handle chat input
    const chatInput = document.getElementById('popupInput');
    const sendButton = document.querySelector('.send-button');
    const messagesContainer = document.getElementById('popupMessages');
    
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: 'numeric',
            hour12: true 
        });
    }

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        let messageHTML = '';
        
        if (!isUser) {
            messageHTML += `
                <div class="bot-icon message-icon">
                    <i class="fas fa-robot"></i>
                </div>
            `;
        }
        
        messageHTML += `
            <div class="message-wrapper">
                <div class="message-content">
                    ${message}
                </div>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
        
        messageDiv.innerHTML = messageHTML;
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getBotResponse(userMessage) {
        // Simple bot responses based on keywords
        const message = userMessage.toLowerCase();
        if (message.includes('hello') || message.includes('hi')) {
            return "Hello! How can I help you with your loan today?";
        } else if (message.includes('loan')) {
            return "I can help you with loan information. Would you like to know about our loan types, eligibility criteria, or application process?";
        } else if (message.includes('eligibility')) {
            return "To check your loan eligibility, we consider factors like income, credit score, and employment status. Would you like to start an eligibility check?";
        } else if (message.includes('document')) {
            return "For loan application, you'll need: ID proof, address proof, income proof, and bank statements. Would you like the detailed list?";
        } else if (message.includes('interest')) {
            return "Our interest rates start from 10.5% per annum. The exact rate depends on your profile and loan type. Would you like to know more?";
        } else {
            return "I'm here to help with your loan-related queries. Could you please be more specific about what you'd like to know?";
        }
    }

    function handleUserMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            chatInput.value = '';

            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            messagesContainer.appendChild(typingIndicator);

            // Simulate bot typing
            setTimeout(() => {
                typingIndicator.remove();
                const botResponse = getBotResponse(message);
                addMessage(botResponse, false);
            }, 1500);
        }
    }

    // Send message on button click
    sendButton.addEventListener('click', handleUserMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // Add initial bot message
    addMessage("Hello! 👋 I'm your loan assistant. How can I help you today?", false);

    const slides = document.querySelectorAll('.step-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let isTransitioning = false;

    function updateSlides() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Remove all classes first
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'next', 'prev');
            indicators[index].classList.remove('active');
        });

        // Add appropriate classes
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');

        // Add next class
        const nextIndex = (currentSlide + 1) % slides.length;
        slides[nextIndex].classList.add('next');

        // Add prev class
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        slides[prevIndex].classList.add('prev');

        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function nextSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        if (isTransitioning) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (isTransitioning || currentSlide === index) return;
            currentSlide = index;
            updateSlides();
        });
    });

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;
    const carousel = document.querySelector('.steps-carousel');

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            nextSlide();
        } else if (touchEndX - touchStartX > 50) {
            prevSlide();
        }
    });

    // Initialize first slide
    updateSlides();

    // Auto-advance slides
    let autoSlideInterval = setInterval(nextSlide, 8000);

    // Reset interval on user interaction
    function resetInterval() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 8000);
    }

    nextBtn.addEventListener('click', resetInterval);
    prevBtn.addEventListener('click', resetInterval);
    indicators.forEach(indicator => {
        indicator.addEventListener('click', resetInterval);
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    const phoneScreen = document.querySelector('.phone-screen');
    const screens = ['eligibility.png', 'loan-form.png', 'verification.png', 'approved.png'];
    let currentStep = 0;
    let autoScrollInterval;
    let userScrolling = false;
    let lastScrollTime = Date.now();

    function updateActiveState(index) {
        timelineItems.forEach((item, i) => {
            const dot = item.querySelector('.timeline-dot');
            if (i === index) {
                item.classList.add('active');
                dot.classList.add('active');
                phoneScreen.src = screens[i];
                
                // Smooth scroll to active item
                if (!userScrolling) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                item.classList.remove('active');
                dot.classList.remove('active');
            }
        });
    }

    // Auto scroll function
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (!userScrolling && Date.now() - lastScrollTime > 2000) {
                currentStep = (currentStep + 1) % timelineItems.length;
                updateActiveState(currentStep);
            }
        }, 30000); // 30 seconds interval
    }

    // Handle manual scrolling
    const timelineContainer = document.querySelector('.steps-timeline');
    timelineContainer.addEventListener('scroll', () => {
        userScrolling = true;
        lastScrollTime = Date.now();
        
        // Find the most visible item
        let maxVisibility = 0;
        let mostVisibleIndex = 0;
        
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const visibility = Math.min(rect.bottom, window.innerHeight) - 
                             Math.max(rect.top, 0);
            
            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                mostVisibleIndex = index;
            }
        });

        updateActiveState(mostVisibleIndex);
        currentStep = mostVisibleIndex;

        // Reset userScrolling flag after scroll ends
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
            userScrolling = false;
        }, 150);
    });

    // Initialize
    updateActiveState(0);
    startAutoScroll();

    // Reset interval when user interacts with the timeline
    timelineContainer.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });

    timelineContainer.addEventListener('mouseleave', () => {
        startAutoScroll();
    });
});

function createMoneyElement() {
    const container = document.querySelector('.money-container');
    const money = document.createElement('div');
    money.className = `money ${Math.random() > 0.5 ? 'coin' : 'bill'}`;
    
    // Random horizontal position
    money.style.left = `${Math.random() * 100}%`;
    
    container.appendChild(money);
    
    // Remove the element after animation
    money.addEventListener('animationend', () => {
        money.remove();
    });
}

// Create new money elements periodically
setInterval(createMoneyElement, 1000);