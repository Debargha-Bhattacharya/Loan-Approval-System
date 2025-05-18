document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const resultContainer = document.getElementById('resultContainer');
    
    // Format currency inputs
    const currencyInputs = ['Annual_Income', 'Loan_Amount', 'Assets'];
    currencyInputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/,/g, '');
            if (value) {
                value = parseFloat(value).toLocaleString('en-IN');
            }
            e.target.value = value;
        });
    });

    // Handle dual inputs (range + number)
    const dualInputs = [
        { slider: 'Loan_Dur_slider', number: 'Loan_Dur', min: 1, max: 20 },
        { slider: 'Cibil_slider', number: 'Cibil', min: 300, max: 900 }
    ];

    dualInputs.forEach(({ slider, number, min, max }) => {
        const sliderInput = document.getElementById(slider);
        const numberInput = document.getElementById(number);

        // Update number input when slider moves
        sliderInput.addEventListener('input', function() {
            numberInput.value = this.value;
        });

        // Update slider when number input changes
        numberInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (value < min) value = min;
            if (value > max) value = max;
            this.value = value;
            sliderInput.value = value;
        });

        // Validate on blur
        numberInput.addEventListener('blur', function() {
            if (!this.value) {
                this.value = '';
                sliderInput.value = min;
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const predictBtn = form.querySelector('button[type="submit"]');
        predictBtn.disabled = true;
        predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
        
        try {
            // Get form data and convert to object
            const formData = new FormData(form);
            const data = {};
            
            // Convert form data to object and handle numeric values
            formData.forEach((value, key) => {
                // Remove commas from numeric values
                if (key === 'Annual_Income' || key === 'Loan_Amount' || key === 'Assets') {
                    data[key] = parseFloat(value.replace(/,/g, ''));
                } else if (key === 'Loan_Dur' || key === 'Cibil') {
                    data[key] = parseInt(value);
                } else if (key === 'no_of_dep') {
                    // Handle the number of dependents dropdown
                    data[key] = parseInt(value.split(' ')[0]);
                } else {
                    data[key] = value;
                }
            });

            console.log('Sending data:', data); // Debug log

            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }
            
            const result = await response.json();
            console.log('Received result:', result); // Debug log
            
            // Show result
            resultContainer.style.display = 'block';
            
            if (result.prediction === true) {
                resultContainer.className = 'result-container approved';
                resultContainer.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Congratulations! Your loan application has been approved.</p>
                    <button onclick="window.location.href='http://127.0.0.1:5502/kyc/kyc.html'" class="doc-verify-btn">
                        <i class="fas fa-file-alt"></i> Proceed to Document Verification
                    </button>
                `;
            } else {
                resultContainer.className = 'result-container rejected';
                resultContainer.innerHTML = `
                    <i class="fas fa-times-circle"></i>
                    <p>We regret to inform you that your loan application has been rejected.</p>
                    <div class="tips-container">
                        <h3>Tips to improve your application:</h3>
                        <ul>
                            <li>Improve your CIBIL score</li>
                            <li>Increase your annual income</li>
                            <li>Reduce your existing loan burden</li>
                            <li>Maintain a stable employment history</li>
                        </ul>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        } finally {
            predictBtn.disabled = false;
            predictBtn.innerHTML = '<i class="fas fa-calculator"></i> Predict Loan Approval';
        }
    });
}); 