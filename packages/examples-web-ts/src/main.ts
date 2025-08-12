import "./assets/style.scss"

const title = import.meta.env.VITE_APP_TITLE

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>${title}</h1>
  <nav>
    <ul>
      <li><a href="pages/counters/">Counters (from create-vite's template)</a></li>
      <li><a href="pages/file-accessor/">File Accessor</a></li>
    </ul>
  </nav>
`
