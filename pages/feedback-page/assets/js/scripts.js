const menuIcon = document.getElementById("menu-icon");
const menuItems = document.getElementById("menu-items");
const ratingStars = document.getElementById("ratingStars");
const ratingInput = document.getElementById("rating");

document.addEventListener('DOMContentLoaded', () => {
    // Load platforms when page loads
    loadPlatforms();
    setupStarRating();

    const form = document.getElementById('feedbackForm');
    if (form) {
        form.addEventListener('submit', handleReviewSubmission);
    }
});

async function loadPlatforms() {
    try {
        const response = await axios.get('http://localhost:3000/api/LanguageLearner/platforms');
        console.log('All platforms:', response.data);
        // Only show validated platforms
        const validatedPlatforms = response.data.filter(platform => platform.validated === true);
        console.log('Validated platforms:', validatedPlatforms);
        
        const platformSelect = document.getElementById('platform');
        platformSelect.innerHTML = '<option value="">Select Platform</option>';

        if (validatedPlatforms.length === 0) {
            console.log('No validated platforms available');
            return;
        }

        validatedPlatforms.forEach(platform => {
            const option = document.createElement('option');
            option.value = platform.id;
            option.textContent = platform.name;
            platformSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading platforms:', error);
        alert('Error loading platforms. Please try again.');
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating label');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseover', () => {
            // Highlight current star and all previous stars
            for (let i = 0; i <= index; i++) {
                stars[i].querySelector('i').classList.remove('text-gray-400');
                stars[i].querySelector('i').classList.add('text-yellow-400');
            }
        });

        star.addEventListener('mouseout', () => {
            // On mouseout, only keep the stars highlighted up to the selected rating
            const selectedRating = document.querySelector('input[name="rating"]:checked');
            const selectedIndex = selectedRating ? parseInt(selectedRating.value) - 1 : -1;
            
            stars.forEach((s, i) => {
                const starIcon = s.querySelector('i');
                if (i <= selectedIndex) {
                    starIcon.classList.remove('text-gray-400');
                    starIcon.classList.add('text-yellow-400');
                } else {
                    starIcon.classList.remove('text-yellow-400');
                    starIcon.classList.add('text-gray-400');
                }
            });
        });

        star.addEventListener('click', () => {
            // When a star is clicked, update all stars up to the clicked one
            const clickedRating = index + 1;
            stars.forEach((s, i) => {
                const starIcon = s.querySelector('i');
                if (i < clickedRating) {
                    starIcon.classList.remove('text-gray-400');
                    starIcon.classList.add('text-yellow-400');
                } else {
                    starIcon.classList.remove('text-yellow-400');
                    starIcon.classList.add('text-gray-400');
                }
            });
        });
    });
}

async function handleReviewSubmission(e) {
    e.preventDefault();

    const platformId = parseInt(document.getElementById('platform').value);
    const review = document.getElementById('review').value;
    const rating = parseInt(document.querySelector('input[name="rating"]:checked')?.value);

    // Get user ID from localStorage or session
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        alert('Please log in to submit a review');
        return;
    }

    if (!platformId || !review || !rating) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/LanguageLearner/reviews', {
            platformId: platformId,
            userId: userId,
            comment: review,
            rating: rating
        });

        // Store the timestamp of the last review in localStorage
        localStorage.setItem('lastReviewTimestamp', Date.now().toString());
        
        alert('Review submitted successfully! Your review will be visible in the rankings after admin validation.');
        e.target.reset();
        // Reset star rating display
        document.querySelectorAll('.star-rating i').forEach(star => {
            star.classList.remove('text-yellow-400');
            star.classList.add('text-gray-400');
        });

        // Redirect to rankings page to see the update
        window.location.href = '../feedback-page/index.html';
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Please try again.');
    }
}

menuIcon.addEventListener("click", () => {
    menuItems.classList.toggle("hidden");
});





