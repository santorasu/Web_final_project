document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-btn");
    const shortDescription = document.getElementById("short-description");
    const fullDescription = document.getElementById("full-description");

    toggleBtn.addEventListener("click", function () {
        if (fullDescription.style.display === "none") {
            fullDescription.style.display = "block";
            shortDescription.style.display = "none";
            toggleBtn.textContent = "Show Less";
        } else {
            fullDescription.style.display = "none";
            shortDescription.style.display = "block";
            toggleBtn.textContent = "Show More";
        }
    });
});