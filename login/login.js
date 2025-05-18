document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    const emailInput = document.querySelector('#email');
    const loginForm = document.getElementById('loginForm');

    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Add real-time validation
    function validateInput(inputField) {
        if (inputField.value.trim() === "") {
            inputField.classList.add('error');
        } else {
            inputField.classList.remove('error');
        }
    }

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateInput(emailInput);
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validateInput(passwordInput);
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get and validate input values
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const remember = document.getElementById('remember')?.checked;

            // Check if fields are empty
            if (email === "") {
                showNotification('Customer ID is required.', 'error');
                emailInput.classList.add('error');
                return;
            } else {
                emailInput.classList.remove('error');
            }

            if (password === "") {
                showNotification('Password is required.', 'error');
                passwordInput.classList.add('error');
                return;
            } else {
                passwordInput.classList.remove('error');
            }

            // Add loading state to button
            const loginBtn = this.querySelector('.login-btn');
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            loginBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                console.log('Login attempt:', { email, password, remember });

                // Reset button state
                loginBtn.innerHTML = 'Login';
                loginBtn.disabled = false;

                // Show success message
                showNotification('Login successful!', 'success');

                // Redirect to OTP page
                window.location.href = 'otp.html';
            }, 2000);
        });
    }

    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
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
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Email and Password are required');
        return;
    }

    const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    alert(data.message);

    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/home/home-main.html'; // Redirect after login
    }

    if(!response.ok) {
        alert("Please Register First!");
    }
});
