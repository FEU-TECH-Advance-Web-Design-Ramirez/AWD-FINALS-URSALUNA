let users = [];

window.onload = function () {
  getUsers();
};

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
