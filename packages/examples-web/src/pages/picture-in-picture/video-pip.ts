export const content = `
  <article>
    <h2>Toggling picture-in-picture mode</h2>
    <p>In this example, we have a &lt;video&gt; element in a web page,
      a &lt;button&gt; to toggle picture-in-picture, and an element to log information
      relevant for the example.
    </p>
    <section class="mdn-example">
      <input type="file" id="video-pip-selector" accept="video/*">
    </section>
    <section>
      <video
        id="video-pip"
        muted
        controls
        loop
        width="300"></video>
    </section>
    <section>
      <button id="pip-button" disabled>Toggle Picture-in-Picture</button>
      <pre id="log-pip"></pre>
    </section>
  </article>
`

document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector<HTMLVideoElement>("#video-pip")
  const pipButton = document.querySelector<HTMLInputElement>("#pip-button")
  const log = document.getElementById("log-pip")

  function disabledPictureInPicture(enabled: boolean) {
    if (document.pictureInPictureEnabled) {
      return enabled
    } else {
      log!.innerText = "PiP not supported. Check browser compatibility for details."
      return true
    }
  }

  function togglePictureInPicture() {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture()
    } else {
      video!.requestPictureInPicture()
    }
  }

  pipButton!.addEventListener("click", function () {
    togglePictureInPicture()
  })

  const selector = document.querySelector<HTMLInputElement>("#video-pip-selector")
  selector!.addEventListener("change", function () {
    pipButton!.disabled = true
    video!.pause()
    if (video!.src) {
      URL.revokeObjectURL(video!.src)
      video!.src = ""
    }

    const file = this.files![0]
    if (!file) {
      return
    }

    const blob = new Blob([file], { type: file.type })
    video!.src = URL.createObjectURL(blob)
    video!.play()
    pipButton!.disabled = disabledPictureInPicture(false)
    console.log("playing...")
  })

  document.addEventListener("beforeunload", function () {
    video!.pause()
    if (video!.src) {
      URL.revokeObjectURL(video!.src)
      video!.src = ""
    }
  })
})
