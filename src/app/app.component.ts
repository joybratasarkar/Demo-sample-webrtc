import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  startButton: HTMLButtonElement | any;
  callButton: HTMLButtonElement | any;
  hangupButton: HTMLButtonElement | any;
  startTime: number | any;
  localVideo: HTMLVideoElement | any;
  remoteVideo: HTMLVideoElement | any;
  localStream: MediaStream | any;
  pc1: RTCPeerConnection | any;
  pc2: RTCPeerConnection | any;
  offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };

  ngOnInit() {
    this.startButton = document.getElementById('startButton') as HTMLButtonElement;
    this.callButton = document.getElementById('callButton') as HTMLButtonElement;
    this.hangupButton = document.getElementById('hangupButton') as HTMLButtonElement;
    this.callButton.disabled = true;
    this.hangupButton.disabled = true;
    this.startButton.addEventListener('click', () => this.start());
    this.callButton.addEventListener('click', () => this.call());
    this.hangupButton.addEventListener('click', () => this.hangup());

    this.localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    this.remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;

    this.localVideo.addEventListener('loadedmetadata', () => {
      console.log(`Local video videoWidth: ${this.localVideo.videoWidth}px,  videoHeight: ${this.localVideo.videoHeight}px`);
    });

    this.remoteVideo.addEventListener('loadedmetadata', () => {
      console.log(`Remote video videoWidth: ${this.remoteVideo.videoWidth}px,  videoHeight: ${this.remoteVideo.videoHeight}px`);
    });

    this.remoteVideo.addEventListener('resize', () => {
      console.log(`Remote video size changed to ${this.remoteVideo.videoWidth}x${this.remoteVideo.videoHeight} - Time since pageload ${performance.now().toFixed(0)}ms`);
      if (this.startTime) {
        const elapsedTime = window.performance.now() - this.startTime;
        console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
        this.startTime = null;
      }
    });
  }

  async start() {
    console.log('Requesting local stream');
    this.startButton.disabled = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      console.log('Received local stream');
      this.localVideo.srcObject = stream;
      this.localStream = stream;
      this.callButton.disabled = false;
    } catch (e :any) {
      alert(`getUserMedia() error: ${e.name}`);
    }
  }

  async call() {
    this.callButton.disabled = true;
    this.hangupButton.disabled = false;
    console.log('Starting call');
    this.startTime = window.performance.now();
    const videoTracks = this.localStream.getVideoTracks();
    const audioTracks = this.localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const configuration = {};
    console.log('RTCPeerConnection configuration:', configuration);
    this.pc1 = new RTCPeerConnection(configuration);
    console.log('Created local peer connection object pc1');
    this.pc1.addEventListener('icecandidate', (e:any) => this.onIceCandidate(this.pc1, e));
    debugger;
    this.pc2 = new RTCPeerConnection(configuration);
    console.log('Created remote peer connection object pc2');
    debugger;
    this.pc2.addEventListener('icecandidate', (e:any) => this.onIceCandidate(this.pc2, e));
    this.pc1.addEventListener('iceconnectionstatechange', (e:any) => this.onIceStateChange(this.pc1, e));
    this.pc2.addEventListener('iceconnectionstatechange', (e:any) => this.onIceStateChange(this.pc2, e));
    this.pc2.addEventListener('track', (e:any) => this.gotRemoteStream(e));
  this.pc1
  this.pc2
    debugger;
    this.localStream.getTracks().forEach((track:any) => this.pc1.addTrack(track, this.localStream));
    console.log('Added local stream to pc1');

    try {
      console.log('pc1 createOffer start');
      const offer = await this.pc1.createOffer(this.offerOptions);
      await this.onCreateOfferSuccess(offer);

      debugger;
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  }

  onCreateSessionDescriptionError(error :any) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

  async onCreateOfferSuccess(desc :any) {
    console.log(`Offer from pc1\n${desc.sdp}`);
    console.log('pc1 setLocalDescription start');
    try {
      await this.pc1.setLocalDescription(desc);
      debugger;
      this.onSetLocalSuccess(this.pc1);

      debugger;
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    console.log('pc2 setRemoteDescription start');
    try {
      await this.pc2.setRemoteDescription(desc);
      debugger;
      this.onSetRemoteSuccess(this.pc2);

      debugger;
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }

    console.log('pc2 createAnswer start');
    try {
      const answer = await this.pc2.createAnswer();
      await this.onCreateAnswerSuccess(answer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  }

  onSetLocalSuccess(pc:any) {
    console.log(`${this.getName(pc)} setLocalDescription complete`);
  }

  onSetRemoteSuccess(pc:any) {
    console.log(`${this.getName(pc)} setRemoteDescription complete`);
  }

  onSetSessionDescriptionError(error :any) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }

  gotRemoteStream(e:any) {
    if (this.remoteVideo.srcObject !== e.streams[0]) {
      this.pc1
      this.pc2
      debugger;
      this.remoteVideo.srcObject = e.streams[0];
      debugger;
      console.log('pc2 received remote stream');
    }
  }

  async onCreateAnswerSuccess(desc :any) {
    console.log(`Answer from pc2:\n${desc.sdp}`);
    console.log('pc2 setLocalDescription start');
    try {
      await this.pc2.setLocalDescription(desc);
      this.pc1
      this.pc2
      debugger;
      this.onSetLocalSuccess(this.pc2);
      debugger;
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
    console.log('pc1 setRemoteDescription start');
    try {
      await this.pc1.setRemoteDescription(desc);
      this.pc1
      this.pc2
      debugger;
      this.onSetRemoteSuccess(this.pc1);
      debugger;
      
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
  }

  async onIceCandidate(pc:any, event:any) {
    try {
      await (this.getOtherPc(pc).addIceCandidate(event.candidate));
      this.onAddIceCandidateSuccess(pc);
    } catch (e) {
      this.onAddIceCandidateError(pc, e);
    }
    console.log(`${this.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  }

  onAddIceCandidateSuccess(pc:any) {
    console.log(`${this.getName(pc)} addIceCandidate success`);
  }

  onAddIceCandidateError(pc :any, error :any) {
    console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
  }

  onIceStateChange(pc:any, event:any) {
    if (pc) {
      console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
  }

  hangup() {
    console.log('Ending call');
    this.pc1.close();
    this.pc2.close();
    this.pc1 = null;
    this.pc2 = null;
    this.hangupButton.disabled = true;
    this.callButton.disabled = false;
  }

  getName(pc:any) {
    return pc === this.pc1 ? 'pc1' : 'pc2';
  }

  getOtherPc(pc:any) {
    return pc === this.pc1 ? this.pc2 : this.pc1;
  }
}
