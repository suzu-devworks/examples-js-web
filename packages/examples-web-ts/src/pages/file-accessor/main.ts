import "./style.scss"
import { AsyncFileReader } from "../../utils/async_file_reader"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>File Accessor</h1>
  <p>A sample that extends FileReader to make asynchronous processing easier to write</p>
  <div>
    <input id="file-selector" type="file" accept="image/png, image/jpeg" />
    <div class="file-results">
      <textarea id="file-base64"></textarea>
      <img />
    </div>
  </div>
`

const toBase64 = (uint8Array: Uint8Array): string =>
  btoa(uint8Array.reduce((binaryString, uint8) => binaryString + String.fromCharCode(uint8), ""))

document.getElementById("file-selector")!.addEventListener("change", async function () {
  const file = (this as HTMLInputElement).files![0]

  const buffer = await new AsyncFileReader().readAsArrayBufferAsync(file)

  const bytes = new Uint8Array(buffer as ArrayBuffer)
  const base64 = toBase64(bytes)
  document.querySelector<HTMLTextAreaElement>("#file-base64")!.value = base64

  const url = await new AsyncFileReader().readAsDataURLAsync(file)

  document.querySelector<HTMLImageElement>(".file-results img")!.src = url ?? ""
})
