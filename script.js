function startMatching() {
    const statusText = document.getElementById('status');
    const btn = document.querySelector('.btn');
    const nameInput = document.getElementById('username');
    
    // Get the name and remove extra spaces
    const userName = nameInput.value.trim();

    // 1. Check if the box is empty
    if (userName === "") {
        alert("⚠️ Please enter your name first!");
        nameInput.focus();
        return; // Stop the code here
    }

    // 2. Start the "Search" simulation
    statusText.innerHTML = `🔍 Scanning clouds for <b>${userName}</b>...`;
    statusText.style.color = "#ff4b6e";
    
    // Disable controls so they can't click twice
    btn.disabled = true;
    btn.innerText = "Processing...";
    nameInput.disabled = true;

    // 3. Wait 3 seconds, then show result
    setTimeout(() => {
        const results = [
            `💖 ${userName}, we found a Soulmate!`,
            `✨ ${userName}'s Match: 98% Compatibility!`,
            `🌹 Connection Secure for ${userName}.`,
            `💌 ${userName}, check your secret vault.`,
            `🌟 ${userName}, someone is looking for you!`
        ];
        
        // Pick a random message
        const randomResult = results[Math.floor(Math.random() * results.length)];
        
        statusText.innerHTML = randomResult;
        statusText.style.color = "#4CAF50"; // Green for success
        
        // Reset button
        btn.disabled = false;
        btn.innerText = "Search Again";
        nameInput.disabled = false;
    }, 3000);
}

// Connect the button when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn');
    if(btn) {
        btn.onclick = startMatching;
    }
});
