let users = [];

window.onload = function () {
  getPlatforms();
  getReviews();
};

function getPlatforms() {
  console.log('Fetching platforms for validation...');
  axios
    .get("http://localhost:3000/api/LanguageLearner/platforms")
    .then((response) => {
      console.log('All platforms:', response.data);
      // Only show platforms that haven't been validated
      const unvalidatedPlatforms = response.data.filter(platform => !platform.validated);
      console.log('Unvalidated platforms:', unvalidatedPlatforms);

      const platformSelect = document.getElementById("platformId");
      
      if (unvalidatedPlatforms.length === 0) {
        platformSelect.innerHTML = '<option value="" class="text-gray-500">No platforms pending validation</option>';
        platformSelect.disabled = true;
        return;
      }

      platformSelect.disabled = false;
      platformSelect.innerHTML = '<option value="">Select Platform</option>';
      unvalidatedPlatforms.forEach((platform) => {
        const option = document.createElement("option");
        option.value = platform.id;
        option.textContent = `Platform ID: ${platform.id} - ${platform.name}`;
        platformSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching platforms:", error);
      showMessage("platformMessage", "Error fetching platforms: " + error.message, false);
    });
}

function getReviews() {
  axios
    .get("http://localhost:3000/api/LanguageLearner/reviews")
    .then((response) => {
      const reviews = response.data;
      populateReviewSelect(reviews);
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
    });
}

function populateReviewSelect(reviews) {
  const reviewSelect = document.getElementById("reviewId");
  reviewSelect.innerHTML = '<option value="">No reviews pending validation</option>';
  
  // Filter for unvalidated reviews only
  const unvalidatedReviews = reviews.filter(review => !review.validated);
  
  if (unvalidatedReviews.length === 0) {
    reviewSelect.innerHTML = '<option value="" class="text-gray-500">No reviews pending validation</option>';
    reviewSelect.disabled = true;
    return;
  }

  reviewSelect.disabled = false;
  reviewSelect.innerHTML = '<option value="">Select Review ID</option>';
  unvalidatedReviews.forEach((review) => {
    const option = document.createElement("option");
    option.value = review.id;
    option.textContent = `Review ID: ${review.id} - Rating: ${review.rating}`;
    reviewSelect.appendChild(option);
  });
}

function showMessage(elementId, message, isSuccess = true) {
  const messageElement = document.getElementById(elementId);
  messageElement.classList.remove("text-red-600", "text-green-600");
  messageElement.classList.add(
    isSuccess ? "text-green-600" : "text-red-600"
  );
  messageElement.textContent = message;
}

function validatePlatform(event) {
  event.preventDefault();
  const platformId = document.getElementById("platformId").value;
  
  if (!platformId) {
    showMessage("platformMessage", "Please select a platform to validate.", false);
    return;
  }

  console.log('Validating platform:', platformId);

  // Use the admin validation endpoint
  axios
    .post(`http://localhost:3000/api/LanguageLearner/admin/platforms/${platformId}/validate`)
    .then((response) => {
      console.log('Platform validated:', response.data);
      showMessage(
        "platformMessage",
        "Platform validated successfully! It will now appear in the platform list and feedback page.",
        true
      );
      // Refresh the platform list to remove the validated platform
      getPlatforms();
    })
    .catch((error) => {
      console.error('Validation error:', error);
      console.error('Error response:', error.response);
      showMessage(
        "platformMessage",
        `Error validating platform: ${error.response ? error.response.data : error.message}`,
        false
      );
    });
}

function validateReview(event) {
  event.preventDefault();
  const reviewId = document.getElementById("reviewId").value;
  
  if (!reviewId) {
    showMessage("reviewMessage", "Please select a review to validate.", false);
    return;
  }

  axios
    .post(
      `http://localhost:3000/api/LanguageLearner/admin/reviews/${reviewId}/validate`
    )
    .then((response) => {
      showMessage(
        "reviewMessage",
        "Review validated successfully! It will now be counted in the rankings.",
        true
      );
      // Refresh the reviews list to remove the validated review
      getReviews();
    })
    .catch((error) => {
      showMessage(
        "reviewMessage",
        "Error validating review: " + error.message,
        false
      );
    });
}

function getUsers() {
  axios
    .get("http://localhost:3000/api/LanguageLearner/users")
    .then((response) => {
      users = response.data;
      displayUsers(users);
    })
    .catch((error) => {
      alert("Error fetching users: " + error.message);
    });
}

function displayUsers(usersList) {
  const userTable = document.getElementById("userTable");
  userTable.innerHTML = "";

  usersList.forEach((user) => {
    userTable.innerHTML += `
            <tr class="border-b">
              <td class="p-4">${user.id}</td>
              <td class="p-4">${user.email}</td>
              <td class="p-4">${user.name}</td>
              <td class="p-4">
                <button onclick="openUpdateModal(${user.id})" class="text-blue-500 hover:text-blue-700">Update</button>
                <button onclick="deleteUser(${user.id})" class="text-red-500 hover:text-red-700 ml-4">Delete</button>
              </td>
            </tr>
          `;
  });
}

function searchUserByEmail() {
  const searchQuery = document
    .getElementById("searchEmail")
    .value.toLowerCase();
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery)
  );
  displayUsers(filteredUsers);
}

function openAddUserModal() {
  document.getElementById("addUserModal").classList.remove("hidden");
}

function closeAddUserModal() {
  document.getElementById("addUserModal").classList.add("hidden");
}

function addUser(event) {
  event.preventDefault();

  const email = document.getElementById("addEmail").value;
  const name = document.getElementById("addName").value;

  axios
    .post("http://localhost:3000/api/LanguageLearner/users", {
      email: email,
      name: name,
    })
    .then((response) => {
      alert("User Added: " + JSON.stringify(response.data));
      closeAddUserModal();
      getUsers();
    })
    .catch((error) => {
      alert("Error adding user: " + error.message);
    });
}

function openUpdateModal(userId) {
  const user = users.find((u) => u.id === userId);
  document.getElementById("updateUserId").value = user.id;
  document.getElementById("updateEmail").value = user.email;
  document.getElementById("updateName").value = user.name;
  document.getElementById("updateModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("updateModal").classList.add("hidden");
}

function updateUser(event) {
  event.preventDefault();

  const userId = document.getElementById("updateUserId").value;
  const updatedEmail = document.getElementById("updateEmail").value;
  const updatedName = document.getElementById("updateName").value;

  axios
    .put(`http://localhost:3000/api/LanguageLearner/users/${userId}`, {
      email: updatedEmail,
      name: updatedName,
    })
    .then((response) => {
      alert("User Updated: " + JSON.stringify(response.data));
      closeModal();
      getUsers();
    })
    .catch((error) => {
      alert("Error updating user: " + error.message);
    });
}

function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    axios
      .delete(`http://localhost:3000/api/LanguageLearner/users/${userId}`)
      .then((response) => {
        alert("User Deleted: " + response.data.message);
        getUsers();
      })
      .catch((error) => {
        alert("Error deleting user: " + error.message);
      });
  }
}
