document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".toggle-sidebar-btn");
    const body = document.body;

    toggleBtn.addEventListener("click", function () {
    body.classList.toggle("toggle-sidebar");
    });
});