// ====== ENHANCED VERSION OF YOUR CODE ======

// Your original profiles with enhancements
const profiles = [
    { 
        id: 1,
        name: "Sarah", 
        age: 22, 
        bio: "Love traveling and coffee. Let's chat!", 
        img: "👩‍💼",
        avatar: "https://i.pravatar.cc/400?img=5", 
        gender: "female",
        interests: ["Travel", "Coffee", "Photography", "Yoga"],
        location: "New York",
        online: true,
        lastActive: "Just now"
    },
    { 
        id: 2,
        name: "Jessica", 
        age: 24, 
        bio: "Artist and dreamer. Looking for a muse.", 
        img: "🎨",
        avatar: "https://i.pravatar.cc/400?img=9", 
        gender: "female",
        interests: ["Painting", "Poetry", "Museums", "Wine"],
        location: "Paris",
        online: true,
        lastActive: "5 min ago"
    },
    { 
        id: 3,
        name: "Mike", 
        age: 26, 
        bio: "Fitness enthusiast. Let's hit the gym!", 
        img: "💪",
        avatar: "https://i.pravatar.cc/400?img=11", 
        gender: "male",
        interests: ["Gym", "Nutrition", "Hiking", "Podcasts"],
        location: "Los Angeles",
        online: false,
        lastActive: "2 hours ago"
    },
    { 
        id: 4,
        name: "Kevin", 
        age: 23, 
        bio: "Gamer and tech geek. Let's play!", 
        img: "🎮",
        avatar: "https://i.pravatar.cc/400?img=13", 
        gender: "male",
        interests: ["Gaming", "Programming", "Anime", "Pizza"],
        location: "Tokyo",
        online: true,
        lastActive: "Just now"
    },
    { 
        id: 5,
        name: "Alex", 
        age: 25, 
        bio: "Musician and foodie. Always up for an adventure!", 
        img: "🎸",
        avatar: "https://i.pravatar.cc/400?img=15", 
        gender: "male",
        interests: ["Music", "Cooking", "Road Trips", "Comedy"],
        location: "Austin",
        online: true,
        lastActive: "Just now"
    },
    { 
        id: 6,
        name: "Maya", 
        age: 27, 
        bio: "Digital nomad and dog lover. Let's explore together!", 
        img: "🌍",
        avatar: "https://i.pravatar.cc/400?img=17", 
        gender: "female",
        interests: ["Travel", "Dogs", "Startups", "Surfing"],
        location: "Bali",
        online: false,
        lastActive: "Yesterday"
    }
];

// Your original variables with enhancements
let currentIndex = 0;
let currentMatch = null;
let currentUser = null;
let matches = JSON.parse(localStorage.getItem('loveLinkMatches')) || [];
let messages = JSON.parse(localStorage.getItem('loveLinkMessages')) || {};
let likesGiven = JSON.parse(localStorage.getItem('loveLinkLikes')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user was already logged in
    const savedUser = localStorage.getItem('loveLinkUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('discovery-screen').classList.remove('hidden');
        showFab();
        renderProfile();
        updateMatchCount();
    }
    
    // Initialize event listeners
    initEventListeners();
    loadUnreadMessages();
});

// ====== ENHANCED FUNCTIONS (Building on yours) ======

// Your showDiscovery function with enhancements
function showDiscovery() {
    const name = document.getElementById('user-name').value.trim();
    const genderPref = document.getElementById('user-gender').value;
    
    if (!name) {
        showNotification("Please enter your name!", "error");
        document.getElementById('user-name').focus();
        return;
    }
    
    if (!genderPref) {
        showNotification("Please select who you're looking for!", "error");
        return;
    }
    
    // Save user data
    currentUser = {
        id: Date.now(),
        name: name,
        genderPreference: genderPref,
        joinDate: new Date().toISOString()
    };
    
    localStorage.setItem('loveLinkUser', JSON.stringify(currentUser));
    
    // Smooth transition
    const loginScreen = document.getElementById('login-screen');
    loginScreen.style.opacity = '0';
    loginScreen.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        loginScreen.classList.add('hidden');
        document.getElementById('discovery-screen').classList.remove('hidden');
        
        // Initialize discovery screen
        showFab();
        renderProfile();
        updateMatchCount();
        showNotification(`Welcome to Love Link, ${name}! ❤️`, "success");
        
        // Reset styles
        setTimeout(() => {
            loginScreen.style.opacity = '1';
            loginScreen.style.transform = 'translateY(0)';
        }, 300);
    }, 300);
}

