// see also
// https://developer.chrome.com/docs/web-platform/document-picture-in-picture?hl=ja#css_picture-in-picture_display_mode

export const content = `
  <article>
    <h2>Use Document Picture-in-Picture API</h2>
    <p>The Document Picture-in-Picture API makes it possible to open an always-on-top window
      that can be populated with arbitrary HTML content.</p>
    <section>
      <div id="player-container-doc-pip">
        <div id="player-doc-pip" class="player">
          <video id="video-doc-pip" wide="300"></video>
          <div>
            <output id="output-doc-pip"></output>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div>
        <button id="doc-pip-button">Open Picture-in-Picture window</button>
        <button id="close-doc-pip-button" disabled>Close window</button>
      </div>
      <pre id="log-doc-pip"></pre>
    </section>
  </article>
`

const copyStyleSheets = (dist: Document, source: Document) => {
  // Copy style sheets over from the initial document
  // so that the player looks the same.
  ;[...source.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join("")
      const style = document.createElement("style")

      style.textContent = cssRules
      dist.head.appendChild(style)
    } catch (error) {
      console.warn(error)

      const link = document.createElement("link")

      link.rel = "stylesheet"
      link.type = styleSheet.type
      link.media = styleSheet.media.mediaText
      link.href = styleSheet.href!
      dist.head.appendChild(link)
    }
  })
}

documentPictureInPicture.addEventListener("enter", (event) => {
  const pipWindow = event.window
  console.log(pipWindow)

  const pipWindow2 = documentPictureInPicture.window
  console.log(pipWindow2)
})

document.addEventListener("DOMContentLoaded", function () {
  const pipButton = document.querySelector<HTMLInputElement>("#doc-pip-button")
  const closeButton = document.querySelector<HTMLButtonElement>("#close-doc-pip-button")
  const log = document.getElementById("log-doc-pip")

  if ("documentPictureInPicture" in window) {
    // The Document Picture-in-Picture API is supported.
    pipButton!.removeAttribute("disabled")
  } else {
    log!.innerText = "PiP not supported. Check browser compatibility for details."
  }

  pipButton!.addEventListener("click", async () => {
    const player = document.querySelector("#player-doc-pip")

    // Open a Picture-in-Picture window
    // whose size is the same as the player's.
    const pipWindow = await documentPictureInPicture.requestWindow({
      width: player!.clientWidth + 40,
      height: player!.clientHeight + 40,
      // Hide the "back to tab" button of the Picture-in-Picture window
      disallowReturnToOpener: true,
      // Open the Picture-in-Picture window in its default position and size
      preferInitialWindowPlacement: true,
    })
    console.log(`size: ${player!.clientWidth}x${player!.clientHeight}`)

    // Copy style sheets to the Picture-in-Picture window
    copyStyleSheets(pipWindow.document, document)

    // Move the player to the Picture-in-Picture window.
    pipWindow.document.body.append(player!)

    // Move the player back when the Picture-in-Picture window closes.
    pipWindow.addEventListener("pagehide", () => {
      const playerContainer = document.querySelector("#player-container-doc-pip")

      const pipPlayer = pipWindow.document.querySelector("#player-doc-pip")
      playerContainer!.append(pipPlayer!)

      closeButton!.disabled = true
    })

    // Add a "mute" button to the Picture-in-Picture window.
    const pipMuteButton = pipWindow.document.createElement("button")
    pipMuteButton.textContent = "Mute"
    pipMuteButton.addEventListener("click", () => {
      const pipVideo = pipWindow.document.querySelector<HTMLVideoElement>("#video-doc-pip")
      pipVideo!.muted = true
    })
    pipWindow.document.body.append(pipMuteButton)

    // Add a "resize" button to the Picture-in-Picture window.
    const resizeButton = pipWindow.document.createElement("button")
    resizeButton.textContent = "Resize"
    resizeButton.addEventListener("click", () => {
      // Expand the Picture-in-Picture window's width by 20px and height by 30px.
      pipWindow.resizeBy(20, 30)
    })
    pipWindow.document.body.append(resizeButton)

    // Add a "Return to opener tab" button to the Picture-in-Picture window.
    const returnToTabButton = pipWindow.document.createElement("button")
    returnToTabButton.textContent = "Return to opener tab"
    returnToTabButton.addEventListener("click", () => {
      window.focus()
    })
    pipWindow.document.body.append(returnToTabButton)

    closeButton!.disabled = false
    closeButton!.onclick = () => {
      pipWindow.close()
    }
  })

  const output = document.querySelector("#output-doc-pip")
  const timer = setInterval(() => {
    output!.textContent = new Date().toISOString()
  }, 500)

  document.addEventListener("beforeunload", function () {
    clearInterval(timer)
  })
})
