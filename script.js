let currentSong = new Audio();
let play = document.querySelector("#play");
let next = document.querySelector("#next");
let previous = document.querySelector("#previous");
let circle = document.querySelector(".circle");
let bar = document.querySelector(".seekbar")
let volumeSlider = document.querySelector("#volumeSlider");
let songs;
let currFolder;
let albums;

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

function volumeSet(vol) {
    if (vol > 50) {
        document.querySelector('#vol').src = 'img/volume.svg';
    } else if (vol === 0) {
        document.querySelector('#vol').src = 'img/mute.svg';
    } else {
        document.querySelector('#vol').src = 'img/lowvolume.svg';
    }

    currentSong.volume = vol / 100;
}

async function getSongs(folder) {
    let fet = await fetch(`http://127.0.0.1:5500/songs/${folder}`);
    let response = await fet.text();

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

async function getAlbums() {
    let alb = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await alb.text();

    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    let albums = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (!element.href.endsWith('/')) {
            albums.push(element.href);
        }
    }
    return albums;

}



const playMusic = (track, pause = false, folder) => {

    track.replace(`${folder}`, "")
    let src = `/songs/${folder}/` + track

    currentSong.src = src;
    currentSong.load()
    if (!pause) {
        currentSong.play()
        play.src = 'img/pause.svg'
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track).replace(".mp3", "").replace(`http://127.0.0.1:5500/songs/${folder}/`, "")
    document.querySelector('.songtime').innerHTML = "00:00/00:00"
}

const createPlaylist = async (songs) => {
    let songUL = document.querySelector('.librarysongs').getElementsByTagName('ul')[0];
    songUL.innerHTML = "";
    for (let i = 0; i < songs.length; i++) {

        const element = songs[i].split('/songs/')[1];
        songUL.innerHTML = songUL.innerHTML + `<li class="flex">
                            
                            <img src="img/music.svg" alt="music" class="invert">
                            <span class="songDetails">
                                <Span>${element.replace(`${currFolder}/`, "").replaceAll('%20', ' ').replace('.mp3', '')}</Span>
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
            playMusic(e.querySelector('.songDetails').firstElementChild.innerHTML + ".mp3", false, currFolder);
        })
    })
    play.src = 'img/play.svg'
}


async function main() {
    albums = await getAlbums()
    currFolder = albums[1].replace("http://127.0.0.1:5500/songs/", "")
    songs = await getSongs(currFolder);
    await createPlaylist(songs)
    playMusic(songs[0].replace(`http://127.0.0.1:5500/songs/${currFolder}/`, ""), true, currFolder)

    let playlistcont = document.querySelector('.cardContainer')
    for (let i = 1; i < albums.length; i++) {
        const element = albums[i].split('/songs/')[1];
        playlistcont.innerHTML = playlistcont.innerHTML + `
                    <div class="card flex fldir-column rounded">
                        <div class="play flex justify-center align-center">
                            <img src="/img/play.svg" alt="play">
                        </div>
                        <img src="happy-hits.jpg" alt="">
                        <h2>${element.replaceAll("%20", " ")}</h2>
                        <p>${element.replaceAll("%20", " ")}</p>
                    </div>`
    }

    let alb = document.querySelector(".card");

    document.querySelectorAll(".card").forEach((e) => {
        e.addEventListener('click', async () => {
            let alb_name = e.querySelector("h2").innerHTML;
            currFolder = alb_name.replaceAll(" ", "%20")
            songs = await getSongs(currFolder)
            await createPlaylist(songs)
            playMusic(songs[0].replace(`http://127.0.0.1:5500/songs/${currFolder}/`, ""), true, currFolder)
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
        if (currentSong.currentTime === currentSong.duration) {
            currentSong.pause()
            play.src = 'img/play.svg'
        }
    })

    bar.addEventListener('click', (e) => {
        let percent = (e.offsetX / bar.clientWidth) * 100;
        circle.style.left = `${percent}%`
        let time = calculatePercentageValue(percent, currentSong.duration)
        currentSong.currentTime = time

    })

    volumeSlider.addEventListener("input", (e) => {
        volumeSet(parseFloat(e.target.value));
    })

    next.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src);
        if (index === songs.length - 1) {
            playMusic(songs[0].replace(`http://127.0.0.1:5500/songs/${currFolder}/`, ""), false, currFolder)
        } else {
            playMusic(songs[index + 1].replace(`http://127.0.0.1:5500/songs/${currFolder}/`, ""), false, currFolder);
        }
    })

    previous.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src);
        if (index === 0) {
            playMusic(songs[songs.length - 1].replace(`http://127.0.0.1:5500/songs/${currFolder}/`, ""), false, currFolder)
        } else {
            playMusic(songs[index - 1].replace(`http://127.0.0.1:5500/songs/${currFolder}/`, ""), false, currFolder);
        }
    })

    document.querySelector("#menu").addEventListener('click', () => {
        document.querySelector("#left").style.left = "0";
    })

    document.querySelector("#close").addEventListener('click', () => {
        document.querySelector("#left").style.left = "-120%";
    })

}

main()
