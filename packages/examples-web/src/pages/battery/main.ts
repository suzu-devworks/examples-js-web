import "@/assets/style.scss"
import "./style.scss"

document.title = `Battery Status API - ${import.meta.env.VITE_APP_TITLE}`
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Battery Status API</h1>
  <article>
    <h2>Detect connection changes</h2>
    <p>In this example, we watch for changes both to the charging status
      (whether or not we're plugged in and charging)
      and for changes to the battery level and timing.</p>
    <section class="output">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </section>
  </article>
`
navigator.getBattery?.().then((battery) => {
  console.log(battery)

  function updateAllBatteryInfo() {
    updateChargeInfo()
    updateLevelInfo()
    updateChargingInfo()
    updateDischargingInfo()
  }
  updateAllBatteryInfo()

  battery.addEventListener("chargingchange", () => {
    updateChargeInfo()
  })
  function updateChargeInfo() {
    const output = document.querySelector(".output li:nth-child(1)")
    output!.textContent = `Battery charging? ${battery.charging ? "Yes" : "No"}`
  }

  battery.addEventListener("levelchange", () => {
    updateLevelInfo()
  })
  function updateLevelInfo() {
    const output = document.querySelector(".output li:nth-child(2)")
    output!.textContent = `Battery level: ${(battery.level ?? 0) * 100}%`
  }

  battery.addEventListener("chargingtimechange", () => {
    updateChargingInfo()
  })
  function updateChargingInfo() {
    const output = document.querySelector(".output li:nth-child(3)")
    output!.textContent = `Battery charging time: ${battery.chargingTime} seconds`
  }

  battery.addEventListener("dischargingtimechange", () => {
    updateDischargingInfo()
  })
  function updateDischargingInfo() {
    const output = document.querySelector(".output li:nth-child(4)")
    output!.textContent = `Battery discharging time: ${battery.dischargingTime} seconds`
  }
})
