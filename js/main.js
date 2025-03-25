document.addEventListener("DOMContentLoaded", function() {
    // Charger les composants réutilisables
    /*loadComponent("header", "../components/header.html");
    loadComponent("footer", "../components/footer.html");*/
});


document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector("nav");

    toggleButton.addEventListener("click", function () {
        nav.classList.toggle("active");
    });
});

/*function loadComponent(id, url) {
    fetch(url)
        .then(response => response.text())
        .then(html => document.getElementById(id).innerHTML = html);
}*/
