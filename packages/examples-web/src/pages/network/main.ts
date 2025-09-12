import "@/assets/style.scss"
import "./style.scss"

document.title = `Network Information API - ${import.meta.env.VITE_APP_TITLE}`
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Network Information API</h1>
  <article>
    <h2>Detect connection changes</h2>
    <p>This example watches for changes to the user's connection.</p>
    <section>
      <output id="output-network" ></output>
    </section>
  </article>
`

let previous: EffectiveConnectionType | undefined = navigator.connection?.effectiveType
const displayNetworkInformation = () => {
  const effectiveType = navigator.connection?.effectiveType

  const output = document.querySelector<HTMLOutputElement>("#output-network")

  output!.textContent =
    previous === effectiveType // `4g` ?
      ? `Connection type is ${effectiveType}`
      : `Connection type changed from ${previous} to ${effectiveType}`

  previous = effectiveType
}

navigator.connection?.addEventListener("change", () => {
  console.log("Connection type changed.", navigator.connection)
  displayNetworkInformation()
})

displayNetworkInformation()
