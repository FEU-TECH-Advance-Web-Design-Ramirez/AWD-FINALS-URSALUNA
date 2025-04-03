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

function togglePassword() {
  var passwordField = document.getElementById("password");
  passwordField.type = passwordField.type === "password" ? "text" : "password";
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3000/api/LanguageLearner/users/login', {
            email: email,
            password: password
        });

        // Store user data
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', response.data.role);

        // Redirect based on role
        if (response.data.role === 'admin') {
            window.location.href = '../admin-home-page/index.html';
        } else {
            window.location.href = '../home-page/index.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
    }
});
