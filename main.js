let localStream;
let remoteStream;
let peerConnection;

//creating a 3rd party stunt server
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  document.getElementById("user-1").srcObject = localStream;
  createoffer();
};

//creating a sdp offer
let createoffer = async () => {
  //creating a connection with the local to the remote
  peerConnection = new RTCPeerConnection(servers);

  //creates a blank stream .this mediaStream contains remote video and audio of the user
  remoteStream = new MediaStream();

  document.getElementById("user-2").srcObject = remoteStream;

  //adding the local camera and audio tracks to the peer connection
  localStream.getTracks().forEach((tracks) => {
    peerConnection.addTrack(tracks, localStream);
  });

  //adding the remote camer and audio track to the peer connection
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks.forEach((tracks) => {
      remoteStream.addTrack(tracks);
    });
  };

  //ice candidate
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      console.log();
    }
  };

  //this createOffer is used to create a local SDP (session description protocol)
  let offer = await peerConnection.createOffer();

  //this setLocal Description is used to set the localDescription
  await peerConnection.setLocalDescription(offer);
  console.log(offer);
};

init();
