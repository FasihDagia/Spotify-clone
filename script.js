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
            songs.push(element.href.split('/songs/')[1]);
        }

    }

    return songs

}

async function main() {
    let songs = await getSongs();

    let songUL = document.querySelector('.librarysongs').getElementsByTagName('ul')[0];

    for (let i = 0; i < songs.length; i++) {

        const element = songs[i];
        songUL.innerHTML = songUL.innerHTML + `<li class="flex">
                            <img src="img/music.svg" alt="music" class="invert">
                            <span class="songDetails">
                                <Span>${element.replaceAll('%20', ' ').replace('.mp3', '')}</Span>
                                <p>Anonymous</p>
                            </span>
                            <span class="playnow">Play Now</span>
                            <img src="img/play.svg" alt="playsong" class="invert">
                        </li>`
    }

    var audio = new Audio(songs[0]);

    audio.addEventListener("ontimeupdate", () => {
        let duration = audio.duration;
        console.log(duration);

    });

}

main()
