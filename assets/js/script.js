document.addEventListener("DOMContentLoaded", function () {
    const languageButtons = document.querySelectorAll(".language-toggle");
    
    languageButtons.forEach(button => {
        button.addEventListener("click", function () {
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu) {
                dropdownMenu.classList.toggle("hidden");
            }
        });
    });

    document.addEventListener("click", function (event) {
        languageButtons.forEach(button => {
            const dropdownMenu = button.nextElementSibling;
            if (dropdownMenu && !button.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add("hidden");
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const feedbackContainer = document.querySelector('.feedback-container');
    if (!feedbackContainer) return;

    const userReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');

    const defaultReviews = [
        {
            name: "Emily",
            review: "Langora has completely changed how I learn languages! The interactive lessons and AI feedback help me improve daily, and the community feature lets me practice with real people. It's more than just an app—it's a global learning experience!",
            rating: 5
        },
        {
            name: "Lebron James",
            review: "I've tried many language apps, but Langora is by far the best. The gamified lessons make learning fun, and the ability to practice with native speakers is a game-changer. I'm finally confident in my French conversations!",
            rating: 5
        },
        {
            name: "Sofia the First",
            review: "Langora makes learning so easy and flexible! The bite-sized lessons fit into my busy schedule, and the AI-powered pronunciation guide has been super helpful. I've made real progress in Japanese, and I love it!",
            rating: 5
        }
    ];
    let displayReviews = userReviews.length > 0 ? userReviews : defaultReviews;

    feedbackContainer.innerHTML = '';

    displayReviews.forEach(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        const reviewElement = document.createElement('div');
        reviewElement.className = 'flex flex-col xl:gap-3 lg:gap-3 gap-1 h-fit xl:w-2/8 lg:w-60 md:w-fit text-primary shadow-2xl xl:p-6 p-4 rounded-2xl shadow-blue-500/20 w-10/12 self-center';
        
        reviewElement.innerHTML = `
            <p class="text-primary xl:text-2xl lg:text-lg md:text-base text-sm">"${review.review}"</p>
            <p class="text-primary font-semibold xl:text-2xl lg:text-lg md:text-base text-sm">- ${review.name}</p>
            <div class="text-yellow-500 xl:text-xl text-base">
                ${Array(review.rating).fill('<i class="xl:text-2xl lg:text-lg md:text-base text-sm fa-solid fa-star"></i>').join('')}
            </div>
        `;
        
        feedbackContainer.appendChild(reviewElement);
    });
});

function displayReviews() {
    const userReviewsContainer = document.querySelector('.user-reviews-container');
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');

    userReviewsContainer.innerHTML = '';

    reviews.forEach(review => {
        const reviewElement = document.getElementById('review-template').content.cloneNode(true);
        const reviewContainer = reviewElement.querySelector('div');
        
        reviewContainer.querySelector('.review-text').textContent = `"${review.review}"`;
        reviewContainer.querySelector('.review-author').textContent = `- ${review.name}`;
        reviewContainer.querySelector('.review-stars').innerHTML = generateStars(review.rating);
        
        userReviewsContainer.appendChild(reviewContainer);
    });
}

function generateStars(rating) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('i');
        star.className = `xl:text-2xl lg:text-lg md:text-base text-sm fa-solid fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`;
        stars.push(star.outerHTML);
    }
    return stars.join('');
}

document.addEventListener('DOMContentLoaded', displayReviews);
