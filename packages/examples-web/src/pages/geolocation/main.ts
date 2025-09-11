import "@/assets/style.scss"
import "./style.scss"

document.title = `Geolocation API - ${import.meta.env.VITE_APP_TITLE}`
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Geolocation API</h1>
  <article>
    <h2>Using the Geolocation API</h2>
    <p>If the object exists, geolocation services are available.</p>
    <section class="controls">
      <button id="get-geolocation" class="search-location-button">Get Map Link</button>
      <div>
        <a id="map-link-geolocation" href=""></a>
      </div>
    </section>
  </article>
  <article>
    <h2>Watching the current position</h2>
    <p>If the position data changes (either by device movement or if more accurate geo information arrives),
      you can set up a callback function that is called with that updated position information.</p>
    <section class="controls">
      <button id="watch-geolocation" data-watching="false" role="switch" aria-checked="false" class="watching-location-button">
        <span>Watch</span>
      </button>
    </section>
    <section>
      <output id="output-geolocation" ></output>
    </section>
  </article>
`

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector<HTMLButtonElement>("#get-geolocation")!.addEventListener("click", function () {
    if (!("geolocation" in navigator)) {
      console.error("geolocation IS NOT available")
      return
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const anchor = document.querySelector<HTMLAnchorElement>("#map-link-geolocation")!

      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      const parameters = `&query=${latitude},${longitude}`
      anchor.href = `https://www.google.com/maps/search/?api=1${parameters}`
      anchor.target = "_blank"
      anchor.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`
    })
  })

  const output = document.querySelector<HTMLElement>("#output-geolocation")!
  let watchID: number
  document.querySelector<HTMLButtonElement>("#watch-geolocation")!.addEventListener("click", function () {
    if (this.dataset.watching === "false") {
      watchID = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const now = new Date()
        output.textContent = `Latitude: ${latitude}, Longitude: ${longitude} at ${now.toISOString()}`
      })
      this.dataset.watching = "true"
    } else {
      navigator.geolocation.clearWatch(watchID)
      output.textContent = ""
      this.dataset.watching = "false"
    }
  })
})
