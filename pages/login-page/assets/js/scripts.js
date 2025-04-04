document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("signup") === "success") {
    alert("Sign up successful! Please login with your credentials.");
  }

  const languageButtons = document.querySelectorAll(".language-toggle");

  languageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const dropdownMenu = this.nextElementSibling;
      if (dropdownMenu) {
        dropdownMenu.classList.toggle("hidden");
      }
    });
  });

  document.addEventListener("click", function (event) {
    languageButtons.forEach((button) => {
      const dropdownMenu = button.nextElementSibling;
      if (
        dropdownMenu &&
        !button.contains(event.target) &&
        !dropdownMenu.contains(event.target)
      ) {
        dropdownMenu.classList.add("hidden");
      }
    });
  });
});
