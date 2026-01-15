// Database of FAKE profiles (Simulating a server)
const fakeProfiles = [
    { name: "Sarah", age: 22, img: "https://i.pravatar.cc/150?img=5", gender: "female" },
    { name: "Jessica", age: 24, img: "https://i.pravatar.cc/150?img=9", gender: "female" },
    { name: "Emily", age: 21, img: "https://i.pravatar.cc/150?img=1", gender: "female" },
    { name: "Mike", age: 25, img: "https://i.pravatar.cc/150?img=11", gender: "male" },
    { name: "Kevin", age: 23, img: "https://i.pravatar.cc/150?img=13", gender: "male" },
    { name: "Daniel", age: 26, img: "https://i.pravatar.cc/150?img=3", gender: "male" }
];

// Handle Photo Upload Preview
document.getElementById('photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('my-photo-preview');
            img.src = e.target.result;
            img.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
});

function findMatch() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const status = document.getElementById('status');

    if (!name || !age || !gender) {
        alert("Please fill in all details!");
        return;
    }

    // Show loading
    status.innerText = "🔍 Uploading profile & scanning database...";
    status.style.color = "#ff4b6e";

    setTimeout(() => {
        // FILTER: Pick a match opposite to selected gender
        const targetGender = gender === "male" ? "female" : "male";
        const possibleMatches = fakeProfiles.filter(p => p.gender === targetGender);
        
        // Pick random match
        const match = possibleMatches[Math.floor(Math.random() * possibleMatches.length)] || fakeProfiles[0];

        // Switch Screens
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'block';

        // Setup Chat Header
        document.getElementById('match-name').innerText = match.name;
        document.getElementById('match-details').innerText = `${match.age} years old • Online`;
        document.getElementById('match-img').src = match.img;

    }, 3000);
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    const msg = input.value.trim();
    if (!msg) return;

    // 1. Add User Message
    addMessage(msg, 'sent');
    input.value = "";

    // 2. Simulate Bot Typing/Reply
    setTimeout(() => {
        const replies = [
            "That's so interesting! Tell me more? 😊",
            "Haha, you're funny!",
            "I'm looking for a serious relationship. What about you?",
            "Can I have your WhatsApp number?",
            "You seem really nice! ❤️"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(randomReply, 'received');
    }, 1500 + Math.random() * 2000);
}

function addMessage(text, type) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom
}
