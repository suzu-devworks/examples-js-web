import { AsyncFileReader } from "@/utils/async_file_reader"

export const content = `
  <article>
    <h2>Using the Web Audio API</h2>
    <p>Let's learn how to load audio tracks, play and pause them,
      and adjust the volume and stereo position using a simple boombox example
      that utilizes the MediaElementAudioSourceNode.</p>
    <section>
      <input id="audio-file-selector" type="file" accept="audio/*" />
      <audio id="audio-file" type="audio/mpeg"></audio>
    </section>
    <section class="controls">
      <button id="play-audio-file" data-playing="false" role="switch" aria-checked="false" disabled
        class="before-icon-button sound-sampler-button">
        <span>Play/Pause</span>
      </button>
      <button id="replay-audio-file" class="before-icon-button replay-button" disabled>Replay</button>
      <div class="control">
        <label>Volume</label>
        <input type="range" id="audio-file-volume" min="0" max="2" value="1" step="0.01" />
        <output>1</output>
      </div>
      <div class="control">
        <label>Pan</label>
        <input type="range" id="audio-file-panner" min="-1" max="1" value="0" step="0.01" />
        <output>0</output>
      </div>
    </section>
  </article>
`

document.addEventListener("DOMContentLoaded", function () {
  const audioContext = new AudioContext()

  // get the audio element
  const audioElement = document.querySelector<HTMLMediaElement>("#audio-file")

  // pass it into the audio context
  const track = audioContext.createMediaElementSource(audioElement!)

  // [audioElement] -> [destination]
  // track.connect(audioContext.destination)

  // [audioElement] -> [gainNode] -> [destination]
  const gainNode = audioContext.createGain()
  // track.connect(gainNode).connect(audioContext.destination)

  const pannerOptions = { pan: 0 }
  const pannerNode = new StereoPannerNode(audioContext, pannerOptions)
  // [audioElement] -> [gainNode] -> [pannerNode] -> [destination]
  track.connect(gainNode).connect(pannerNode).connect(audioContext.destination)

  // select our play button
  const playButton = document.querySelector<HTMLButtonElement>("#play-audio-file")
  playButton!.addEventListener(
    "click",
    async function () {
      // check if context is in suspended state (autoplay policy)
      if (audioContext.state === "suspended") {
        audioContext.resume()
      }

      // play or pause track depending on state
      if (this.dataset.playing === "false") {
        audioElement!.play()
        this.dataset.playing = "true"
      } else if (this.dataset.playing === "true") {
        audioElement!.pause()
        this.dataset.playing = "false"
      }
    },
    /* useCapture */ false
  )

  audioElement!.addEventListener(
    "ended",
    () => {
      playButton!.dataset.playing = "false"
    },
    false
  )

  const volumeControl = document.querySelector<HTMLInputElement>("#audio-file-volume")
  volumeControl?.addEventListener(
    "input",
    function () {
      gainNode.gain.value = parseFloat(this.value ?? "1")
      const output = this.nextElementSibling
      if (output) {
        output.textContent = `${this.value}`
      }
    },
    false
  )

  const pannerControl = document.querySelector<HTMLInputElement>("#audio-file-panner")
  pannerControl!.addEventListener(
    "input",
    function () {
      pannerNode.pan.value = parseInt(this.value ?? "0")
      const output = this.nextElementSibling
      if (output) {
        output.textContent = `${this.value}`
      }
    },
    false
  )

  const replayButton = document.querySelector<HTMLButtonElement>("#replay-audio-file")
  replayButton!.addEventListener(
    "click",
    function () {
      audioElement!.currentTime = 0
    },
    false
  )

  document.querySelector<HTMLInputElement>("#audio-file-selector")!.addEventListener(
    "change",
    async function () {
      playButton!.disabled = true
      replayButton!.disabled = true
      audioElement!.src = ""

      const file = this.files![0]

      if (file) {
        const url = await new AsyncFileReader().readAsDataURLAsync(file)
        audioElement!.src = url ?? ""
        playButton!.disabled = false
        replayButton!.disabled = false
      }
    },
    false
  )
})