// Your renderProfile function with enhancements
function renderProfile() {
    const genderPref = currentUser ? currentUser.genderPreference : 
                     document.getElementById('user-gender').value;
    
    const filtered = profiles.filter(p => p.gender === genderPref);
    
    if (filtered.length === 0) {
        showNoProfiles();
        return;
    }
    
    if (currentIndex >= filtered.length) currentIndex = 0;
    currentMatch = filtered[currentIndex];
    
    // Update profile card with new elements
    const profileEmoji = document.getElementById('profile-emoji');
    const discName = document.getElementById('disc-name');
    const discAge = document.getElementById('disc-age');
    const discBio = document.getElementById('disc-bio');
    const discInterests = document.getElementById('disc-interests');
    const profilesLeft = document.getElementById('profiles-left');
    const swipeProgress = document.getElementById('swipe-progress');
    
    if (profileEmoji) profileEmoji.textContent = currentMatch.img;
    if (discName) discName.textContent = currentMatch.name;
    if (discAge) discAge.textContent = currentMatch.age;
    if (discBio) discBio.textContent = currentMatch.bio;
    
    // Update profile image (keep your original image loading)
    const discImg = document.getElementById('disc-img');
    if (discImg && discImg.tagName === 'IMG') {
        discImg.src = currentMatch.avatar;
        discImg.alt = `${currentMatch.name}'s profile`;
    }
    
    // Update interests
    if (discInterests && currentMatch.interests) {
        discInterests.innerHTML = currentMatch.interests
            .map(interest => `<span class="interest-tag">${interest}</span>`)
            .join('');
    }
    
    // Update progress
    if (profilesLeft) {
        const remaining = Math.max(0, filtered.length - currentIndex - 1);
        profilesLeft.textContent = remaining;
    }
    
    if (swipeProgress) {
        const progress = ((currentIndex + 1) / filtered.length) * 100;
        swipeProgress.style.width = `${progress}%`;
    }
    
    // Update status indicator
    updateStatusIndicator(currentMatch.online);
}

// Enhanced nextProfile with animation
function nextProfile() {
    const card = document.getElementById('profile-card');
    if (card) {
        card.classList.add('swipe-left');
        
        // Play swipe sound
        playSound('swipe');
        
        setTimeout(() => {
            card.classList.remove('swipe-left');
            currentIndex++;
            renderProfile();
            
            // Show notification if liked before
            if (likesGiven.includes(currentMatch.id)) {
                showNotification(`You liked ${currentMatch.name} before! 💖`, "info");
            }
        }, 300);
    }
}

// Your checkMatch function enhanced (now swipeRight)
function swipeRight() {
    const card = document.getElementById('profile-card');
    if (card) {
        card.classList.add('swipe-right');
        playSound('swipe');
        
        // Add to likes
        if (!likesGiven.includes(currentMatch.id)) {
            likesGiven.push(currentMatch.id);
            localStorage.setItem('loveLinkLikes', JSON.stringify(likesGiven));
        }
        
        setTimeout(() => {
            card.classList.remove('swipe-right');
            
            // Simulate match (50% chance instead of 100% for realism)
            const isMatch = Math.random() > 0.5;
            
            if (isMatch) {
                // It's a match!
                if (!matches.some(m => m.id === currentMatch.id)) {
                    matches.push(currentMatch);
                    localStorage.setItem('loveLinkMatches', JSON.stringify(matches));
                }
                
                showMatchAnimation();
            } else {
                // Just liked, no match yet
                showNotification(`You liked ${currentMatch.name}! 💖`, "info");
                currentIndex++;
                renderProfile();
            }
        }, 300);
    }
}

// New: Super Like function
function superLike() {
    playSound('match'); // Special sound for super like
    
    // Add to matches directly (super like guarantees match in simulation)
    if (!matches.some(m => m.id === currentMatch.id)) {
        matches.push(currentMatch);
        localStorage.setItem('loveLinkMatches', JSON.stringify(matches));
    }
    
    // Show super like animation
    const card = document.getElementById('profile-card');
    if (card) {
        card.classList.add('swipe-right');
        card.style.boxShadow = '0 0 30px gold';
        
        setTimeout(() => {
            card.classList.remove('swipe-right');
            card.style.boxShadow = '';
            showMatchAnimation(true); // true = super like
        }, 400);
    }
}

