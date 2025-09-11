import "@/assets/style.scss"
import "./style.scss"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Screen Orientation API</h1>
  <article>
    <h2>Managing screen orientation</h2>
    <p>The term screen orientation refers to whether a browser viewport is in landscape mode
     (that is, the width of the viewport is greater than its height),
     or else in portrait mode (the height of the viewport is greater than its width)
    </p>
    <section class="mdn-example">
      <ul class="toolbar">
        <li>A</li>
        <li>B</li>
        <li>C</li>
      </ul>

      ${
        // spell-checker: disable
        `<p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacinia nisi nec
          sem viverra vitae fringilla nulla ultricies. In ac est dolor, quis tincidunt
          leo. Cras commodo quam non tortor consectetur eget rutrum dolor ultricies. Ut
          interdum tristique dapibus. Nullam quis malesuada est.
        </p>`
        // spell-checker: enable
      }
    </section>

    <section>
      <output id="output-orientation" ></output>
    </section>
  </article>
`

const displayLocation = () => {
  const output = document.querySelector<HTMLOutputElement>("#output-orientation")
  output!.textContent = `The orientation of the screen is: ${screen.orientation.type}, angle=${screen.orientation.angle}°`
}

screen.orientation.addEventListener("change", () => {
  console.log(`The orientation of the screen is: ${screen.orientation.type}`)
  displayLocation()
})

displayLocation()
