document.addEventListener('DOMContentLoaded', function() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    // Password requirements check
    const requirements = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    };

    // Toggle password visibility
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // Check password requirements as user types
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        
        for (const [requirement, regex] of Object.entries(requirements)) {
            const element = document.getElementById(requirement);
            if (regex.test(password)) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        }
    });

    // Form submission
    resetPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validate all requirements are met
        const allRequirementsMet = Object.entries(requirements)
            .every(([_, regex]) => regex.test(newPassword));

        if (!allRequirementsMet) {
            alert('Please ensure all password requirements are met.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Add your password reset confirmation logic here
        // This could include:
        // 1. Sending the new password to your backend
        // 2. Handling the response
        // 3. Redirecting to login page on success

        alert('Password has been successfully reset. Please login with your new password.');
        window.location.href = 'login.html';
    });
});