// New: Show match animation
function showMatchAnimation(isSuperLike = false) {
    const overlay = document.getElementById('match-overlay');
    const matchText = document.getElementById('match-text');
    const user1Emoji = document.getElementById('user1-emoji');
    const user2Emoji = document.getElementById('user2-emoji');
    
    if (overlay && matchText && user1Emoji && user2Emoji) {
        matchText.textContent = isSuperLike 
            ? `You SUPER LIKED ${currentMatch.name}! 💫` 
            : `You matched with ${currentMatch.name}!`;
        
        user1Emoji.textContent = '👤'; // Current user emoji
        user2Emoji.textContent = currentMatch.img;
        
        overlay.classList.remove('hidden');
        
        // Play match sound
        playSound('match');
        
        // Add confetti
        createConfetti();
    }
}

// Your checkMatch function (renamed for clarity)
function startChatAfterMatch() {
    document.getElementById('match-overlay').classList.add('hidden');
    document.getElementById('discovery-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.remove('hidden');
    
    // Set up chat
    const chatWithName = document.getElementById('chat-with-name');
    const chatEmoji = document.getElementById('chat-emoji');
    const chatAvatar = document.getElementById('chat-avatar');
    
    if (chatWithName) chatWithName.textContent = currentMatch.name;
    if (chatEmoji) chatEmoji.textContent = currentMatch.img;
    if (chatAvatar && chatAvatar.tagName === 'IMG') {
        chatAvatar.src = currentMatch.avatar;
    }
    
    // Load chat history
    loadChat(currentMatch.id);
    
    // Hide empty chat state if we have messages
    const emptyChat = document.getElementById('empty-chat');
    if (emptyChat && getMessagesForProfile(currentMatch.id).length > 0) {
        emptyChat.style.display = 'none';
    }
    
    // Add welcome message if first time
    if (getMessagesForProfile(currentMatch.id).length === 0) {
        setTimeout(() => {
            addMessage(
                currentMatch.id,
                `Hey there! I'm ${currentMatch.name}. Thanks for matching with me! 😊`,
                false
            );
        }, 1000);
    }
}

// Close match overlay and continue
function closeMatch() {
    document.getElementById('match-overlay').classList.add('hidden');
    currentIndex++;
    renderProfile();
    updateMatchCount();
}

// Your sendMessage function enhanced
function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    if (!currentMatch) {
        showNotification("No active chat!", "error");
        return;
    }
    
    // Add message
    addMessage(currentMatch.id, text, true);
    input.value = "";
    
    // Play message sound
    playSound('message');
    
    // Simulate typing indicator
    showTypingIndicator(true);
    
    // Simulate reply after delay (1-3 seconds)
    setTimeout(() => {
        showTypingIndicator(false);
        
        const replies = [
            "Hey! How are you? 😊",
            "I'm so glad we matched!",
            "What are you up to today?",
            "You have a great profile!",
            "That's interesting! Tell me more.",
            "I feel the same way!",
            "We should meet up sometime!",
            "What's your favorite thing to do on weekends?",
            "I love your sense of humor! 😄",
            "Can't wait to get to know you better!"
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(currentMatch.id, randomReply, false);
        
        // Play received message sound
        playSound('message');
    }, 1000 + Math.random() * 2000);
}

// Your addMessage function enhanced
function addMessage(profileId, text, isSent) {
    const message = {
        id: Date.now(),
        profileId: profileId,
        text: text,
        sent: isSent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        read: isSent // Sent messages are read immediately
    };
    
    // Initialize messages array for this profile if it doesn't exist
    if (!messages[profileId]) {
        messages[profileId] = [];
    }
    
    messages[profileId].push(message);
    
    // Save to localStorage
    localStorage.setItem('loveLinkMessages', JSON.stringify(messages));
    
    // Update chat display if this is the current chat
    const currentChatProfile = document.getElementById('chat-with-name');
    if (currentChatProfile && currentMatch && currentMatch.id === profileId) {
        displayMessage(message);
    }
    
    // Update unread count
    updateUnreadCount();
}

// New: Display a single message
function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const emptyChat = document.getElementById('empty-chat');
    
    if (emptyChat) emptyChat.style.display = 'none';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `msg ${message.sent ? 'sent' : 'received'}`;
    
    messageDiv.innerHTML = `
        <div class="msg-text">${message.text}</div>
        <div class="msg-time">${message.time}</div>
    `;
    
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// New: Load chat for a specific profile
function loadChat(profileId) {
    const chatBox = document.getElementById('chat-box');
    const emptyChat = document.getElementById('empty-chat');
    
    if (!chatBox) return;
    
    // Clear chat box
    chatBox.innerHTML = '';
    
    // Show empty state if no messages
    const profileMessages = getMessagesForProfile(profileId);
    if (profileMessages.length === 0 && emptyChat) {
        emptyChat.style.display = 'flex';
    } else {
        // Display all messages
        profileMessages.forEach(msg => displayMessage(msg));
    }
}

// New: Get messages for a profile
function getMessagesForProfile(profileId) {
    return messages[profileId] || [];
}

// ====== NEW FEATURE FUNCTIONS ======

// Notification system
function showNotification(message, type = "info") {
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    
    if (!toast || !toastMessage || !toastIcon) return;
    
    // Set message and icon based on type
    toastMessage.textContent = message;
    
    switch(type) {
        case "success":
            toastIcon.textContent = "✅";
            toast.style.backgroundColor = "#4CAF50";
            break;
        case "error":
            toastIcon.textContent = "❌";
            toast.style.backgroundColor = "#f44336";
            break;
        case "warning":
            toastIcon.textContent = "⚠️";
            toast.style.backgroundColor = "#ff9800";
            break;
        default:
            toastIcon.textContent = "💝";
            toast.style.backgroundColor = "#ff4b6e";
    }
    
    // Show toast
    toast.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// FAB (Floating Action Button) functions
function showFab() {
    const fab = document.getElementById('fab');
    if (fab) fab.classList.remove('hidden');
}

function toggleFabMenu() {
    const fabMenu = document.getElementById('fab-menu');
    if (fabMenu) fabMenu.classList.toggle('hidden');
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('loveLinkTheme', isDark ? 'dark' : 'light');
    showNotification(`Switched to ${isDark ? 'dark' : 'light'} mode`);
    toggleFabMenu();
}

function showMatchesList() {
    if (matches.length === 0) {
        showNotification("No matches yet! Keep swiping 💕", "info");
        toggleFabMenu();
        return;
    }
    
    // Create matches modal
    const modal = document.createElement('div');
    modal.className = 'match-overlay';
    modal.innerHTML = `
        <div class="match-content" style="max-width: 400px; padding: 20px;">
            <h2 style="color: #ff4b6e; margin-bottom: 20px;">Your Matches 💝</h2>
            <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                ${matches.map(match => `
                    <div onclick="openMatchChat(${match.id})" 
                         style="display: flex; align-items: center; padding: 15px; 
                                background: #f9f9f9; margin: 10px 0; border-radius: 15px; 
                                cursor: pointer; transition: 0.3s;">
                        <div style="font-size: 2rem; margin-right: 15px; background: #ff4b6e; 
                                    color: white; width: 50px; height: 50px; border-radius: 50%; 
                                    display: flex; align-items: center; justify-content: center;">
                            ${match.img}
                        </div>
                        <div style="flex: 1;">
                            <strong>${match.name}, ${match.age}</strong>
                            <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">
                                ${match.interests.slice(0, 2).join(', ')}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-main" onclick="this.parentElement.parentElement.remove()">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    toggleFabMenu();
}

function openMatchChat(profileId) {
    const match = profiles.find(p => p.id === profileId);
    if (!match) return;
    
    // Remove matches modal
    document.querySelector('.match-overlay')?.remove();
    
    // Switch to chat
    currentMatch = match;
    document.getElementById('discovery-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.remove('hidden');
    
    // Set up chat
    const chatWithName = document.getElementById('chat-with-name');
    const chatEmoji = document.getElementById('chat-emoji');
    
    if (chatWithName) chatWithName.textContent = match.name;
    if (chatEmoji) chatEmoji.textContent = match.img;
    
    loadChat(profileId);
}

function showProfile() {
    if (!currentUser) return;
    
    const modal = document.createElement('div');
    modal.className = 'match-overlay';
    modal.innerHTML = `
        <div class="match-content" style="max-width: 400px; padding: 20px;">
            <h2 style="color: #ff4b6e; margin-bottom: 20px;">Your Profile 👤</h2>
            <div style="background: #f9f9f9; padding: 25px; border-radius: 20px; margin-bottom: 20px;">
                <div style="font-size: 4rem; text-align: center; margin-bottom: 20px;">👤</div>
                <h3 style="text-align: center; margin-bottom: 10px;">${currentUser.name}</h3>
                <p style="text-align: center; color: #666; margin-bottom: 20px;">
                    Looking for: ${currentUser.genderPreference === 'male' ? 'Men' : 'Women'}
                </p>
                <div style="display: flex; justify-content: space-around; text-align: center;">
                    <div>
                        <div style="font-size: 1.5rem; color: #ff4b6e; font-weight: bold;">${matches.length}</div>
                        <div style="font-size: 0.9rem; color: #666;">Matches</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; color: #ff4b6e; font-weight: bold;">${likesGiven.length}</div>
                        <div style="font-size: 0.9rem; color: #666;">Likes</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; color: #ff4b6e; font-weight: bold;">${Object.keys(messages).length}</div>
                        <div style="font-size: 0.9rem; color: #666;">Chats</div>
                    </div>
                </div>
            </div>
            <button class="btn-main" onclick="this.parentElement.parentElement.remove()">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    toggleFabMenu();
}

function showSettings() {
    showNotification("Settings feature coming soon!", "info");
    toggleFabMenu();
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('loveLinkUser');
        location.reload();
    }
}

// Quick reply function
function useQuickReply(text) {
    const input = document.getElementById('msg-input');
    input.value = text;
    input.focus();
}

// Emoji picker functions
function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    if (picker) picker.classList.toggle('hidden');
}

function insertEmoji(emoji) {
    const input = document.getElementById('msg-input');
    input.value += emoji;
    input.focus();
}

// Sound functions
function playSound(type) {
    try {
        const audio = document.getElementById(`${type}-sound`);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log("Audio play failed:", e));
        }
    } catch (e) {
        // Sound not supported or blocked
    }
}

// Typing indicator
function showTypingIndicator(show) {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.textContent = show ? "typing..." : "Online";
    }
}

// Update match count
function updateMatchCount() {
    const matchCount = document.getElementById('match-count');
    if (matchCount) {
        matchCount.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
    }
}

// Update unread messages count
function updateUnreadCount() {
    // This would update a badge on the FAB
    const fab = document.getElementById('fab');
    if (fab) {
        let unreadCount = 0;
        
        // Count unread messages (received messages not sent by user)
        for (const profileId in messages) {
            unreadCount += messages[profileId].filter(m => !m.sent && !m.read).length;
        }
        
        // Update FAB badge
        const existingBadge = fab.querySelector('.fab-badge');
        if (unreadCount > 0) {
            if (!existingBadge) {
                const badge = document.createElement('span');
                badge.className = 'fab-badge';
                badge.textContent = unreadCount;
                fab.appendChild(badge);
            } else {
                existingBadge.textContent = unreadCount;
            }
        } else if (existingBadge) {
            existingBadge.remove();
        }
    }
}

// Load unread messages on startup
function loadUnreadMessages() {
    updateUnreadCount();
}

// Update status indicator
function updateStatusIndicator(isOnline) {
    const statusElement = document.querySelector('.status');
    if (statusElement) {
        if (isOnline) {
            statusElement.className = 'status online';
            statusElement.innerHTML = '<i class="fas fa-circle"></i> Online now';
        } else {
            statusElement.className = 'status offline';
            statusElement.innerHTML = '<i class="fas fa-circle"></i> Recently';
        }
    }
}

// Show no profiles state
function showNoProfiles() {
    const profileCard = document.getElementById('profile-card');
    if (profileCard) {
        profileCard.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-slash"></i>
                <h3>No more profiles!</h3>
                <p>Check back later for new matches.</p>
                <button class="btn-main" onclick="location.reload()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        `;
    }
}

// Initialize event listeners
function initEventListeners() {
    // Enter key for login
    document.getElementById('user-name')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') showDiscovery();
    });
    
    // Enter key for chat
    document.getElementById('msg-input')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Click outside to close FAB menu
    document.addEventListener('click', function(e) {
        const fab = document.getElementById('fab');
        const fabMenu = document.getElementById('fab-menu');
        
        if (fabMenu && !fabMenu.classList.contains('hidden') && 
            !fab.contains(e.target) && 
            !fabMenu.contains(e.target)) {
            fabMenu.classList.add('hidden');
        }
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('loveLinkTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Confetti effect for matches
function createConfetti() {
    const colors = ['#ff4b6e', '#ff8fa3', '#ffb3c1', '#4CAF50', '#2196F3', '#FFD700'];
    
    for (let i = 0; i < 30; i++) {
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
                animation: confettiFall ${Math.random() * 2 + 1}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
    
    // Add confetti animation style if not present
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
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

// Back to login function
function showLogin() {
    document.getElementById('discovery-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('fab').classList.add('hidden');
}
