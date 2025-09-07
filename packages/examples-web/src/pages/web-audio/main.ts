import "@/assets/style.scss"
import "./style.scss"
import { content as beepContent } from "./beep"
import { content as tutorialContent } from "./tutorial"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Web Audio API</h1>
  ${beepContent}
  ${tutorialContent}
`
