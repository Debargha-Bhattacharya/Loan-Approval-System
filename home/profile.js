document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.getElementById("edit-profile");
    
    editButton.addEventListener("click", function() {
        let newName = prompt("Enter your new name:", document.getElementById("user-name").innerText);
        if (newName) {
            document.getElementById("user-name").innerText = newName;
        }
        
        let newEmail = prompt("Enter your new email:", document.getElementById("user-email").innerText);
        if (newEmail) {
            document.getElementById("user-email").innerText = newEmail;
        }
    });
});
