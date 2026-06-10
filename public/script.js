const socket = io(); 

let myvideostream;
const videoGrid = document.getElementById("video_container");
const myvideo = document.createElement("video");
// myvideo.muted = true;
const peers={};
const addvideostream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
}).then((stream) => {
  myvideostream = stream;
  addvideostream(myvideo, stream);
  
  
const myPeer = new Peer(undefined, {
  host: '/',
  port: 443,
  path: '/peerjs'
}); 

  myPeer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
  });
  socket.on('user-disconnected',(userId)=>{
    if (peers[userId]){ peers[userId].close()}
  })
  myPeer.on('call',(call)=>{
    call.answer(stream)
    const video=document.createElement('video');
    call.on('stream',(userVideoStream)=>{
      addvideostream(video,userVideoStream)
    })
  })
socket.on('user-connected', (userId) => {
  connectToNewUser(userId,stream,myPeer);
});



});










function connectToNewUser(userId,stream,myPeer) {
  const call=myPeer.call(userId,stream)
  const video=document.createElement('video')
  call.on('stream',(userVideoStream)=>{
    addvideostream(video,userVideoStream)
  })
call.on('close',()=>{
  video.remove()
});
peers[userId]=call;
  
}





const text=document.getElementById('chat_message');

window.addEventListener('keydown',(e)=>{


if(e.which==13 && text.value.length !== 0){
socket.emit('message',text.value);
text.value=''
}
})

socket.on('createMessage',(message)=>{
$('ul').append(`<li class="message"><b>user</b> <br> ${message}</li>`)
})

function PlayVideo(){
  const html= `<i class="fa-solid fa-video"></i>
  <span>Stop Video</span> `;
  document.querySelector('.main_video_button').innerHTML= html;

}
function stopVideo(){
  const html= `<i class="fa-solid fa-video-slash"></i>
  <span>Play Video </span> `;
document.querySelector('.main_video_button').innerHTML= html;
}
function setPlayVideo(){
  const enabled=myvideostream.getVideoTracks()[0].enabled;
if(enabled){
  stopVideo()
  myvideostream.getVideoTracks()[0].enabled=false;
 console.log(  myvideostream.getVideoTracks()[0])
}else{
 
  PlayVideo()
  myvideostream.getVideoTracks()[0].enabled=true;

}

}

function unmuteButton(){
  const html= `<i class="fa-solid fa-microphone-slash"></i>
  <span>UnMute </span> `;
document.querySelector('.main_mute_button').innerHTML= html;
}

function muteButton(){
  const html= `<i class="fa-solid fa-microphone"></i>
  <span> Mute </span> `;
document.querySelector('.main_mute_button').innerHTML= html;
}
function setMuteUnmute(){
  const enabled=myvideostream.getAudioTracks()[0].enabled;
if(enabled){
  unmuteButton()
  myvideostream.getAudioTracks()[0].enabled=false;

}else{
 
  muteButton()
  myvideostream.getAudioTracks()[0].enabled=true;

}

}
