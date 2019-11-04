import React from 'react';
import './video.css';

class Video extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      localStream: null,
      onlineUsers: null,
      onlineUsersConnections: [],
      isStreaming: false,
      isOtherPeerStreaming: false,
    };

    this.videoRef = React.createRef();
    this.ControlVideo = this.ControlVideo.bind(this);
    this.gotLocalMediaStream = this.gotLocalMediaStream.bind(this);
  }

  componentDidMount () {
    const { socket } = this.props;

    socket.on('send offer', (offer) => {
      this.setState({isOtherPeerStreaming: true});

      const pc = new RTCPeerConnection(null);
      const sessionDescr = new RTCSessionDescription(offer);
      pc.setRemoteDescription(sessionDescr);

      socket.on('icecandidate', (candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      pc.createAnswer()
        .then((answer) => { return pc.setLocalDescription(answer) })
        .then(() => { socket.emit('answer', pc.localDescription) });

      pc.ontrack = (event) => {
        const video = this.videoRef.current;
        if (video.srcObject) return;
        video.srcObject = event.streams[0];
        this.setState({localStream: event.streams[0]});
      };
    });

    socket.on('answer', (answer, calleeId) => {
      const { onlineUsersConnections } = this.state;
      const pcWithCallee = onlineUsersConnections.find((connection) => connection.id === calleeId); //returns connection with callee
      const remoteDescription = new RTCSessionDescription(answer);
      pcWithCallee.pc.setRemoteDescription(remoteDescription);
    });

    socket.on('stop streaming', () => {
      this.setState({
        localStream: null,
        isStreaming: false,
        isOtherPeerStreaming: false,
      });
      const video = this.videoRef.current;      
      video.srcObject = null;
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.localStream === prevState.localStream) return;
    const video = this.videoRef.current;
    if (video) video.srcObject = this.state.localStream;
  }

  gotLocalMediaStream(mediaStream) {
    this.setState({localStream: mediaStream,});
    this.call(mediaStream);
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

  call(mediaStream) {
    const { socket } = this.props;
    const tracks = mediaStream.getTracks();
    const offerOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    };
    
    /* create peer connection object for every online user, add tracks for them and create offers. */
    const onlineUsers = this.props.users;
    onlineUsers.forEach((user, index) => {
      const pc = new RTCPeerConnection(null);
      tracks.forEach(track => pc.addTrack(track, mediaStream));

      pc.onnegotiationneeded = () => {
        pc.createOffer(offerOptions)
          .then((offer) => { return pc.setLocalDescription(offer)} )
          .then(() => { socket.emit('send offer', pc.localDescription, index); })
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit('icecandidate', event.candidate);
      }

      const { onlineUsersConnections } = this.state;
      const newPc = {pc, id: user.id };

      this.setState({
        onlineUsers,
        onlineUsersConnections: [...onlineUsersConnections, newPc],
      });

    });
  }

  stopAction() {
    const { localStream } = this.state;

    if (!localStream) return;

    const trackList = localStream.getTracks();
    trackList.forEach(track => track.stop());
    
    this.setState({
      localStream: null,
      onlineUsersConnections: [],
      isOtherPeerStreaming: false,
    });
    
    this.props.socket.emit('stop streaming');
  }

  ControlVideo() {
    const { isStreaming } = this.state;
    this.setState({isStreaming: !isStreaming});    

    !isStreaming ?  this.startAction() : this.stopAction();
  }
  
  render() {
    const { isStreaming } = this.state;
    const buttonText = isStreaming ? 'Stop' : 'Stream';
    return (
      <div className="video-container">
        <button
          className="button"
          onClick={this.ControlVideo}
          disabled={this.state.isOtherPeerStreaming}
        >
          {buttonText}
        </button>
        <video className="video" autoPlay ref={this.videoRef}></video>
      </div>
    )  
  }
}

export default Video;