function startMatching() {
    const statusText = document.getElementById('status');
    const btn = document.querySelector('.btn');

    // Change status to searching
    statusText.innerHTML = "🔍 Searching the Cloud...";
    statusText.style.color = "#ff4b6e";
    btn.disabled = true;
    btn.innerText = "Processing...";

    // Simulate a search delay
    setTimeout(() => {
        const results = [
            "💖 Match Found! Connection Secure.",
            "✨ Link Established! Check your vault.",
            "🌹 98% Match Probability Detected!",
            "🔒 Link Encrypted. Ready to chat."
        ];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        statusText.innerHTML = randomResult;
        statusText.style.color = "#4CAF50";
        btn.disabled = false;
        btn.innerText = "Search Again";
    }, 3000);
}

// Connect the button to the function
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn');
    if(btn) {
        btn.onclick = startMatching;
    }
});
