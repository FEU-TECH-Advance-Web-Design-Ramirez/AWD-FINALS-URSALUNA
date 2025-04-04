let reviews = [];
let platforms = [];
let users = [];

// Fetch reviews, platforms, and users when the page loads
window.onload = function () {
  getReviews();
  getPlatforms();
  getUsers();
};

function getReviews() {
  axios
    .get("http://localhost:3000/api/LanguageLearner/reviews")
    .then((response) => {
      reviews = response.data;
      displayReviews(reviews);
    })
    .catch((error) => {
      alert("Error fetching reviews: " + error.message);
    });
}

function getPlatforms() {
  axios
    .get("http://localhost:3000/api/LanguageLearner/platforms")
    .then((response) => {
      platforms = response.data;
      populatePlatformSelect(platforms);
    })
    .catch((error) => {
      alert("Error fetching platforms: " + error.message);
    });
}

function getUsers() {
  axios
    .get("http://localhost:3000/api/LanguageLearner/users")
    .then((response) => {
      users = response.data;
      populateUserSelect(users);
    })
    .catch((error) => {
      alert("Error fetching users: " + error.message);
    });
}

function populatePlatformSelect(platforms) {
  const platformSelect = document.getElementById("platformId");
  platforms.forEach((platform) => {
    const option = document.createElement("option");
    option.value = platform.id;
    option.textContent = platform.name;
    platformSelect.appendChild(option);
  });
}

function populateUserSelect(users) {
  const userSelect = document.getElementById("userId");
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    userSelect.appendChild(option);
  });
}

function displayReviews(reviewsList) {
  const reviewTable = document.getElementById("reviewTable");
  reviewTable.innerHTML = "";

  reviewsList.forEach((review) => {
    // Find platform name by ID
    const platform = platforms.find((p) => p.id === review.platformId);
    const platformName = platform ? platform.name : "Unknown Platform";

    reviewTable.innerHTML += `
            <tr class="border-b">
              <td class="p-4">${review.id}</td>
              <td class="p-4">${review.platformId}</td>
              <td class="p-4">${review.userId}</td>
              <td class="p-4">${review.rating}</td>
              <td class="p-4">${review.comment}</td>
              <td class="p-4">
                <button onclick="openEditReviewModal(${review.id})" class="text-blue-500 hover:text-blue-700">Edit</button>
                <button onclick="deleteReview(${review.id})" class="text-red-500 hover:text-red-700 ml-4">Delete</button>
              </td>
            </tr>
          `;
  });
}

function openAddReviewModal() {
  document.getElementById("addReviewModal").classList.remove("hidden");
}

function closeAddReviewModal() {
  document.getElementById("addReviewModal").classList.add("hidden");
}

function addReview(event) {
  event.preventDefault();

  const platformId = document.getElementById("platformId").value;
  const userId = document.getElementById("userId").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  axios
    .post("http://localhost:3000/api/LanguageLearner/reviews", {
      platformId,
      userId,
      rating,
      comment,
    })
    .then((response) => {
      alert("Review Added: " + JSON.stringify(response.data));
      closeAddReviewModal();
      getReviews();
    })
    .catch((error) => {
      alert("Error adding review: " + error.message);
    });
}

function openEditReviewModal(reviewId) {
  const review = reviews.find((r) => r.id === reviewId);
  document.getElementById("editReviewId").value = review.id;
  document.getElementById("editRating").value = review.rating;
  document.getElementById("editComment").value = review.comment;
  document.getElementById("editReviewModal").classList.remove("hidden");
}

function closeEditReviewModal() {
  document.getElementById("editReviewModal").classList.add("hidden");
}

function updateReview(event) {
  event.preventDefault();

  const reviewId = document.getElementById("editReviewId").value;
  const updatedRating = document.getElementById("editRating").value;
  const updatedComment = document.getElementById("editComment").value;

  axios
    .put(`http://localhost:3000/api/LanguageLearner/reviews/${reviewId}`, {
      rating: updatedRating,
      comment: updatedComment,
    })
    .then((response) => {
      alert("Review Updated: " + JSON.stringify(response.data));
      closeEditReviewModal();
      getReviews();
    })
    .catch((error) => {
      alert("Error updating review: " + error.message);
    });
}

function deleteReview(reviewId) {
  if (confirm("Are you sure you want to delete this review?")) {
    axios
      .delete(`http://localhost:3000/api/LanguageLearner/reviews/${reviewId}`)
      .then((response) => {
        alert("Review Deleted: " + response.data.message);
        getReviews();
      })
      .catch((error) => {
        alert("Error deleting review: " + error.message);
      });
  }
}
