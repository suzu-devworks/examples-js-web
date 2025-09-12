import "@/assets/style.scss"
import "./style.scss"
import { content as beepContent } from "./beep"
import { content as tutorialContent } from "./tutorial"
import { content as visualizerContent } from "./visualizations"

document.title = `Web Audio API - ${import.meta.env.VITE_APP_TITLE}`
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Web Audio API</h1>
  ${beepContent}
  ${tutorialContent}
  ${visualizerContent}
`
