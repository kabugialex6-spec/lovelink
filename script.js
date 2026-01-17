// Love Link - Stable & Optimized
console.log('Love Link loaded - Stable Version');

// Profile data
const profiles = [
    {
        id: 1,
        name: "Sarah",
        age: 22,
        bio: "Love traveling and coffee. Let's chat!",
        emoji: "👩‍💼",
        gender: "female",
        interests: ["Travel", "Coffee", "Photography", "Yoga"],
        online: true
    },
    {
        id: 2,
        name: "Jessica",
        age: 24,
        bio: "Artist and dreamer. Looking for a muse.",
        emoji: "🎨",
        gender: "female",
        interests: ["Painting", "Poetry", "Museums", "Wine"],
        online: true
    },
    {
        id: 3,
        name: "Mike",
        age: 26,
        bio: "Fitness enthusiast. Let's hit the gym!",
        emoji: "💪",
        gender: "male",
        interests: ["Gym", "Nutrition", "Hiking", "Podcasts"],
        online: false
    },
    {
        id: 4,
        name: "Kevin",
        age: 23,
        bio: "Gamer and tech geek. Let's play!",
        emoji: "🎮",
        gender: "male",
        interests: ["Gaming", "Programming", "Anime", "Pizza"],
        online: true
    },
    {
        id: 5,
        name: "Alex",
        age: 25,
        bio: "Musician and foodie. Always up for an adventure!",
        emoji: "🎸",
        gender: "male",
        interests: ["Music", "Cooking", "Road Trips", "Comedy"],
        online: true
    }
];

// App state
let currentUser = null;
let currentProfileIndex = 0;
let currentMatch = null;
let matches = [];
let messages = {};

// Initialize app
function initApp() {
    console.log('Initializing Love Link...');
    
    // Load saved data
    try {
        const savedUser = localStorage.getItem('loveLinkUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showScreen('discovery-screen');
            renderProfile();
            updateMatchCount();
        }
        
        const savedMatches = localStorage.getItem('loveLinkMatches');
        if (savedMatches) {
            matches = JSON.parse(savedMatches);
        }
        
        const savedMessages = localStorage.getItem('loveLinkMessages');
        if (savedMessages) {
            messages = JSON.parse(savedMessages);
        }
    } catch (e) {
        console.log('Error loading saved data:', e);
        // Reset to defaults
        matches = [];
        messages = {};
    }
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('App initialized successfully');
}

// Show a specific screen
function showScreen(screenId) {
    // Hide all screens
    const screens = ['login-screen', 'discovery-screen', 'chat-screen'];
    screens.forEach(id => {
        const screen = document.getElementById(id);
        if (screen) screen.classList.add('hidden');
    });
    
    // Show requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.remove('hidden');
    }
    
    // Update match count if showing discovery
    if (screenId === 'discovery-screen') {
        updateMatchCount();
    }
}

// Login/Enter app
function showDiscovery() {
    const name = document.getElementById('user-name').value.trim();
    const genderPref = document.getElementById('user-gender').value;
    
    if (!name) {
        alert("Please enter your name!");
        document.getElementById('user-name').focus();
        return;
    }
    
    if (!genderPref) {
        alert("Please select who you're looking for!");
        return;
    }
    
    // Save user
    currentUser = {
        id: Date.now(),
        name: name,
        genderPreference: genderPref,
        joinDate: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('loveLinkUser', JSON.stringify(currentUser));
    } catch (e) {
        console.log('Error saving user:', e);
    }
    
    showScreen('discovery-screen');
    renderProfile();
    showNotification(`Welcome, ${name}! ❤️`);
}

// Go back to login
function showLogin() {
    showScreen('login-screen');
}

