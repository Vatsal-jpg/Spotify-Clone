/*
let currentSong= new Audio()
let songs;
let currFolder

function formatSeconds(seconds) {
    // Ensure the input is an integer
    seconds = Math.floor(seconds);

    // Calculate the minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Combine minutes and seconds into the desired format
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    console.log(`Fetching songs from folder: ${folder}`);
    currFolder=folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML=response
    let as= div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=" "
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+ `<li> <img  class="invert" src="Images/music.svg" alt="">
                         <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Vatsal</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="Images/play.svg" alt="">
                        </div></li>`
    }

    //Attach an event listner to each song
   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
   })

}
const playMusic = (track,pause=false)=>{
    currentSong.src=`/${currFolder}/`+ track
    if(!pause){
        currentSong.play()
       play.src="Images/pause.svg"
    }
   document.querySelector(".songinfo").innerHTML=decodeURI(track)
   document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let songs = document.querySelector(".songs")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            songs.innerHTML = songs.innerHTML + `  <div class="playSongs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                                <circle cx="25" cy="25" r="23" fill="#1fdf64" />
                                <polygon points="21,16 34,25 21,34" fill="black" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>`
        }
    }

    //Load the playlist whenever the card is clicked
Array.from(document.getElementsByClassName("songs")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    })
})



}

async function main(){
   await getSongs("songs/all")
    playMusic(songs[0],true)
    console.log(songs)

   

   //Attach an event listner to play,next and previous
   play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
    play.src = "Images/pause.svg"
    }
    else{
        currentSong.pause()
        play.src="Images/play.svg"
    }
   })

   //Listen for Time Update event
   currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML=`${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left=(currentSong.currentTime/ currentSong.duration)*100+"%";
   })

   //Add an event listner to seekbar
   document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left= percent+"%";
    currentSong.currentTime=((currentSong.duration)*percent)/100
   })

//Add event listner for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".leftbox").style.left="0"
})

//Add event listner for hamburger
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".leftbox").style.left="-100%"
})

// Add an event listener to previous
previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})

// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100
})

//Add event listner to music track
document.querySelector(".volume>img").addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg")
        currentSong.volume=0
        document.querySelector(".range").getElementsByTagName("input")[0].value=0
    }
    else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg")
        currentSong.volume=0.1
        document.querySelector(".range").getElementsByTagName("input")[0].value=10
    }
})
// Add an event to volume range input
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
    const volumeValue = parseInt(e.target.value);
    // currentSong.volume = volumeValue / 100;

    const volumeIcon = document.querySelector(".volume>img");
    if (volumeValue === 0) {
        volumeIcon.src = "Images/mute.svg";
    } else {
        volumeIcon.src = "Images/volume.svg";
    }
})


}

main()
*/
let currentSong = new Audio();
let songs = [];
let currFolder = '';

function formatSeconds(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    console.log(`Fetching songs from folder: ${folder}`);
    currFolder = folder;
    let response = await fetch(`/${folder}/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li> <img class="invert" src="Images/music.svg" alt="">
                         <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Artist</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert" src="Images/play.svg" alt="">
                        </div></li>`;
    }

    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "Images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    let response = await fetch(`/songs/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a");
    let albumContainer = document.querySelector(".albumfolder");
    let array = Array.from(anchors);
    albumContainer.innerHTML = ''; // Clear previous content
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];
            let infoResponse = await fetch(`/songs/${folder}/info.json`);
            let folderInfo = await infoResponse.json();
            albumContainer.innerHTML += `<div data-folder="${folder}" class="songs">
                            <div class="playSongs">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                                    <circle cx="25" cy="25" r="23" fill="#1fdf64" />
                                    <polygon points="21,16 34,25 21,34" fill="black" />
                                </svg>
                            </div>
                            <img src="/songs/${folder}/cover.jpg" alt="">
                            <h2>${folderInfo.title}</h2>
                            <p>${folderInfo.description}</p>
                        </div>`;
        }
    }

    Array.from(document.querySelectorAll(".albumfolder .songs")).forEach(e => {
        e.addEventListener("click", async item => {
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        });
    });
}

async function main() {
    await getSongs("songs/all");
    playMusic(songs[0], true);
    console.log(songs);

    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "Images/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "Images/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".leftbox").style.left = "-100%";
    });

    document.getElementById("previous").addEventListener("click", () => {
        currentSong.pause();
        console.log("Previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        currentSong.pause();
        console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    document.querySelector(".volume > img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });

    document.querySelector(".range input").addEventListener("input", (e) => {
        const volumeValue = parseInt(e.target.value);
        const volumeIcon = document.querySelector(".volume > img");
        if (volumeValue === 0) {
            volumeIcon.src = "Images/mute.svg";
        } else {
            volumeIcon.src = "Images/volume.svg";
        }
    });

    displayAlbums(); // Load album folders dynamically
}

main();
