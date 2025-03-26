// ✅ main.js corrigé : uniquement pour la navigation mobile

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector("nav");

    if (toggleButton && nav) {
        toggleButton.addEventListener("click", function () {
            nav.classList.toggle("active");
        });
    }
});