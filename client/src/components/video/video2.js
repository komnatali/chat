import React from 'react';

class Video extends React.Component {
  constructor(props) {
    super(props);
    // this.localStream = null;    
    this.state = {
      localStream: null,
      onlineUsers: null,
    };

    this.videoRef = React.createRef();
    this.ControlVideo = this.ControlVideo.bind(this);
    this.gotLocalMediaStream = this.gotLocalMediaStream.bind(this);
  }

  componentDidUpdate () {
    const { socket } = this.props;
    if (!socket) return;

    socket.on('send offer', (offer) => {
      // console.log(offer);
      const pc = new RTCPeerConnection(null);
      const sessionDescr = new RTCSessionDescription(offer);
      pc.setRemoteDescription(sessionDescr);


      socket.on('icecandidate', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      });
      
      // console.log(1);
      // console.log(pc);

      pc.createAnswer()
        .then((answer) => {
          // console.log(1);
          // console.log(answer);
          return pc.setLocalDescription(answer);
          // socket.emit('answer', answer);
          // console.log(pcsetlocdescr);
          // return pcsetlocdescr;
        })
        .then(() => {
          // console.log(2);
          // console.log(pc.localDescription);
          socket.emit('answer', pc.localDescription);
        })
        // .then(function() {
        //   console.log(2);
        //   console.log(answer);
        //   socket.emit('answer', answer);
        // });
        // console.log(this.videoRef);

        pc.ontrack = (event) => {    
          // console.log(111111111111);
          console.log(2222);
          // console.log(this.state.localStream);
          // console.log(event.streams[0] === this.state.localStream);
          const video = this.videoRef.current;
          console.log(video);
          console.log(video.srcObject);
        
          // this.setState({localStream: event.streams[0],});
          video.srcObject = event.streams[0];
        };
    });


    socket.on('answer', (answer) => {
      // const { onlineUsers } = this.state;
      console.log('YA POLUCHIL OTVET');
      // const remoteDescription = new RTCSessionDescription(answer);
      // pc.setRemoteDescription(remoteDescription);
    });


  }

  // componentDidUpdate() {
  //   this.videoRef.current.srcObject = this.state.localStream;
  // }

  gotLocalMediaStream(mediaStream) {
    const localVideo = this.videoRef.current;
    localVideo.srcObject = mediaStream;
    // this.localStream = mediaStream;
    
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
    
    /* create peer connection object with every online user, add tracks for them and create offers. */
    const onlineUsers = this.props.users;
    onlineUsers.forEach((user, index) => {
      const pc = new RTCPeerConnection(null);
      tracks.forEach(track => pc.addTrack(track, localStream));

      pc.onnegotiationneeded = () => {
        pc.createOffer(offerOptions)
          .then((offer) => { return pc.setLocalDescription(offer)} )
          .then(() => { this.props.socket.emit('send offer', pc.localDescription, index); })
            
          //   pc.setLocalDescription(offer);
          //   this.props.socket.emit('send offer', offer, index);
          // });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) this.props.socket.emit('icecandidate', event.candidate);
      }

      this.setState({onlineUsers,});

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