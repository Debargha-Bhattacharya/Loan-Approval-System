document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('kycForm');
    
    // Initialize file upload handlers
    initializeFileUploads();
    
    // Country data with codes and names
    const countries = [
        { code: 'AF', name: 'Afghanistan', phoneCode: '+93' },
        { code: 'AL', name: 'Albania', phoneCode: '+355' },
        { code: 'DZ', name: 'Algeria', phoneCode: '+213' },
        { code: 'AD', name: 'Andorra', phoneCode: '+376' },
        { code: 'AO', name: 'Angola', phoneCode: '+244' },
        { code: 'AR', name: 'Argentina', phoneCode: '+54' },
        { code: 'AM', name: 'Armenia', phoneCode: '+374' },
        { code: 'AU', name: 'Australia', phoneCode: '+61' },
        { code: 'AT', name: 'Austria', phoneCode: '+43' },
        { code: 'AZ', name: 'Azerbaijan', phoneCode: '+994' },
        { code: 'BH', name: 'Bahrain', phoneCode: '+973' },
        { code: 'BD', name: 'Bangladesh', phoneCode: '+880' },
        { code: 'BY', name: 'Belarus', phoneCode: '+375' },
        { code: 'BE', name: 'Belgium', phoneCode: '+32' },
        { code: 'BR', name: 'Brazil', phoneCode: '+55' },
        { code: 'CA', name: 'Canada', phoneCode: '+1' },
        { code: 'CN', name: 'China', phoneCode: '+86' },
        { code: 'DE', name: 'Germany', phoneCode: '+49' },
        { code: 'IN', name: 'India', phoneCode: '+91' },
        { code: 'JP', name: 'Japan', phoneCode: '+81' },
        { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
        { code: 'US', name: 'United States', phoneCode: '+1' }
        // Add more countries as needed
    ];

    // Populate country selectors
    const nationalitySelect = document.getElementById('nationality');
    const countrySelect = document.getElementById('country');
    const phoneCodeSelect = document.getElementById('phoneCode');

    // Sort countries by name
    countries.sort((a, b) => a.name.localeCompare(b.name));

    // Populate nationality and country dropdowns
    countries.forEach(country => {
        const nationalityOption = new Option(country.name, country.code);
        const countryOption = new Option(country.name, country.code);
        nationalitySelect.add(nationalityOption);
        countrySelect.add(countryOption.cloneNode(true));
    });

    // Populate phone code dropdown
    const uniquePhoneCodes = [...new Set(countries.map(country => country.phoneCode))];
    uniquePhoneCodes.sort();
    uniquePhoneCodes.forEach(code => {
        const countryNames = countries
            .filter(country => country.phoneCode === code)
            .map(country => country.name)
            .join('/');
        const displayText = code.substring(1) + ' (' + countryNames + ')'; // Remove the + and format
        const option = new Option(displayText, code);
        phoneCodeSelect.add(option);
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        // Remove any non-digit characters except for + sign
        let value = this.value.replace(/[^\d+]/g, '');
        // Format the number (basic formatting, you might want to adjust this)
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        this.value = value;
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if(validateForm()) {
            showSuccessMessage();
        }
    });

    const nextButton = document.querySelector('.next-btn');
    
    nextButton.addEventListener('click', function() {
        // Get all required inputs from the personal section
        const fullName = document.querySelector('[placeholder="Enter your full name"]').value;
        const dob = document.querySelector('[type="date"]').value;
        const nationality = document.querySelector('[id="nationality"]').value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const email = document.querySelector('[type="email"]').value;
        const phone = document.querySelector('[placeholder*="phone"]').value;

        // Check if all fields are filled
        if (fullName && dob && nationality && gender && email && phone) {
            // Hide personal section
            document.querySelector('#personal').style.display = 'none';
            
            // Show address section
            document.querySelector('#address').style.display = 'block';
            
            // Update progress bar
            document.querySelector('.progress-bar [data-step="personal"]').classList.remove('active');
            document.querySelector('.progress-bar [data-step="address"]').classList.add('active');
        } else {
            alert('Please fill in all required fields');
        }
    });
});

function initializeFileUploads() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        const input = area.querySelector('input[type="file"]');
        const button = area.querySelector('.upload-btn');
        const fileInfo = area.parentElement.querySelector('.file-info');
        
        button.addEventListener('click', () => input.click());
        
        input.addEventListener('change', function() {
            if(this.files && this.files[0]) {
                const file = this.files[0];
                fileInfo.innerHTML = `
                    <div class="file-details">
                        <i class="fas fa-file-alt"></i>
                        <span>${file.name}</span>
                        <button type="button" class="remove-file" onclick="removeFile(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                area.style.borderColor = '#10b981';
            }
        });
    });
}

function removeFile(button) {
    const fileInfo = button.closest('.file-info');
    const uploadArea = fileInfo.previousElementSibling;
    const input = uploadArea.querySelector('input[type="file"]');
    
    input.value = '';
    fileInfo.innerHTML = '';
    uploadArea.style.borderColor = '';
}

function nextSection(sectionId) {
    const currentSection = document.querySelector('.form-section.active');
    if(validateSection(currentSection)) {
        currentSection.classList.remove('active');
        document.getElementById(sectionId).classList.add('active');
        updateProgress(sectionId);
        window.scrollTo(0, 0);
    }
}

function previousSection(sectionId) {
    document.querySelector('.form-section.active').classList.remove('active');
    document.getElementById(sectionId).classList.add('active');
    updateProgress(sectionId);
    window.scrollTo(0, 0);
}

function updateProgress(sectionId) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => step.classList.remove('active'));
    
    switch(sectionId) {
        case 'personal':
            steps[0].classList.add('active');
            break;
        case 'address':
            steps[0].classList.add('active');
            steps[1].classList.add('active');
            break;
        case 'documents':
            steps.forEach(step => step.classList.add('active'));
            break;
    }
}

function validateSection(section) {
    let isValid = true;
    const inputs = section.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        if(!input.value) {
            isValid = false;
            showError(input);
        } else {
            removeError(input);
        }
    });
    
    return isValid;
}

function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        if(!field.value) {
            isValid = false;
            showError(field);
        } else {
            removeError(field);
        }
    });
    
    return isValid;
}

function showError(input) {
    const formGroup = input.closest('.form-group');
    if(!formGroup.querySelector('.error-message')) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.innerHTML = 'This field is required';
        formGroup.appendChild(error);
        input.style.borderColor = 'var(--error-color)';
    }
}

function removeError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if(error) {
        error.remove();
        input.style.borderColor = '';
    }
}

function showSuccessMessage() {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h2>Verification Submitted!</h2>
            <p>Your KYC verification request has been submitted successfully. We'll review your information and get back to you soon.</p>
            <button onclick="this.closest('.success-modal').remove()">Close</button>
        </div>
    `;
    document.body.appendChild(successModal);
}
