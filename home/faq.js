document.addEventListener("DOMContentLoaded", function () {
    const faqItems = document.querySelectorAll(".faq-question");

    faqItems.forEach(item => {
        item.addEventListener("click", function () {
            this.classList.toggle("active");
            const answer = this.nextElementSibling;
            if (answer.style.display === "block") {
                answer.style.display = "none";
            } else {
                answer.style.display = "block";
            }
        });
    });

    // Search Functionality
    const searchInput = document.getElementById("searchFaq");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchTerm = searchInput.value.toLowerCase();
            document.querySelectorAll(".faq-item").forEach(item => {
                const question = item.querySelector(".faq-question").textContent.toLowerCase();
                if (question.includes(searchTerm)) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});
