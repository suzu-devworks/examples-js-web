import "@/assets/style.scss"
import "./style.scss"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Geolocation API</h1>
  <article>
    <h2>Using the Geolocation API</h2>
    <p>If the object exists, geolocation services are available.</p>
    <section class="controls">
      <button id="get-geolocation">Get</button>
      <div>
        <a id="map-link-geolocation" href=""></a>
      </div>
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
})
