export class Camera {
  #video
  #navigator
  #streaming
  #stream
  #captor

  constructor(video, navigator) {
    this.#video = video
    this.#navigator = navigator
    this.#streaming = false
    this.#stream = null
    this.#captor = null

    this.#initializeMediaDevices()
  }

  #initializeMediaDevices() {
    if (this.#navigator.mediaDevices === undefined) {
      this.#navigator.mediaDevices = {}
    }

    if (this.#navigator.mediaDevices.getUserMedia === undefined) {
      this.#navigator.mediaDevices.getUserMedia = (constraints) => {
        const getUserMediaLegacy = this.#navigator.webkitGetUserMedia || this.#navigator.mozGetUserMedia

        if (!getUserMediaLegacy) {
          return Promise.reject(new Error("getUserMedia is not implemented in this browser"))
        }

        return new Promise((resolve, reject) => getUserMediaLegacy.call(this.#navigator, constraints, resolve, reject))
      }
    }
  }

  #raiseAppliedConstraintsEvent(_preferences = null) {
    const supportedConstraints = this.#navigator.mediaDevices.getSupportedConstraints()
    const [track] = this.#stream?.getVideoTracks() ?? [null]
    const capabilities = track?.getCapabilities()
    const constraints = track?.getConstraints()
    const settings = track?.getSettings()

    const ev = new CustomEvent("appliedConstraints", {
      detail: {
        settings: settings,
        constraints: constraints,
        capabilities: capabilities,
        supportedConstraints: supportedConstraints,
      },
    })
    this.#video.dispatchEvent(ev)
  }

  get front() {
    const [track] = this.#stream?.getVideoTracks() ?? [null]
    const settings = track?.getSettings()
    const front = settings?.facingMode === "user"
    return front
  }

  async getDevices() {
    console.log("getDevices.")

    const devices = await this.#navigator.mediaDevices.enumerateDevices()
    return devices.filter((x) => "videoinput" === x.kind)
  }

  async open(parameters = null) {
    console.log("open.", parameters)

    const constraints = {
      audio: false,
      video: {},
      ...parameters,
    }

    this.#stream = await this.#navigator.mediaDevices.getUserMedia(constraints)

    this.#video.srcObject = this.#stream
    this.#video.onloadedmetadata = () => this.#video.play()
    this.#video.addEventListener("canplay", async () => {
      if (!this.#streaming) {
        this.#streaming = true
        this.#raiseAppliedConstraintsEvent()

        const [track] = this.#stream?.getVideoTracks() ?? [null]
        this.#captor = new ImageCapture(track)
      }
    })
  }

  close() {
    console.log("close.")

    this.#stream?.getTracks().forEach((track) => track.stop())
    this.#streaming = false
    this.#stream = null
    this.#captor = null
  }

  async applyConstraints(parameters) {
    console.log("applyConstraints.", parameters)

    const [track] = this.#stream?.getVideoTracks() ?? [null]

    // Item other then linked items appear to set
    // even if they are not merged with the previous set values.
    //const currrent = track?.getConstraints();

    const constants = { ...parameters }

    await track.applyConstraints(constants)

    this.#raiseAppliedConstraintsEvent()
  }

  async applyAdvancedConstraints(parameters) {
    console.log("applyAdvancedConstraints.", parameters)

    if (parameters.exposureTime) {
      parameters.exposureMode = "manual"
    }
    if (parameters.focusDistance) {
      parameters.focusMode = "manual"
    }
    if (parameters.colorTemperature) {
      parameters.whiteBalanceMode = "manual"
    }

    const constants = { advanced: [{ ...parameters }] }

    await this.applyConstraints(constants)
  }

  async switchDevices(parameters = null) {
    console.log("switchDevices.", parameters)

    if (!parameters) {
      const front = this.front
      const facingMode = front ? { exact: "environment" } : "user"
      parameters = { video: { facingMode: facingMode } }
    }

    this.close()
    await this.open(parameters)
  }

  async takePhoto(settings = null) {
    const blob = await this.#captor?.takePhoto(settings)
    console.log(`Photo taken ${blob?.type}, ${blob?.size}B `)
    return blob
  }
}
