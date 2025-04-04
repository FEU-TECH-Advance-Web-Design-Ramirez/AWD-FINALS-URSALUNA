document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('platformSubmissionForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const platformData = {
                name: document.getElementById('platformName').value,
                website: document.getElementById('website').value,
                languagesOffered: document.getElementById('languages').value,
                description: document.getElementById('description').value,
                isValidated: false // Explicitly set initial validation status
            };

            try {
                const response = await axios.post('http://localhost:3000/api/LanguageLearner/platforms', platformData);
                alert('Platform submitted successfully! It will be available after admin validation.');
                form.reset();
                window.location.href = '../home-page/index.html';
            } catch (error) {
                console.error('Error submitting platform:', error);
                alert('Error submitting platform. Please try again.');
            }
        });
    }
});