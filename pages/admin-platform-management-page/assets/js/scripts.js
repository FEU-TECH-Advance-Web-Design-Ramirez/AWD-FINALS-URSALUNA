let platforms = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Platform management page loaded');
  getPlatforms();
});

async function getPlatforms() {
  try {
    const response = await axios.get('http://localhost:3000/api/LanguageLearner/platforms');
    console.log('All platforms:', response.data);
    // Store all platforms in the global array
    platforms = response.data;
    // Only show validated platforms
    const validatedPlatforms = platforms.filter(platform => platform.validated === true);
    console.log('Validated platforms:', validatedPlatforms);
    displayPlatforms(validatedPlatforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    alert('Error fetching platforms: ' + error.message);
  }
}

function displayPlatforms(platformsList) {
  const platformTable = document.getElementById('platformTable');
  platformTable.innerHTML = '';

  if (platformsList.length === 0) {
    platformTable.innerHTML = '<tr><td colspan="5" class="p-4 text-center">No validated platforms available</td></tr>';
    return;
  }

  platformsList.forEach(platform => {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50 transition-colors duration-200';
    row.innerHTML = `
      <td class="p-4">${platform.id}</td>
      <td class="p-4">${platform.name}</td>
      <td class="p-4"><a href="${platform.website}" target="_blank" class="text-blue-600 hover:text-blue-800">${platform.website}</a></td>
      <td class="p-4">${platform.languagesOffered || platform.languages}</td>
      <td class="p-4 space-x-4">
        <button onclick="openViewPlatformModal(${platform.id})" class="text-blue-600 hover:text-blue-800 font-medium">View</button>
        <button onclick="openEditPlatformModal(${platform.id})" class="text-blue-600 hover:text-blue-800 font-medium">Update</button>
        <button onclick="deletePlatform(${platform.id})" class="text-red-600 hover:text-red-800 font-medium">Delete</button>
      </td>
    `;
    platformTable.appendChild(row);
  });
}

function openAddPlatformModal() {
  document.getElementById("addPlatformModal").classList.remove("hidden");
}

function closeAddPlatformModal() {
  document.getElementById("addPlatformModal").classList.add("hidden");
  document.getElementById("addPlatformForm").reset();
}

function addPlatform(event) {
  event.preventDefault();

  const name = document.getElementById("platformName").value;
  const website = document.getElementById("platformWebsite").value;
  const languages = document.getElementById("platformLanguages").value;
  const description = document.getElementById("platformDescription").value;

  axios.post("http://localhost:3000/api/LanguageLearner/platforms", {
    name,
    website,
    languagesOffered: languages,
    description,
    submittedBy: "admin",
    validated: true // Since this is added by admin
  })
  .then((response) => {
    alert("Platform added successfully!");
    closeAddPlatformModal();
    getPlatforms();
  })
  .catch((error) => {
    alert("Error adding platform: " + error.message);
  });
}

function openViewPlatformModal(platformId) {
  const platform = platforms.find(p => p.id === platformId);
  if (!platform) {
    alert('Platform not found');
    return;
  }

  const platformDetails = document.getElementById("platformDetails");
  platformDetails.innerHTML = `
    <div class="space-y-4">
      <p><strong class="font-semibold">Name:</strong> ${platform.name}</p>
      <p><strong class="font-semibold">Website:</strong> <a href="${platform.website}" target="_blank" class="text-blue-600 hover:text-blue-800">${platform.website}</a></p>
      <p><strong class="font-semibold">Languages Offered:</strong> ${platform.languagesOffered || platform.languages}</p>
      <p><strong class="font-semibold">Description:</strong> ${platform.description}</p>
    </div>
  `;

  document.getElementById("viewPlatformModal").classList.remove("hidden");
}

function closeViewPlatformModal() {
  document.getElementById("viewPlatformModal").classList.add("hidden");
}

function openEditPlatformModal(platformId) {
  const platform = platforms.find(p => p.id === platformId);
  if (!platform) {
    alert('Platform not found');
    return;
  }

  document.getElementById("editPlatformId").value = platform.id;
  document.getElementById("editPlatformName").value = platform.name;
  document.getElementById("editPlatformWebsite").value = platform.website;
  document.getElementById("editPlatformLanguages").value = platform.languagesOffered || platform.languages;
  document.getElementById("editPlatformDescription").value = platform.description;
  
  document.getElementById("editPlatformModal").classList.remove("hidden");
}

function closeEditPlatformModal() {
  document.getElementById("editPlatformModal").classList.add("hidden");
  document.getElementById("editPlatformForm").reset();
}

function updatePlatform(event) {
  event.preventDefault();

  const platformId = document.getElementById("editPlatformId").value;
  const updatedName = document.getElementById("editPlatformName").value;
  const updatedWebsite = document.getElementById("editPlatformWebsite").value;
  const updatedLanguages = document.getElementById("editPlatformLanguages").value;
  const updatedDescription = document.getElementById("editPlatformDescription").value;

  axios.put(`http://localhost:3000/api/LanguageLearner/admin/platforms/${platformId}`, {
    name: updatedName,
    website: updatedWebsite,
    languagesOffered: updatedLanguages,
    description: updatedDescription,
    validated: true
  })
  .then((response) => {
    alert("Platform updated successfully!");
    closeEditPlatformModal();
    getPlatforms();
  })
  .catch((error) => {
    alert("Error updating platform: " + error.message);
  });
}

function deletePlatform(platformId) {
  if (confirm("Are you sure you want to delete this platform?")) {
    axios.delete(`http://localhost:3000/api/LanguageLearner/admin/platforms/${platformId}`)
      .then((response) => {
        alert("Platform deleted successfully!");
        getPlatforms();
      })
      .catch((error) => {
        alert("Error deleting platform: " + error.message);
      });
  }
}
