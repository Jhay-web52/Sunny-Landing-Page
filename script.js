// Mobile Menu Toggle
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

// Close mobile menu when clicking a link
document.querySelectorAll(".mobile-menu .nav-a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});
