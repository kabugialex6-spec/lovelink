const fakeProfiles = [
    { name: "Sarah", video: "https://v.ftcdn.net/05/56/80/74/700_F_556807491_S6PshMvBv99z9BvR9yv8S98S9W5S9B.mp4", gender: "female" },
    { name: "Mike", video: "https://v.ftcdn.net/02/10/53/33/700_F_210533315_S9vS9S9vS9vS9vS9vS9v.mp4", gender: "male" }
];

let callTimer;

function findMatch() {
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;

    if (!name || !gender) {
        alert("Please fill in your Name and Gender!");
        return;
    }

    document.getElementById('status').innerText = "🔍 Connecting to secure video server...";

    setTimeout(() => {
        const match = fakeProfiles.find(p => p.gender === gender) || fakeProfiles[0];
        initiateCall(match);
    }, 2000);
}

function initiateCall(match) {
    const ringtone = document.getElementById('ringtone');
    const video = document.getElementById('match-video');
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('call-screen').classList.remove('hidden');
    document.getElementById('display-name').innerText = match.name;
    
    // Set video source
    video.src = match.video;
    video.load();
    
    // 🔊 START RINGTONE
    ringtone.play().catch(e => console.log("Audio blocked by browser"));

    // Answer after 5 seconds
    setTimeout(() => {
        ringtone.pause();
        
        // 🎥 FORCE VIDEO PLAY
        video.muted = true; // Mute first to bypass browser blocks
        video.play().then(() => {
            video.muted = false; // Unmute once playing
        }).catch(err => {
            console.log("Video failed to play:", err);
            document.getElementById('call-timer').innerText = "Video Error - Tap Screen";
        });

        document.getElementById('call-timer').innerText = "00:00";
        startClock();
    }, 5000);
}

function startClock() {
    let sec = 0;
    callTimer = setInterval(() => {
        sec++;
        let m = Math.floor(sec / 60).toString().padStart(2, '0');
        let s = (sec % 60).toString().padStart(2, '0');
        document.getElementById('call-timer').innerText = `${m}:${s}`;
    }, 1000);
}

function endCall() {
    location.reload();
}

// User Photo Preview
document.getElementById('photo').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const selfie = document.getElementById('selfie');
        selfie.style.backgroundImage = `url(${event.target.result})`;
        selfie.style.backgroundSize = 'cover';
        selfie.style.backgroundPosition = 'center';
        document.getElementById('selfie-text').style.display = 'none';
    };
    reader.readAsDataURL(e.target.files[0]);
});
