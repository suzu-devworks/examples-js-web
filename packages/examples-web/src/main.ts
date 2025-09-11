import "@/assets/style.scss"

const title = import.meta.env.VITE_APP_TITLE

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>${title}</h1>
  <nav>
    <ul>
      <li><a href="pages/counters/">Counter (from create-vite's template)</a></li>
      <li>Web APIs
        <ul>
          <li><a href="pages/files/">File API</a></li>
          <li><a href="pages/geolocation/">Geolocation API</a></li>
          <li><a href="pages/network/">Network Information API</a></li>
          <li><a href="pages/orientation/">Screen Orientation API</a></li>
          <li><a href="pages/web-audio/">Web Audio API</a></li>
        </ul>
      </li>
    </ul>
  </nav>
`
