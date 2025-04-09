let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMMSS(seconds) {
    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);
    // Calculate the number of seconds left over
    const remainingSeconds = Math.floor(seconds % 60);
    
    // Format minutes and seconds to be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong(folder){
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response= await a.text();
    console.log(response)

    let div= document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
      songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }


 
}
const playMusic = (track, pause=false)=>{
    // let audio= new Audio("/songs/"+track)
    currentSong.src=`/${currfolder}/`+track
    if (!pause) {
  currentSong.play()
   play.src="pause.svg"
}
 
  document.querySelector(".song-info") .innerHTML=decodeURI(track)
  document.querySelector(".song-time") .innerHTML="00:00 / 00:00"
}
async function main(){

   
 //get the list of song
await getsong("songs/cs")

playMusic(songs[0],true)


    // show all the song in playlist
    let songul=document.querySelector(".song-list").getElementsByTagName("ul")[0]



    for (const song of songs) {
        songul.innerHTML= songul.innerHTML + ` <li> <img class="invert" src="music.svg" alt=""> <div class="info"><div>${song.replaceAll("%20"," ")}</div><div>suman</div>
        </div><img class="invert" src="play.svg" alt="">  </li>`;
    }
    
    
    
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((e)=>{
        e.addEventListener("click",(event)=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
       
    })


//attouch an event listner to playbuttons

  
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="pause.svg"
    }
    else{
        currentSong.pause()
        play.src="play.svg"
    }
})
// listen for time update event 
currentSong.addEventListener("timeupdate",()=>{
    // console.log(currentSong.currentTime,currentSong.duration)

    document.querySelector(".song-time").innerHTML=`${secondsToMMSS(currentSong.currentTime)} / ${secondsToMMSS(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/ currentSong.duration)*100 +"%"
})
//add evntlistner to seekbar

document.querySelector(".seek-bar").addEventListener("click", e=>{
   document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100 + "%"  
 
  currentSong.currentTime=((e.offsetX/e.target.getBoundingClientRect().width)*currentSong.duration)
})

//add event listner on hamburger icon
document.querySelector(".hamburg").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
})

// adding eventlistner to the cross to close the left bar
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
})

// add an event listner to  previous and next
previous.addEventListener("click",()=>{
    let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
        playMusic(songs[index-1])
    }
  
})


next.addEventListener("click",()=>{
    let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1)< songs.length-1){
        playMusic(songs[index+1])
    }
})

// add event to volume range

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
 currentSong.volume=parseInt(e.target.value)/100
})

//load the playlist when the card is clicked
 Array.from(document.getElementsByClassName("card")).forEach((item)=>{
 item.addEventListener("click", async (e)=>{
    songs=await getsong(`songs/${e.currentTarget.dataset.folder}`)
 })
 })


}

main()

