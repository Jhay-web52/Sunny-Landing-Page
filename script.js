function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
}

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
  const mobileMenu = document.getElementById("mobileMenu");
  const toggle = document.querySelector(".mobile-menu-toggle");

  if (!toggle.contains(event.target) && !mobileMenu.contains(event.target)) {
    mobileMenu.classList.remove("active");
  }
});

// Close mobile menu when resizing to desktop
window.addEventListener("resize", function () {
  const mobileMenu = document.getElementById("mobileMenu");
  if (window.innerWidth > 768) {
    mobileMenu.classList.remove("active");
  }
});
