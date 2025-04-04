document.addEventListener("DOMContentLoaded", function () {
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

function togglePassword() {
  var passwordField = document.getElementById("password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}

function validateSignupForm(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return false;
  }

  if (name.length < 2) {
    alert("Name must be at least 2 characters long");
    return false;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return false;
  }

  window.location.href = "../login-page/index.html?signup=success";
  return false;
}

window.onload = function () {
  getUsers();
};
//api call
function createUser() {
  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  axios
    .post("http://localhost:3000/api/LanguageLearner/users", {
      email,
      name,
      password,
    })
    .then((response) => {
      alert("User Created: " + JSON.stringify(response.data));
      window.location.href = "../login-page/index.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}
