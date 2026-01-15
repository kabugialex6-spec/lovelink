const profiles = [
    { name: "Sarah, 22", bio: "Love traveling and coffee. Let's chat!", img: "https://i.pravatar.cc/400?img=5", gender: "female" },
    { name: "Jessica, 24", bio: "Artist and dreamer. Looking for a muse.", img: "https://i.pravatar.cc/400?img=9", gender: "female" },
    { name: "Mike, 26", bio: "Fitness enthusiast. Let's hit the gym!", img: "https://i.pravatar.cc/400?img=11", gender: "male" },
    { name: "Kevin, 23", bio: "Gamer and tech geek. Let's play!", img: "https://i.pravatar.cc/400?img=13", gender: "male" }
];

let currentIndex = 0;
let currentMatch = null;

function showDiscovery() {
    const name = document.getElementById('user-name').value;
    if (!name) return alert("Enter your name!");
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('discovery-screen').classList.remove('hidden');
    renderProfile();
}

function renderProfile() {
    const genderPref = document.getElementById('user-gender').value;
    const filtered = profiles.filter(p => p.gender === genderPref);
    
    if (currentIndex >= filtered.length) currentIndex = 0;
    currentMatch = filtered[currentIndex];
    
    document.getElementById('disc-img').src = currentMatch.img;
    document.getElementById('disc-name').innerText = currentMatch.name;
    document.getElementById('disc-bio').innerText = currentMatch.bio;
}

function nextProfile() {
    currentIndex++;
    renderProfile();
}

function checkMatch() {
    // 100% Match Rate for the simulation!
    document.getElementById('discovery-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.remove('hidden');
    document.getElementById('chat-with-name').innerText = currentMatch.name;
    document.getElementById('chat-avatar').src = currentMatch.img;
    
    addMessage("It's a Match! Say hi to " + currentMatch.name, 'received');
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'sent');
    input.value = "";

    // Simulated Bot Reply
    setTimeout(() => {
        const replies = ["Hey! How are you?", "I'm so glad we matched!", "What are you up to today?", "You have a great profile!"];
        addMessage(replies[Math.floor(Math.random() * replies.length)], 'received');
    }, 1500);
}

function addMessage(text, type) {
    const box = document.getElementById('chat-box');
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}
