document.addEventListener('DOMContentLoaded', function() {
    const otpForm = document.getElementById('otpForm');
    const otpInputs = document.querySelectorAll('.otp-input');
    const timerDisplay = document.getElementById('timer');
    const resendButton = document.getElementById('resendOtp');
    const errorMessage = document.getElementById('otpError');
    const submitButton = document.querySelector('.login-btn');
    
    // Add animation to OTP inputs when page loads
    otpInputs.forEach((input, idx) => {
        setTimeout(() => {
            input.style.opacity = "1";
            input.style.transform = "translateY(0)";
        }, 100 * idx);
    });
    
    // Add click event listener to submit button
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if any input is empty first
        const emptyInputs = Array.from(otpInputs).some(input => !input.value.trim());
        
        if (emptyInputs) {
            showError('Please enter the complete OTP');
            otpInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                }
            });
            return;
        }

        validateAndSubmit();
    });

    // Prevent form submission on Enter key
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitButton.click();
    });

    function validateAndSubmit() {
        // Get all OTP digits
        const otpValues = Array.from(otpInputs).map(input => input.value.trim());
        
        // Check if any input is empty
        if (otpValues.some(value => value === '')) {
            showError('Please enter the complete OTP');
            return;
        }

        // Check if all inputs are numbers
        if (otpValues.some(value => !/^\d+$/.test(value))) {
            showError('OTP must contain only numbers');
            return;
        }

        // Combine OTP digits
        const otp = otpValues.join('');

        // Verify OTP (assuming '123456' is the correct OTP)
        if (otp === '123456') {
            showSuccess();
            // Updated redirect path
            setTimeout(() => {
                window.location.href = '/home/home-main.html';
            }, 1500);
        } else {
            showError('Invalid OTP. Please try again.');
            clearInputs();
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#dc3545';
        otpInputs.forEach(input => input.classList.add('error'));
    }

    function showSuccess() {
        errorMessage.textContent = 'OTP verified successfully! Redirecting...';
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#28a745';
        otpInputs.forEach(input => input.classList.remove('error'));
    }

    function clearInputs() {
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.add('error');
        });
        otpInputs[0].focus();
    }

    // Handle input in OTP fields
    otpInputs.forEach((input, index) => {
        // Add initial styling for animation
        input.style.opacity = "0";
        input.style.transform = "translateY(10px)";
        input.style.transition = "all 0.3s ease";
        
        input.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^\d]/g, '');

            // Clear error styling
            this.classList.remove('error');
            errorMessage.style.display = 'none';

            // Visual feedback on input
            if (this.value.length === 1) {
                this.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                this.style.borderColor = "var(--accent-blue)";
                
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                } else {
                    // If it's the last input and all fields are filled, validate automatically
                    const allFilled = Array.from(otpInputs).every(input => input.value.trim() !== '');
                    if (allFilled) {
                        validateAndSubmit();
                    }
                }
            }
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace') {
                if (!this.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
                this.classList.remove('error');
                this.style.backgroundColor = "transparent";
                this.style.borderColor = "rgba(30, 58, 138, 0.2)";
                errorMessage.style.display = 'none';
            }
        });
        
        // Handle focus events for visual feedback
        input.addEventListener('focus', function() {
            this.style.boxShadow = "0 0 0 2px rgba(30, 58, 138, 0.15)";
        });
        
        input.addEventListener('blur', function() {
            this.style.boxShadow = "none";
        });
    });

    // Handle paste event
    otpForm.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 6);
        
        pastedData.split('').forEach((digit, index) => {
            if (index < otpInputs.length) {
                otpInputs[index].value = digit;
                if (digit) {
                    otpInputs[index].style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                    otpInputs[index].style.borderColor = "var(--accent-blue)";
                }
            }
        });

        // If all fields are filled after paste, validate automatically
        if (pastedData.length === 6) {
            validateAndSubmit();
        }
    });

    // Timer functionality
    let timeLeft = 59; // 59 in seconds
    
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeLeft === 0) {
            resendButton.disabled = false;
            clearInterval(timerInterval);
        } else {
            timeLeft--;
        }
    }
    
    let timerInterval = setInterval(updateTimer, 1000);
    
    // Resend OTP functionality
    resendButton.addEventListener('click', function() {
        if (!this.disabled) {
            timeLeft = 59;
            timerInterval = setInterval(updateTimer, 1000);
            this.disabled = true;
            
            clearInputs();
            
            errorMessage.textContent = 'New OTP has been sent';
            errorMessage.style.display = 'block';
            errorMessage.style.color = '#28a745';
            
            // Reset and animate the OTP inputs again
            otpInputs.forEach((input, idx) => {
                input.style.opacity = "0";
                input.style.transform = "translateY(10px)";
                input.style.backgroundColor = "transparent";
                input.style.borderColor = "rgba(30, 58, 138, 0.2)";
                
                setTimeout(() => {
                    input.style.opacity = "1";
                    input.style.transform = "translateY(0)";
                }, 100 * idx);
            });
            
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    });
});