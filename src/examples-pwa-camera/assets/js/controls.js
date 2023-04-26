export function createLabeledRadio(document, group, text, value, options = null) {
  const radio = document.createElement("input")
  radio.type = "radio"
  radio.name = group
  radio.value = value
  radio.checked = options?.defaultSelected
  //radio.checked = options?.selected;
  radio.disabled = options?.disabled

  const label = document.createElement("label")
  label.appendChild(radio)
  label.appendChild(new Text(text))

  return label
}

export function setSelections(selector, selections) {
  selector.innerHTML = ""

  for (const item of selections ?? []) {
    selector.appendChild(item)
  }
}

export function setControlsEnabled(controls, enabled) {
  for (const control of controls ?? []) {
    control.disabled = !enabled
  }
}

export function subscribeInputLabel(input, label) {
  input?.addEventListener("input", (ev) => {
    label.innerText = input?.value
  })
  label.innerText = input?.value
}

export function subscribeControlsEvent(controls, type, listener) {
  for (const control of controls ?? []) {
    control.addEventListener(type, listener)
  }
}
