const play =document.querySelector(".play"),
previous =document.querySelector(".prev"),
next =document.querySelector(".next"),
//
trackImg =document.querySelector(".track-img"),
title =document.querySelector(".title"),
artist =document.querySelector(".artist"),
//
currentVolume=document.querySelector("#volume"),
showVolume=document.querySelector("#show-volume"),
volumeIcon=document.querySelector("#volume-icon"),
slider=document.querySelector(".duration-slider"),
//
autoPlayBtn=document.querySelector(".play-all"),
trackCurrentTime=document.querySelector(".current-time"),
trackduration=document.querySelector(".duration-time"),
//
hamburger=document.querySelector(".fa-bars"),
closeIcon=document.querySelector(".fa-times"),
//
musicPlaylist=document.querySelector(".music-playlist"),
playlist=document.querySelector(".playlist");
//
pDiv = document.querySelector(".playlist-div");
playList = document.querySelector(".playlist");

let timer;
let autoplay =0;
let indexTrack =0;
let songIsPlaying = false;
let track = document.createElement("audio");

// Event list
play.addEventListener("click",justplay);
next.addEventListener("click",nextsong);
previous.addEventListener("click",prevSong);
autoPlayBtn.addEventListener("click",autoplayToggle);
volumeIcon.addEventListener("click",muteSound);
currentVolume.addEventListener("change",changeVolume);
slider.addEventListener("change",changeDuration);
track.addEventListener("timeupdate",songTimeUpdate);
hamburger.addEventListener("click",showPlaylist);
closeIcon.addEventListener("click",hidePlaylist);

//Track
function loadTrack(indexTrack){
   clearInterval(timer);
   resetSlider ();
  track.src = tracklist[indexTrack].path;
  trackImg.src = tracklist[indexTrack].img;
  title.innerHTML = tracklist[indexTrack].name;
  artist.innerHTML = tracklist[indexTrack].singer;

  track.load();

  timer=setInterval(updateSlider,1000);
}
loadTrack(indexTrack);

//play or pause
function justplay(){
    if (songIsPlaying == false){
        playSong();
    } else{
        pauseSong();
    }
}

//playlist song//
function playSong() {
    track.play();
    songIsPlaying = true;
    play.innerHTML = '<i class="fas fa-pause"></i>';
}
//playlist song//
function pauseSong() {
    track.pause();
    songIsPlaying = false;
    play.innerHTML = '<i class="fas fa-play"></i>';
}
//next
function nextsong(){
    if(indexTrack < tracklist.length - 1 ){
        indexTrack ++;
        loadTrack(indexTrack);
        playSong()
    }
    else{
       indexTrack =0;
       loadTrack(indexTrack);
       playSong();
}
}
function prevSong(){
    if(indexTrack>0 ){
        indexTrack --;
        loadTrack(indexTrack);
        playSong()
    }
    else{
       indexTrack =tracklist.length-1;
       loadTrack(indexTrack);
       playSong();
}
}

function autoplayToggle (){
    if(autoplay==0){
        autoplay = 1;
        autoPlayBtn.style.background = "palevioletred";
    }
    else{
        autoplay = 0;
        autoPlayBtn.style.background = "white";
    }
}
//Mute  muteSound
function muteSound(){
    track.volume=0;
    showVolume.innerHTML=0;
    currentVolume.value=0;
}
function changeVolume(){
    showVolume.value= currentVolume.value;
    track.volume=currentVolume.value/100;

}
//duration
function changeDuration(){
    let sliderPosition = track.duration * (slider.value / 100);
    track.currentTime = sliderPosition;
}
//reset slider
function resetSlider(){
    slider.value =0;
}
//Update slider
function updateSlider(){
    let position =0;
    if(!isNaN(track.duration)){
        position= track.currentTime *(100 / track.duration);
        slider.value = position;
    }
   
    
    if (track.ended) {
        play.innerHTML = '<i class="fas fa-play"></i>';
        if (autoplay == 1 && indexTrack < tracklist.length - 1) {
          indexTrack++;
          loadTrack(indexTrack);
          playSong();
        } else if (autoplay == 1 && indexTrack == tracklist.length - 1) {
          indexTrack = 0;
          loadTrack(indexTrack);
          playSong();
        }
      }
}
///Update current song time
function songTimeUpdate(){
    if (track.duration){
    let curmins = Math.floor(track.currentTime/60);
    let cursecs = Math.floor(track.currentTime - curmins *60);
    let durmins = Math.floor(track.duration/60);
    let dursecs = Math.floor(track.duration - durmins *60);

    if(dursecs < 10){
        dursecs ="0" +dursecs;
    } 
    if(durmins < 10){
        durmins ="0" +durmins;
    }
    if(curmins< 10){
        curmins ="0" +curmins;
    }
    if(cursecs<10){
        cursecs ="0"+ cursecs;
    }
    trackCurrentTime.innerHTML =  curmins + ":" + cursecs;
    trackduration.innerHTML =  durmins + ":" + dursecs;
    }
    else{
        trackCurrentTime.innerHTML = " 00" + ":" + "00";
    trackduration.innerHTML =  "00"+ ":" + "00";
    }
}
// Show PlayList
function showPlaylist() {
    musicPlaylist.style.transform = "translateX(0)";
  }
  // Hide PlayList
  function hidePlaylist() {
    musicPlaylist.style.transform = "translateX(-100%)";
  }

/// display track in playlist
let counter = 1;
function displayTracks(){
    for ( let i =0; i < tracklist.length; i++){
        console.log(tracklist[i].name);
        let div = document.createElement("div");
        div.classList.add("playlist");
        div.innerHTML = `<span class="song-index"> ${counter++} </span>
         <p class="single-song">${tracklist[i].name}</p>`;
         pDiv.appendChild(div);
    }
    playFromPlaylist();
}
displayTracks();
// Play song from playlist
function playFromPlaylist(){
    pDiv.addEventListener("click",(e) => {
        if(e.target.classList.contains("single-song")){
           const indexNum = tracklist.findIndex((item , index) => {
            if(item.name === e.target.innerHTML){
                return true;
            }
        });
        loadTrack(indexNum);
        playSong();
        hidePlaylist();
      }
    });
  }