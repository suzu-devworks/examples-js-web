export const content = `
  <article>
    <h2>Visualizations with Web Audio API</h2>
    <p>Let's learn how to extract frequency, waveform, and other data from an audio source,
      and then use that data to create visualizations.</p>
    <section>
      <canvas id="visualizer" width="640" height="100"></canvas>
    </section>
    <section class="controls">
      <button id="mute-visualizer" data-mute="false" class="before-icon-button mute-button" disabled>Mute</button>
      <div class="control">
        <label for="visual-visualizer">Visualizer setting</label>
        <select id="visual-visualizer" name="visual">
          <option value="sinewave">Sinewave</option>
          <option value="frequencybars" selected>Frequency bars</option>
          <option value="off">Off</option>
        </select>
      </div>
    </section>
  </article>
`
// spell-checker: words Sinewave frequencybars

document.addEventListener("DOMContentLoaded", function () {
  const audioCtx = new AudioContext()

  // Set up the different audio nodes we will use for the app
  const analyser = audioCtx.createAnalyser()
  analyser.minDecibels = -90 // The minimum power value in the scaling range for the FFT analysis data.
  analyser.maxDecibels = -10 // The maximum power value in the scaling range for the FFT analysis data.
  analyser.smoothingTimeConstant = 0.85 // The averaging constant with the last analysis frame.

  const distortion = audioCtx.createWaveShaper()
  // const biquadFilter = audioCtx.createBiquadFilter()
  const gainNode = audioCtx.createGain()
  // const convolver = audioCtx.createConvolver()

  // const echoDelay = createEchoDelayEffect(audioCtx)

  // Set up canvas context for visualizer
  const canvas = document.querySelector<HTMLCanvasElement>("#visualizer")
  const canvasCtx = canvas!.getContext("2d")
  let drawVisual: number

  const visualSelect = document.querySelector<HTMLSelectElement>("#visual-visualizer")
  const visualize = async () => {
    if (!canvas || !canvasCtx) {
      return
    }
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    const visualSetting = visualSelect!.value
    console.log(visualSetting)

    if (visualSetting === "sinewave") {
      analyser.fftSize = 2048
      const bufferLength = analyser.fftSize
      console.log(bufferLength)

      // We can use Float32Array instead of Uint8Array if we want higher precision
      // const dataArray = new Float32Array(bufferLength);
      const dataArray = new Uint8Array(bufferLength)

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      const draw = () => {
        drawVisual = requestAnimationFrame(draw)

        // analyser.getFloatTimeDomainData(dataArray)
        analyser.getByteTimeDomainData(dataArray)

        canvasCtx.fillStyle = "rgb(200, 200, 200)"
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = "rgb(0, 0, 0)"

        canvasCtx.beginPath()

        const sliceWidth = (WIDTH * 1.0) / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0
          const y = (v * HEIGHT) / 2

          if (i === 0) {
            canvasCtx.moveTo(x, y)
          } else {
            canvasCtx.lineTo(x, y)
          }

          x += sliceWidth
        }

        canvasCtx.lineTo(WIDTH, HEIGHT / 2)
        canvasCtx.stroke()
      }

      draw()
    } else if (visualSetting == "frequencybars") {
      analyser.fftSize = 256
      const bufferLengthAlt = analyser.frequencyBinCount
      console.log(bufferLengthAlt)

      // See comment above for Float32Array()
      const dataArrayAlt = new Uint8Array(bufferLengthAlt)

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      const drawAlt = () => {
        drawVisual = requestAnimationFrame(drawAlt)

        // analyser.getFloatFrequencyData(dataArrayAlt)
        analyser.getByteFrequencyData(dataArrayAlt)

        canvasCtx.fillStyle = "rgb(0, 0, 0)"
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

        const barWidth = (WIDTH / bufferLengthAlt) * 2.5
        let x = 0

        for (let i = 0; i < bufferLengthAlt; i++) {
          const barHeight = dataArrayAlt[i]

          canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)"
          canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

          x += barWidth + 1
        }
      }

      drawAlt()
    } else if (visualSetting == "off") {
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
      canvasCtx.fillStyle = "red"
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
    }
  }
  visualSelect!.addEventListener("change", () => {
    cancelAnimationFrame(drawVisual)
    visualize()
  })

  const muteButton = document.querySelector<HTMLButtonElement>("#mute-visualizer")
  muteButton!.addEventListener("click", function () {
    if (this.dataset.mute === "false") {
      gainNode.gain.value = 0
      this.dataset.mute = "true"
    } else {
      gainNode.gain.value = 1
      this.dataset.mute = "false"
    }
  })

  // Main block for doing the audio recording
  const constraints = { audio: true }
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(distortion)
      distortion.connect(gainNode)
      gainNode.connect(analyser)
      analyser.connect(audioCtx.destination)

      visualize()
      muteButton!.disabled = false
    })
    .catch(function (err) {
      console.error("The following gUM error occurred: " + err)
    })
})
