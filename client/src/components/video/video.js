import React from 'react';

class Video extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      localStream: null,
      onlineUsers: null,
      onlineUsersConnections: [],
    };

    this.videoRef = React.createRef();
    this.ControlVideo = this.ControlVideo.bind(this);
    this.gotLocalMediaStream = this.gotLocalMediaStream.bind(this);
  }

  componentDidMount () {
    const { socket } = this.props;

    socket.on('send offer', (offer) => {
      console.log(offer);
      const pc = new RTCPeerConnection(null);
      const sessionDescr = new RTCSessionDescription(offer);
      pc.setRemoteDescription(sessionDescr);


      socket.on('icecandidate', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log(candidate);
      });

      pc.createAnswer()
        .then((answer) => {
          return pc.setLocalDescription(answer);
        })
        .then(() => {
          socket.emit('answer', pc.localDescription);
        })

        pc.ontrack = (event) => {
          const video = this.videoRef.current;      
          video.srcObject = event.streams[0];
        };
    });


    socket.on('answer', (answer, calleeId) => {
      const { onlineUsersConnections, onlineUsers } = this.state;
      // console.log(answer);
      // console.log(onlineUsers);
      // console.log(onlineUsersConnections);
      const pcWithCallee = onlineUsersConnections.find((connection) => connection.id === calleeId); //returns id of callee
      // console.log(pcWithCallee);
      const remoteDescription = new RTCSessionDescription(answer);
      pcWithCallee.pc.setRemoteDescription(remoteDescription);
      
      // console.log(this.state.localStream);
    });


  }

  componentDidUpdate() {
    this.videoRef.current.srcObject = this.state.localStream;
  }

  gotLocalMediaStream(mediaStream) {
    const localVideo = this.videoRef.current;
    localVideo.srcObject = mediaStream;
    
    this.setState({localStream: mediaStream,});
    this.call();
  }

  // Creates local MediaStream
  startAction() {
    const mediaStreamConstraints = {
      video: true,
      audio: true,
    };

    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then(this.gotLocalMediaStream).catch((error)=>{console.log(error)});
    
  }

  call() {
    const { localStream } = this.state;
    const tracks = localStream.getTracks();
    const offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };
    
    /* create peer connection object for every online user, add tracks for them and create offers. */
    const onlineUsers = this.props.users;
    onlineUsers.forEach((user, index) => {
      const pc = new RTCPeerConnection(null);
      tracks.forEach(track => pc.addTrack(track, localStream));

      pc.onnegotiationneeded = () => {
        // console.log(1);
        pc.createOffer(offerOptions)
          .then((offer) => { return pc.setLocalDescription(offer)} )
          .then(() => { this.props.socket.emit('send offer', pc.localDescription, index); })
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) this.props.socket.emit('icecandidate', event.candidate);
      }

      const { onlineUsersConnections } = this.state;
      const newPc = {pc, id: user.id };

      this.setState({
        onlineUsers,
        onlineUsersConnections: [...onlineUsersConnections, newPc],
      });

    });
  }

  ControlVideo() {
    this.startAction();
  }
  
  render() {
    return (
      <div className="video-container">
        <video autoPlay ref={this.videoRef}></video>
        <button onClick={this.ControlVideo}>Stream</button>
      </div>
    )  
  }
}

export default Video;