// Render current profile
function renderProfile() {
    if (!currentUser) return;
    
    const filtered = profiles.filter(p => p.gender === currentUser.genderPreference);
    
    if (filtered.length === 0) {
        showNoProfiles();
        return;
    }
    
    // Loop through profiles
    if (currentProfileIndex >= filtered.length) {
        currentProfileIndex = 0;
    }
    
    currentMatch = filtered[currentProfileIndex];
    
    // Update UI
    const nameEl = document.getElementById('disc-name');
    const bioEl = document.getElementById('disc-bio');
    const emojiEl = document.getElementById('profile-emoji');
    const interestsEl = document.getElementById('disc-interests');
    const progressBar = document.getElementById('progress-bar');
    
    if (nameEl) nameEl.textContent = `${currentMatch.name}, ${currentMatch.age}`;
    if (bioEl) bioEl.textContent = currentMatch.bio;
    if (emojiEl) emojiEl.textContent = currentMatch.emoji;
    
    // Update interests
    if (interestsEl && currentMatch.interests) {
        interestsEl.innerHTML = currentMatch.interests
            .map(interest => `<span>${interest}</span>`)
            .join('');
    }
    
    // Update progress
    if (progressBar) {
        const progress = ((currentProfileIndex + 1) / filtered.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    // Update status
    const statusEl = document.querySelector('.status');
    if (statusEl) {
        if (currentMatch.online) {
            statusEl.innerHTML = '<i class="fas fa-circle"></i> Online now';
            statusEl.className = 'status online';
        } else {
            statusEl.innerHTML = '<i class="fas fa-circle"></i> Recently';
            statusEl.className = 'status';
        }
    }
}

// Swipe left (dislike)
function swipeLeft() {
    currentProfileIndex++;
    renderProfile();
    showNotification('Profile passed');
}

// Swipe right (like)
function swipeRight() {
    // 50% chance of match
    const isMatch = Math.random() > 0.5;
    
    if (isMatch) {
        // Add to matches if not already matched
        const alreadyMatched = matches.some(m => m.id === currentMatch.id);
        if (!alreadyMatched) {
            matches.push(currentMatch);
            try {
                localStorage.setItem('loveLinkMatches', JSON.stringify(matches));
            } catch (e) {
                console.log('Error saving matches:', e);
            }
        }
        
        showMatchAnimation();
    } else {
        showNotification(`You liked ${currentMatch.name}! 💖`);
        currentProfileIndex++;
        renderProfile();
    }
    
    updateMatchCount();
}

// Show match animation
function showMatchAnimation() {
    const overlay = document.getElementById('match-overlay');
    const matchText = document.getElementById('match-text');
    
    if (overlay && matchText) {
        matchText.textContent = `You matched with ${currentMatch.name}!`;
        overlay.classList.remove('hidden');
        
        // Play sound if available
        playMatchSound();
        
        // Add confetti
        createConfetti();
    }
}

// Start chat after match
function startChatAfterMatch() {
    const overlay = document.getElementById('match-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    showScreen('chat-screen');
    
    // Setup chat
    const chatName = document.getElementById('chat-with-name');
    const chatEmoji = document.getElementById('chat-emoji');
    
    if (chatName) chatName.textContent = currentMatch.name;
    if (chatEmoji) chatEmoji.textContent = currentMatch.emoji;
    
    // Load chat messages
    loadChat(currentMatch.id);
    
    // Add welcome message
    setTimeout(() => {
        addMessage(currentMatch.id, `Hey there! I'm ${currentMatch.name}. Thanks for matching! 😊`, false);
    }, 1000);
}

// Close match overlay
function closeMatch() {
    const overlay = document.getElementById('match-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    currentProfileIndex++;
    renderProfile();
}

// Send message
function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    
    if (!text || !currentMatch) return;
    
    // Add message
    addMessage(currentMatch.id, text, true);
    input.value = "";
    
    // Show typing indicator
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
        typingEl.textContent = 'typing...';
    }
    
    // Simulate reply
    setTimeout(() => {
        if (typingEl) {
            typingEl.textContent = 'Online';
        }
        
        const replies = [
            "Hey! How are you? 😊",
            "I'm so glad we matched!",
            "What are you up to today?",
            "That's interesting! Tell me more.",
            "We should meet up sometime!",
            "What's your favorite thing to do on weekends?"
        ];
        
        const reply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(currentMatch.id, reply, false);
    }, 1000 + Math.random() * 1500);
}

// Add message to chat
function addMessage(profileId, text, isSent) {
    // Initialize messages array for profile
    if (!messages[profileId]) {
        messages[profileId] = [];
    }
    
    const message = {
        id: Date.now(),
        text: text,
        sent: isSent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now()
    };
    
    messages[profileId].push(message);
    
    // Save to localStorage
    try {
        localStorage.setItem('loveLinkMessages', JSON.stringify(messages));
    } catch (e) {
        console.log('Error saving messages:', e);
    }
    
    // Display if this is the current chat
    if (currentMatch && profileId === currentMatch.id) {
        displayMessage(message);
    }
}

// Display a message in chat
function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const emptyChat = document.getElementById('empty-chat');
    
    if (!chatBox) return;
    
    // Hide empty chat state
    if (emptyChat) {
        emptyChat.style.display = 'none';
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `msg ${message.sent ? 'sent' : 'received'}`;
    
    messageDiv.innerHTML = `
        <div>${message.text}</div>
        <div class="msg-time">${message.time}</div>
    `;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Load chat for a profile
function loadChat(profileId) {
    const chatBox = document.getElementById('chat-box');
    const emptyChat = document.getElementById('empty-chat');
    
    if (!chatBox) return;
    
    // Clear chat box
    chatBox.innerHTML = '';
    
    // Show empty state or messages
    const profileMessages = messages[profileId] || [];
    
    if (profileMessages.length === 0 && emptyChat) {
        emptyChat.style.display = 'flex';
    } else {
        profileMessages.forEach(msg => displayMessage(msg));
    }
}

// Update match count
function updateMatchCount() {
    const countEl = document.getElementById('match-count');
    if (countEl) {
        countEl.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
    }
}

// Show notification
function showNotification(message) {
    // Simple notification - could be enhanced
    console.log('Notification:', message);
    
    // Create simple toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4b6e;
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 1000;
        animation: fadeInOut 3s;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Add CSS for animation
    if (!document.querySelector('#toast-animation')) {
        const style = document.createElement('style');
        style.id = 'toast-animation';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Play match sound
function playMatchSound() {
    try {
        const audio = document.getElementById('match-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    } catch (e) {
        // Ignore audio errors
    }
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff4b6e', '#ff8fa3', '#ffb3c1', '#4CAF50', '#2196F3'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                top: -10px;
                left: ${Math.random() * 100}vw;
                z-index: 1001;
                animation: confettiFall ${Math.random() * 1 + 1}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 2000);
        }, i * 50);
    }
    
    // Add confetti animation
    if (!document.querySelector('#confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Show no profiles state
function showNoProfiles() {
    const profileCard = document.getElementById('profile-card');
    if (profileCard) {
        profileCard.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666;">
                <div style="font-size: 3rem; margin-bottom: 20px;">😔</div>
                <h3>No more profiles!</h3>
                <p style="margin-bottom: 20px;">Check back later for new matches.</p>
                <button class="btn-main" onclick="location.reload()">
                    Refresh
                </button>
            </div>
        `;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Already handled in HTML inline
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', initApp);
