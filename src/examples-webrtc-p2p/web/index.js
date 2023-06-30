"use strict"
;(() => {
  const localVideo = document.getElementById("local-video")
  const remoteVideo = document.getElementById("remote-video")
  let localStream = null
  let peerConnection = null

  // ----- ws signaling handling ------

  const wsUrl = "wss://localhost:3010"
  const ws = new WebSocket(wsUrl)

  // function isOpen(ws) {
  //   return ws.readyState === ws.OPEN
  // }

  ws.onopen = (event) => {
    console.log(`ws open: ${event.target.url}`)
  }

  ws.onerror = (error) => {
    console.error("ws onerror() ERR:", error)
  }

  ws.onclose = (/* event */) => {
    console.log("ws close()")
  }

  ws.addEventListener("message", async (event) => {
    console.log("ws onmessage() data:", event.data)
  })
  ws.addEventListener("message", async (event) => {
    if (!(event.data instanceof Blob)) {
      return
    }

    const data = await event.data.text()
    const message = JSON.parse(data)
    if (message.type === "offer") {
      console.log("received offer...")
      const offer = new RTCSessionDescription(message)
      clearMessages()
      dumpReceiveSdp(offer)

      await setOffer(offer)
    }
  })
  ws.addEventListener("message", async (event) => {
    if (!(event.data instanceof Blob)) {
      return
    }

    const data = await event.data.text()
    const message = JSON.parse(data)
    if (message.type === "answer") {
      console.log("received answer...")
      const answer = new RTCSessionDescription(message)
      dumpReceiveSdp(answer)

      await setAnswer(answer)
    }
  })
  ws.addEventListener("message", async (event) => {
    if (!(event.data instanceof Blob)) {
      return
    }

    const data = await event.data.text()
    const message = JSON.parse(data)
    if (message.candidate) {
      console.log("received candidate...")
      const candidate = new RTCIceCandidate(message)
      dumpReceiveCandidate(candidate)

      await addIceCandidate(candidate)
    }
  })

  function sendSdp(sessionDescription) {
    console.log("ws sending:", sessionDescription)
    dumpSendSdp(sessionDescription)

    const message = JSON.stringify(sessionDescription)
    ws.send(message)
  }

  function sendIceCandidate(candidate) {
    console.log("ws sending:", candidate)
    dumpSendCandidate(candidate)

    const message = JSON.stringify(candidate)
    ws.send(message)
  }

  function dumpSendSdp(sessionDescription) {
    appendMessage(sessionDescription.sdp, `Send SDP ${sessionDescription.type} -----> `)
  }

  function dumpReceiveSdp(sessionDescription) {
    appendMessage(sessionDescription.sdp, `-----> Receive SDP ${sessionDescription.type}`)
  }

  function dumpSendCandidate(candidate) {
    appendMessage(candidate.candidate, `Send candidate -----> `)
  }

  function dumpReceiveCandidate(candidate) {
    appendMessage(candidate.candidate, `-----> Receive candidate`)
  }

  function appendMessage(value, labelText) {
    const container = document.getElementById("message-list")

    const label = document.createElement("label")
    label.innerText = labelText
    container?.appendChild(label)

    const sdpText = document.createElement("textarea")
    sdpText.value = value
    sdpText.className = "signaling-text"
    sdpText.focus()
    container?.appendChild(sdpText)
  }

  function clearMessages() {
    const container = document.getElementById("message-list")
    if (container) {
      container.innerHTML = ""
    }
  }

  // ----- peer connection handling -----

  function prepareNewConnection() {
    const config = { iceServers: [] }
    const peer = new RTCPeerConnection(config)

    if ("ontrack" in peer) {
      peer.ontrack = (event) => {
        console.log("-- peer.ontrack")
        const [stream] = event.streams
        playVideo(remoteVideo, stream)
      }
    } else {
      peer.onaddstream = (event) => {
        console.log("-- peer.onaddstream")
        const stream = event.stream
        playVideo(remoteVideo, stream)
      }
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("-- peer.onicecandidate", event)
        if (isVanillaICE()) {
          // For Vanilla ICE, do nothing.
        } else {
          // In the case of trickle ICE, send the ICE candidate.
          sendIceCandidate(event.candidate)
        }
      } else {
        console.log("-- peer.onicecandidate empty")
        if (isVanillaICE()) {
          // For Vanilla ICE, send SDP containing ICE candidates.
          sendSdp(peer.localDescription)
        } else {
          // For Trickle ICE, do nothing.
        }
      }
    }

    peer.onnegotiationneeded = (/* event */) => {
      console.log(`-- peer.onnegotiationneeded`)
    }

    peer.onicecandidateerror = (error) => {
      console.error(`ICE candidate ERROR: `, error)
    }

    peer.onsignalingstatechange = (/* event */) => {
      console.log(
        "== ",
        new Date().toISOString(),
        `== peer.onsignalingstatechange status=${peer.signalingState}`
      )
    }

    peer.oniceconnectionstatechange = (/* event */) => {
      console.log(
        "== ",
        new Date().toISOString(),
        `== peer.oniceconnectionstatechange states=${peer.iceConnectionState}`
      )
      if (peer.iceConnectionState === "disconnected") {
        console.log("-- disconnected")
        hangUp()
      }
    }

    peer.onicegatheringstatechange = (/* event */) => {
      console.log(
        "== ",
        new Date().toISOString(),
        `== peer.onicegatheringstatechange status=${peer.iceGatheringState}`
      )
    }

    peer.onconnectionstatechange = (/* event */) => {
      console.log(
        "== ",
        new Date().toISOString(),
        `== peer.onconnectionstatechange state=${peer.connectionState}`
      )
    }

    peer.onremovestream = (/* event */) => {
      console.log(new Date().toISOString(), `-- peer.onremovestream`)
      pauseVideo(remoteVideo)
    }

    // localStreamの追加.
    if (localStream) {
      console.log(`Adding local stream...`)
      peer.addStream(localStream)
    }

    return peer
  }

  async function makeOffer() {
    peerConnection = prepareNewConnection()

    try {
      const sessionDescription = await peerConnection.createOffer()
      console.log("-- createOffer() succsess in promise")

      await peerConnection.setLocalDescription(sessionDescription)
      console.log("-- setLocalDescription() succsess in promise")

      if (isVanillaICE()) {
        // For Vanilla ICE, do not send SDP yet.
      } else {
        // For Trickle ICE, send the initial SDP.
        sendSdp(peerConnection.localDescription)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function setOffer(sessionDescription) {
    if (peerConnection) {
      console.warn("peerConnection already exists!")
    }

    try {
      peerConnection = prepareNewConnection()
      await peerConnection.setRemoteDescription(sessionDescription)
      console.log("-- setRemoteDescription(offer) succsess in promise")

      await makeAnswer()
    } catch (error) {
      console.error("setRemoteDescription(offer) ERROR: ", error)
    }
  }

  async function makeAnswer() {
    if (!peerConnection) {
      console.error(`peerConnection NOT exists.`)
      return
    }

    try {
      const sessionDescription = await peerConnection.createAnswer()
      console.log("-- createAnswer() succsess in promise")

      await peerConnection.setLocalDescription(sessionDescription)
      console.log("setLocalDescription() succsess in promise")

      if (isVanillaICE()) {
        // For Vanilla ICE, do not send SDP yet.
      } else {
        // For Trickle ICE, send the initial SDP.
        sendSdp(peerConnection.localDescription)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function setAnswer(sessionDescription) {
    if (!peerConnection) {
      return
    }

    try {
      await peerConnection.setRemoteDescription(sessionDescription)
      console.log("setRemoteDescription(answer) succsess in promise")
    } catch (error) {
      console.error("setRemoteDescription(answer) ERROR: ", error)
    }
  }

  async function addIceCandidate(candidate) {
    if (!peerConnection) {
      console.remoteVideo(`peerConnection NOT exists.`)
      return
    }
    await peerConnection.addIceCandidate(candidate)
  }

  async function connect() {
    if (!localStream) {
      return
    }

    if (peerConnection) {
      console.warn("peerConnection already exists.")
      return
    }

    await makeOffer()
  }

  function hangUp() {
    if (!peerConnection) {
      return
    }

    pauseVideo(remoteVideo)

    peerConnection.close()
    peerConnection = null
  }

  // ----- media handling -----

  async function startLocalVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      localStream = stream
      playVideo(localVideo, stream)
    } catch (error) {
      console.error("mediaDevice.getUserMedia() error:", error)
    }
  }

  function stopLocalVideo() {
    if (localStream == null) {
      return
    }

    pauseVideo(localVideo)

    for (const track of localStream.getTracks()) {
      track.stop()
    }
    localStream = null
  }

  function playVideo(element, stream) {
    element.srcObject = stream
    element.onloadedmetadata = async (event) => {
      await element.play()
      console.log(`video playing...`, event)
    }
  }

  function pauseVideo(element) {
    element.pause()
    element.srcObject = null
  }

  function isVanillaICE() {
    return document.getElementById("ice-type-v")?.checked
  }

  // --- controls events

  document.getElementById("start-button")?.addEventListener("click", async (ev) => {
    await startLocalVideo()
    ev.preventDefault()
  })

  document.getElementById("stop-button")?.addEventListener("click", (ev) => {
    stopLocalVideo()
    ev.preventDefault()
  })

  document.getElementById("connect-button")?.addEventListener("click", async (ev) => {
    clearMessages()
    await connect()
    ev.preventDefault()
  })

  document.getElementById("hangup-button")?.addEventListener("click", (ev) => {
    hangUp()
    ev.preventDefault()
  })
})()
