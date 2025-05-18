document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const sections = document.querySelectorAll('.form-section');
    const steps = document.querySelectorAll('.step');
    const progress = document.querySelector('.progress');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    // submitBtn was already declared above
    
    let currentSection = 0;
    
    // Initialize form
    updateForm();

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentSection > 0) {
            currentSection--;
            updateForm();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSection < sections.length - 1) {
            currentSection++;
            updateForm();
        }
    });

    // Update form state
    function updateForm() {
        sections.forEach((section, index) => {
            section.classList.remove('active');
            steps[index].classList.remove('active');
            
            if (index === currentSection) {
                section.classList.add('active');
                steps[index].classList.add('active');
            }
        });

        // Update progress bar
        progress.style.width = `${((currentSection + 1) / sections.length) * 100}%`;

        // Update buttons
        prevBtn.disabled = currentSection === 0;
        
        if (currentSection === sections.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    }

    // Number input controls
    const numberInputs = document.querySelectorAll('.number-input');
    numberInputs.forEach(container => {
        const input = container.querySelector('input');
        const minusBtn = container.querySelector('.minus');
        const plusBtn = container.querySelector('.plus');

        minusBtn.addEventListener('click', () => {
            if (input.value > parseInt(input.min)) {
                input.value = parseInt(input.value) - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            if (input.value < parseInt(input.max)) {
                input.value = parseInt(input.value) + 1;
            }
        });
    });

    // Range slider
    const rangeSlider = document.querySelector('.range-slider input');
    const rangeValue = document.querySelector('.range-value');

    rangeSlider.addEventListener('input', function() {
        const value = parseInt(this.value).toLocaleString();
        rangeValue.textContent = `$${value}`;
        
        // Calculate the position of the value indicator
        const percent = (this.value - this.min) / (this.max - this.min);
        const thumbWidth = 20;
        const rangeWidth = this.offsetWidth;
        const offset = percent * (rangeWidth - thumbWidth) + (thumbWidth / 2);
        
        rangeValue.style.left = `${offset}px`;
    });

    // Loan term buttons
    const termButtons = document.querySelectorAll('.term-btn');
    termButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            termButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        
        // Add loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;

        // Simulate form submission
        setTimeout(() => {
            showNotification('Application submitted successfully!', 'success');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            form.reset();
        }, 2000);
    });
    // Number input validation
    const validateNumberInputs = document.querySelectorAll('input[type="number"]');
    validateNumberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });

    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: white;
            border-radius: 6px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
            z-index: 1000;
        `;

        const icon = type === 'success' ? '✓' : '!';
        notification.innerHTML = `
            <span style="color: ${type === 'success' ? 'var(--success)' : 'var(--error)'}">
                ${icon}
            </span>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .animate-spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);

    const creditScoreInput = document.getElementById('creditScore');

    creditScoreInput.addEventListener('input', function() {
        let score = parseInt(this.value);
        
        // Validate input range
        if (score < 300) this.value = 300;
        if (score > 850) this.value = 850;
    });

    // Validate input on blur
    creditScoreInput.addEventListener('blur', function() {
        if (this.value === '' || parseInt(this.value) < 300) {
            this.value = 300;
        }
        if (parseInt(this.value) > 850) {
            this.value = 850;
        }
    });

    // Animate form groups on scroll
    const formGroups = document.querySelectorAll('.form-group');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'all 0.3s ease';
        group.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(group);
    });
    // Enhanced button interaction
    let submitBtn = document.querySelector('.btn-submit');
    submitBtn.addEventListener('click', function(e) {
        if(!this.classList.contains('loading')) {
            e.preventDefault();
            this.classList.add('loading');
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading-spin"></span>Processing...';
            
            // Simulate form submission
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = originalText;
                
                // Show success message with animation
                showNotification('Form submitted successfully!', 'success');
            }, 2000);
        }
    });

    // Enhanced input interaction
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.closest('.form-group').classList.remove('focused');
            }
        });
    });

    // Enhanced notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 1000;
        `;

        const icon = type === 'success' ? '✓' : '!';
        notification.innerHTML = `
            <span style="color: var(--${type});">${icon}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove notification
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
