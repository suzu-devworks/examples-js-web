export const content = `
  <article>
    <h2>Beep using AudioContext</h2>
    <p>Let's try playing a beep sound using AudioContext.</p>
    <section class="controls">
      <button id="play-beep" class="before-icon-button sound-sampler-button">Beep</button>
      <div class="control">
        <label for="beep-volume">Volume</label>
        <input type="range" id="beep-volume" min="0" max="2" value="1" step="0.01" />
        <output>1</output>
      </div>
      <div class="control">
        <label for="beep-frequency">Frequency</label>
        <input type="range" id="beep-frequency" min="261.6" max="523.3" value="440" step="0.1" />
        <output>440Hz</output>
      </div>
    </section>
  </article>
`

const playBeepSound = (params: { gain?: number; frequency?: number }) => {
  const context = new AudioContext()

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  // [oscillator] -> [gainNode] -> [destination]
  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.type = "square"
  oscillator.frequency.setValueAtTime(params.frequency ?? 440, context.currentTime) // value in hertz
  gainNode.gain.value = params.gain ?? 1

  oscillator.start()
  oscillator.stop(context.currentTime + 0.1)
}

document.addEventListener("DOMContentLoaded", function () {
  const playButton = document.querySelector<HTMLButtonElement>("#play-beep")

  const volumeControl = document.querySelector<HTMLInputElement>("#beep-volume")
  volumeControl?.addEventListener("input", function () {
    const output = this.nextElementSibling
    if (output) {
      output.textContent = `${this.value}`
    }
  })

  const frequencyControl = document.querySelector<HTMLInputElement>("#beep-frequency")
  frequencyControl!.addEventListener("input", function () {
    const output = this.nextElementSibling
    if (output) {
      output.textContent = `${this.value}Hz`
    }
  })

  playButton!.addEventListener("click", async function () {
    playBeepSound({
      gain: volumeControl?.value ? parseFloat(volumeControl.value) : undefined,
      frequency: frequencyControl?.value ? parseFloat(frequencyControl.value) : undefined,
    })
  })
})
