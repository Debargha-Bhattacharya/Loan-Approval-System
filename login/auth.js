document.getElementById("authForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let customerId = document.getElementById("customerId").value.trim();

    if (!customerId) {
        alert("Please enter your Customer ID.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: customerId })
        });

        const data = await response.json();

        if (response) {
            window.location.href = "/login/reset.html"; // Redirect to Forgot Password page
        } else {
            alert(data.message || "Invalid Customer ID. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
    }
});
