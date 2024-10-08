document.addEventListener('DOMContentLoaded', function() {
    const appContainer = document.getElementById('appContainer');
    const scoreTableBtn = document.getElementById('showScoreTable');
    const yourScoresBtn = document.getElementById('showYourScores');

    // Function to load a template by ID
    function loadTemplate(templateId) {
        const template = document.getElementById(templateId);
        const content = template.content.cloneNode(true); // Clone the template content

        // Fade out the current content
        appContainer.classList.add('hidden1');

        // Wait for the fade-out transition to complete, then replace content
        setTimeout(() => {
            appContainer.innerHTML = ''; // Clear current content
            appContainer.appendChild(content); // Append the new content
            appContainer.classList.remove('hidden1'); // Fade in the new content
        }, 300); // Match the CSS transition duration
    }

    // Event listeners for buttons
    scoreTableBtn.addEventListener('click', function() {
        loadTemplate('scoreTableTemplate');
    });

    yourScoresBtn.addEventListener('click', function() {
        loadTemplate('yourScoresTemplate');
    });

    // Load the Score Table template initially
    loadTemplate('scoreTableTemplate');
});