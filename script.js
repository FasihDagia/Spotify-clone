let currentSong = new Audio();
let play = document.querySelector("#play");
let next = document.querySelector("#next");
let previous = document.querySelector("#previous");

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

const playMusic = (track) => {
    let src = "/songs/" + track
    currentSong.src = src;
    currentSong.play()
    play.src = 'img/pause.svg'
    document.querySelector('.songinfo').innerHTML = track.replace(".mp3","")
    document.querySelector('.songtime').innerHTML = "00:00/00:00"
}


async function main() {

    let songs = await getSongs();
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
            playMusic(e.querySelector('.songDetails').firstElementChild.innerHTML+".mp3");
        })
    })

    play.addEventListener('click',() => {
      if(currentSong.paused){
        currentSong.play()
        play.src = 'img/pause.svg' 
      }else{
        currentSong.pause()
        play.src = 'img/play.svg'
      }
    })

    // next.addEventListener('click',() => {
    //     currentSong.next
    // })

    var audio = new Audio(songs[0]);

    audio.addEventListener("ontimeupdate", () => {
        let duration = audio.duration;
        console.log(duration);

    });

}

main()
