// Sample platform data with default ratings
const defaultPlatforms = [
  { id: 1, name: "Duolingo", averageRating: 4.5, popularity: 1000, description: "A free language-learning platform with a gamified approach. Features bite-sized lessons, daily streaks, and a mobile app." },
  { id: 2, name: "Memrise", averageRating: 4.3, popularity: 800, description: "Uses spaced repetition and memory techniques to help users learn languages effectively. Features video clips of native speakers." },
  { id: 3, name: "Babbel", averageRating: 4.2, popularity: 50, description: "Focuses on conversation skills with real-world dialogues. Offers structured lessons and speech recognition technology." },
  { id: 4, name: "Busuu", averageRating: 4.6, popularity: 400, description: "Combines AI-powered learning with community features. Offers official language certificates and personalized study plans." },
  { id: 5, name: "Rosetta Stone", averageRating: 3.8, popularity: 20, description: "Uses immersive learning techniques with no translations. Focuses on natural language acquisition through visual and audio cues." }
];

let platforms = [];
let lastCheckedTimestamp = 0;

// Initialize the display when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const orderBy = document.getElementById('sortBy').value;
  fetchPlatforms(orderBy);
  setInterval(checkForNewReviews, 1000);
});

function checkForNewReviews() {
  const lastReviewTimestamp = parseInt(localStorage.getItem('lastReviewTimestamp') || '0');
  if (lastReviewTimestamp > lastCheckedTimestamp) {
    lastCheckedTimestamp = lastReviewTimestamp;
    const orderBy = document.getElementById('sortBy').value;
    fetchPlatforms(orderBy);
  }
}

async function fetchPlatforms(orderBy) {
  try {
    // First get all platforms
    const allPlatformsResponse = await axios.get('http://localhost:3000/api/LanguageLearner/platforms');
    let allPlatforms = allPlatformsResponse.data;

    // Then get the rankings data with the correct sort order
    const rankingsResponse = await axios.get(`http://localhost:3000/api/LanguageLearner/admin-rankings-page/${orderBy}`);
    const rankingsData = rankingsResponse.data || [];
    
    // Create a map of platform data from rankings
    const platformMap = new Map(rankingsData.map(p => [p.id.toString(), p]));
    
    // First, apply default values to predefined platforms
    allPlatforms = allPlatforms
      .filter(platform => platform.validated)
      .map(platform => {
        const defaultPlatform = defaultPlatforms.find(dp => dp.name === platform.name);
        if (defaultPlatform) {
          return {
            ...platform,
            averageRating: defaultPlatform.averageRating,
            popularity: defaultPlatform.popularity
          };
        }
        return {
          ...platform,
          averageRating: 0,
          popularity: 0
        };
      });

    // Then, override with actual review data if it exists
    const mergedPlatforms = allPlatforms.map(platform => {
      const rankingData = platformMap.get(platform.id.toString());
      if (rankingData && (rankingData.popularity > 0 || rankingData.averageRating > 0)) {
        return {
          ...platform,
          averageRating: rankingData.averageRating,
          popularity: rankingData.popularity
        };
      }
      return platform;
    });
    
    platforms = mergedPlatforms;
    displayPlatforms(platforms, orderBy);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    displayPlatforms(defaultPlatforms, orderBy);
  }
}

function displayPlatforms(platformList, orderBy) {
  const platformTable = document.getElementById('platformTable');
  platformTable.innerHTML = '';

  // Sort platforms based on orderBy parameter
  platformList.sort((a, b) => {
    if (orderBy === 'rating') {
      if (b.averageRating === a.averageRating) {
        return b.popularity - a.popularity;
      }
      return b.averageRating - a.averageRating;
    } else { // popularity
      if (b.popularity === a.popularity) {
        return b.averageRating - a.averageRating;
      }
      return b.popularity - a.popularity;
    }
  });

  platformList.forEach((platform, index) => {
    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50 transition-colors duration-200 text-lg';
    
    const rankColor = index === 0 ? 'text-secondary font-medium' :
                     index === 1 ? 'text-zinc-300 font-medium' :
                     index === 2 ? 'text-[#CD7F32] font-medium' : 'text-gray-700';
    
    row.innerHTML = `
      <td class="p-4 ${rankColor}">${index + 1}</td>
      <td class="p-4 font-medium">${platform.name}</td>
      <td class="p-4">
        <div class="flex items-center font-medium">
          <span class="text-yellow-500 mr-1">★</span>
          ${platform.averageRating}
        </div>
      </td>
      <td class="p-4 font-medium">${platform.popularity}</td>
      <td class="p-4 max-w-xl">${platform.description}</td>
    `;
    
    platformTable.appendChild(row);
  });
}

// Add event listener for the sort button
document.getElementById('sortButton').addEventListener('click', () => {
  const orderBy = document.getElementById('sortBy').value;
  fetchPlatforms(orderBy);
});