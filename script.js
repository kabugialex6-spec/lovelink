const fakeProfiles = [
    { name: "Sarah", video: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-bed-talking-on-video-call-43053-large.mp4", gender: "female" },
    { name: "Mike", video: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-and-talking-41865-large.mp4", gender: "male" }
];

let callTimer;

function findMatch() {
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;

    if (!name || !gender) {
        alert("Please fill in your Name and Gender choice!");
        return;
    }

    document.getElementById('status').innerText = "🔍 Finding a match...";

    setTimeout(() => {
        const match = fakeProfiles.find(p => p.gender === gender) || fakeProfiles[0];
        initiateCall(match);
    }, 2500);
}

function initiateCall(match) {
    const ringtone = document.getElementById('ringtone');
    const video = document.getElementById('match-video');
    
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('call-screen').classList.remove('hidden');
    document.getElementById('display-name').innerText = match.name;
    video.querySelector('source').src = match.video;
    video.load();

    ringtone.play();

    // Answer after 5 seconds
    setTimeout(() => {
        ringtone.pause();
        video.play();
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
    clearInterval(callTimer);
    location.reload();
}

// Preview Uploaded Photo in the small window
document.getElementById('photo').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const selfie = document.getElementById('selfie');
        selfie.style.backgroundImage = `url(${event.target.result})`;
        selfie.style.backgroundSize = 'cover';
        document.getElementById('selfie-text').style.display = 'none';
    };
    reader.readAsDataURL(e.target.files[0]);
});
