document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Password strength meter
    const strengthMeter = document.querySelectorAll('.meter-section');
    const strengthText = document.querySelector('.strength-text');

    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updateStrengthMeter(strength);
    });

    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;

        return strength;
    }

    function updateStrengthMeter(strength) {
        const colors = ['#F44336', '#FF9800', '#FDD835', '#4CAF50'];
        const texts = ['Weak', 'Fair', 'Good', 'Strong'];

        strengthMeter.forEach((section, index) => {
            if (index < strength) {
                section.style.backgroundColor = colors[strength - 1];
            } else {
                section.style.backgroundColor = 'var(--light-gray)';
            }
        });

        strengthText.textContent = strength > 0 ? texts[strength - 1] : 'Password Strength';
        strengthText.style.color = strength > 0 ? colors[strength - 1] : 'var(--texts-light)';
    }

    // Form validation
    const registerForm = document.getElementById('registerForm');
    const phoneInput = document.getElementById('phone');
    const accountInput = document.getElementById('account');
    const ifscInput = document.getElementById('ifsc');
    const branchInput = document.getElementById('branch');

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate phone number
        if (!phoneInput.value.match(/^[0-9]{10}$/)) {
            showError(phoneInput, 'Please enter a valid 10-digit phone number');
            return;
        }

        // Validate account number
        if (!accountInput.value.match(/^[0-9]{10,16}$/)) {
            showError(accountInput, 'Please enter a valid account number');
            return;
        }

        // Validate IFSC code
        if (!ifscInput.value.match(/^[A-Z]{4}[0-9]{7}$/)) {
            showError(ifscInput, 'Please enter a valid IFSC code');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('.register-btn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showSuccess('Account created successfully!');
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            this.reset();
        }, 2000);
    });

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const helper = formGroup.querySelector('.helper-text');
        helper.textContent = message;
        helper.style.color = 'var(--error-red)';
        input.style.borderColor = 'var(--error-red)';

        setTimeout(() => {
            helper.textContent = helper.dataset.original || '';
            helper.style.color = 'var(--text-light)';
            input.style.borderColor = 'var(--light-gray)';
        }, 3000);
    }

    function showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

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

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .success-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: var(--white);
            border-left: 4px solid var(--success-green);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(120%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .success-notification.show {
            transform: translateX(0);
            opacity: 1;
        }

        .success-notification i {
            color: var(--success-green);
        }
    `;

    document.head.appendChild(style);
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Email and Password are required');
        return;
    }

    const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        window.location.href = '#';
    }
});
