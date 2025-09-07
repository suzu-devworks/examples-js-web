import "@/assets/style.scss"
import "./style.scss"
import { AsyncFileReader } from "@/utils/async_file_reader"
import { toBase64 } from "./base64"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>File API</h1>
  <article>
    <h2>FileReader</h2>
    <p>A sample that extends FileReader to make asynchronous processing easier to write</p>
    <section>
      <input id="file-selector" type="file" accept="image/*" />
      <div class="file-reader-results">
        <textarea id="file-base64"></textarea>
        <img id="file-image" />
      </div>
    </section>
  </article>
`

document.getElementById("file-selector")?.addEventListener("change", async function () {
  const file = (this as HTMLInputElement).files![0]

  const buffer = await new AsyncFileReader().readAsArrayBufferAsync(file)

  const bytes = new Uint8Array(buffer as ArrayBuffer)
  const base64 = toBase64(bytes)
  document.querySelector<HTMLTextAreaElement>("#file-base64")!.value = base64

  const url = await new AsyncFileReader().readAsDataURLAsync(file)

  document.querySelector<HTMLImageElement>("#file-image")!.src = url ?? ""
})
