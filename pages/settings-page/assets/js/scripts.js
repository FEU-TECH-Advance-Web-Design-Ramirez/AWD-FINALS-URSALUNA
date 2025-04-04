const menuIcon = document.getElementById("menu-icon");
const menuItems = document.getElementById("menu-items");

menuIcon.addEventListener("click", () => {
    menuItems.classList.toggle("hidden");
});


