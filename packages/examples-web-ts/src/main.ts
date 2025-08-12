import "./style.css"

const title = import.meta.env.VITE_APP_TITLE

document.querySelector("title")!.innerText = `${title} with ${document.querySelector("title")!.innerText}`
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
      <h1>${title}</h1>
      <ul>
        <li><a href="pages/counters/">Counters (from create-vite's template)</a></li>
        <li><a href="pages/file-accessor/">File Accessor</a></li>
      </ul>
  </div>
`
