// Redirect to home page when close (X) icon is clicked
function goHome() {
    window.location.href = "index.html"; // Change this to your actual home page URL
}

// Call to action button interaction
document.querySelector(".cta-button").addEventListener("click", function () {
    alert("Thank you for joining E-LAP! Redirecting you to registration...");
    window.location.href = "register.html"; // Change this to the correct signup page
});
