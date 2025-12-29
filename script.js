let currentSong = new Audio();
let play = document.querySelector("#play");
let next = document.querySelector("#next");
let previous = document.querySelector("#previous");
let circle = document.querySelector(".circle");
let bar = document.querySelector(".seekbar")

function calculatePercentageValue(percentage, total) {
    if (typeof percentage !== 'number' || typeof total !== 'number') {
        throw new Error("Both percentage and total must be numbers.");
    }
    return (percentage / 100) * total;
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function calculatePercentage(value, total) {
    if (total === 0 || isNaN(value) || isNaN(total)) return 0;
    return (value / total) * 100;
}


async function getSongs() {
    let fet = await fetch("http://127.0.0.1:5500/songs/")
    let response = await fet.text()

    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href);
        }

    }

    return songs

}

const playMusic = (track, pause = false) => {
    let src = "/songs/" + track
    currentSong.src = src;
    currentSong.load()
    if (!pause) {
        currentSong.play()
        play.src = 'img/pause.svg'
    }
    document.querySelector('.songinfo').innerHTML = track.replace(".mp3", "").replace("http://127.0.0.1:5500/songs/","")
    document.querySelector('.songtime').innerHTML = "00:00/00:00"
}

async function main() {
    let songs = await getSongs();
    playMusic(songs[0].replace("http://127.0.0.1:5500/songs/",""), true)

    let songUL = document.querySelector('.librarysongs').getElementsByTagName('ul')[0];

    for (let i = 0; i < songs.length; i++) {

        const element = songs[i].split('/songs/')[1];
        songUL.innerHTML = songUL.innerHTML + `<li class="flex">
                            <img src="img/music.svg" alt="music" class="invert">
                            <span class="songDetails">
                                <Span>${element.replaceAll('%20', ' ').replace('.mp3', '')}</Span>
                                <p>Anonymous</p>
                            </span>
                            <div class="libplay flex">
                            <span class="playnow">Play Now</span>
                            <img src="img/play.svg" alt="playsong" class="invert">
                            </div>
                        </li>`
    }

    Array.from(document.querySelector('.librarysongs').getElementsByTagName('li')).forEach((e) => {
        e.addEventListener('click', () => {
            playMusic(e.querySelector('.songDetails').firstElementChild.innerHTML + ".mp3");
            // loadSong(e.querySelector('.songDetails').firstElementChild.innerHTML + ".mp3");
        })
    })

    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = 'img/pause.svg'
            
        } else {
            currentSong.pause()
            play.src = 'img/play.svg'
        }
    })

    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.songtime').innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        let per = calculatePercentage(currentSong.currentTime, currentSong.duration)
        circle.style.left = `${per}%`
        if(currentSong.currentTime === currentSong.duration){
            currentSong.pause()
            play.src = 'img/play.svg'
        }
    })

    bar.addEventListener('click',(e) => {
        let percent = (e.offsetX/bar.clientWidth)*100;
        circle.style.left = `${percent}%`
        let time = calculatePercentageValue(percent,currentSong.duration)
        currentSong.currentTime = time

    })


}

main()
