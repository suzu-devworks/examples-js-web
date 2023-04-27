import {
  subscribeInputLabel,
  createLabeledRadio,
  setSelections,
  setControlsEnabled,
} from "./controls.js"

export { setControlsEnabled, subscribeControlsEvent } from "./controls.js"

const settingItemPrefix = "setting-item-"

export function configureDefaultControls(document) {
  // TODO
}

export function configureDefaultControlsEvent(document, onclick) {
  const items = document.querySelectorAll(`[id^='${settingItemPrefix}']`)
  for (const item of items ?? []) {
    //console.log("set default event to:", item);
    subscribeRadioEvent(item, onclick)
    // or
    subscribeRangeEvent(item, onclick)
    // or
    subscribeCheckboxEvent(item, onclick)
  }

  const checkes = document.querySelectorAll("input[type='radio']")
}

export function configureDeviceSelector(document, item, camera) {
  const selector = item?.querySelector("select")
  if (!selector) {
    return
  }

  camera?.getDevices().then((devices) => {
    setSelections(selector, [
      new Option("default", "", true, true),
      ...devices.map((x) => new Option(x.label, x.deviceId)),
    ])
  })
}

export function configureAspectRatioSelector(document, item) {
  const aspectRatios = [
    { name: "18:9", value: 2 },
    { name: "16:9", value: 1.77778 },
    { name: "4:3", value: 1.33333 },
    { name: "1:1", value: 1 },
    { name: "3:4", value: 0.75 },
    { name: "9:16", value: 0.5625 },
    { name: "9:18", value: 0.5 },
  ]

  const radios = [
    createLabeledRadio(document, "aspectRatio", "default", "", {
      defaultSelected: true,
    }),
    ...aspectRatios.map((x) => createLabeledRadio(document, "aspectRatio", x.name, x.value)),
  ]

  setSelections(item?.querySelector(".setting-values"), radios)
}

export function resetSelector(item) {
  const selection = item?.querySelector("select option[value='']")
  if (selection) {
    selection.selected = true
  }

  const radio = item?.querySelector("input[type='radio'][value='']")
  if (radio) {
    radio.checked = true
  }
}

export function configurePointOfInterestSelector(document, item) {
  subscribeCheckboxEvent(item, (ev) => {
    setCheckboxValue(item, ev.target.checked)

    const display = document.querySelector(".point-value")
    if (display) {
      display.innerText = ""
    }

    const focus = document.querySelector(".focus-point")
    if (focus) {
      focus.style.display = "none"
    }

    const buttons = item.querySelectorAll("button")
    setControlsEnabled(buttons, false)
  })

  setCheckboxValue(item, false)
}

// ---- set camera values.

export function clearCameraSettingValues(parent) {
  if (!parent) {
    return
  }

  parent.innerHTML = ""
}

export function setCameraSettingValues(document, parent, preferences, onclick) {
  const supported = preferences.supportedConstraints
  const capabilities = preferences.capabilities
  const settings = preferences.settings

  const excludes = ["deviceId", "groupId", "facingMode", "aspectRatio"]
  const enumerate = Object.getOwnPropertyNames(capabilities).filter(
    (name) => supported[name] && !excludes.includes(name)
  )

  for (const name of enumerate) {
    const capability = capabilities[name]
    const value = settings[name]
    //console.log(name, value, capability);

    const id = `${settingItemPrefix}${name}`

    if (capability instanceof Array) {
      let item = document.getElementById(id)
      if (!item) {
        item = createRadioSelector(document, id, name)
        parent?.appendChild(item)

        setRadioCapability(item, capability)
        subscribeRadioEvent(item, onclick)
      }
      setRadioValue(item, value)
      continue
    }

    if (capability instanceof Object && "max" in capability && "min" in capability) {
      let item = document.getElementById(id)
      if (!item) {
        item = createRangeInput(document, id, name)
        parent?.appendChild(item)
        subscribeRangeEvent(item, onclick)
      }
      setRangeCapability(item, capability)
      setRangeValue(item, value)
      continue
    }

    if (typeof capability == "boolean") {
      let item = document.getElementById(id)
      if (!item) {
        item = createCheckboxInput(document, id, name)
        parent?.appendChild(control)
        subscribeCheckboxEvent(item, onclick)
      }
      setCheckboxCapability(item, capability)
      setCheckboxValue(control, value)
      continue
    }

    Error(`Unspported capability ${name} typeof ${typeof capability}.`)
  }
}

function createSettingItem(document, id, name, values = null) {
  const label = document.createElement("label")
  label.className = "setting-name"
  label.innerText = name

  const container = document.createElement("div")
  container.className = "setting-values"

  for (const app of values ?? []) {
    container.appendChild(app)
  }

  const item = document.createElement("div")
  item.id = id
  item.className = "setting-item"
  item.appendChild(label)
  item.appendChild(container)

  item.dataset.name = name

  return item
}

// --- input[type="radio"] ---

function createRadioSelector(document, id, name) {
  return createSettingItem(document, id, name)
}

function subscribeRadioEvent(item, onchange) {
  const selectors = item?.querySelectorAll("input[type='radio']")
  for (const radio of selectors ?? []) {
    radio.addEventListener("change", onchange)
  }
}

function setRadioCapability(item, capability) {
  const name = item?.dataset.name
  const imageTracks = ["whiteBalanceMode", "exposureMode", "focusMode"]
  const entries = imageTracks.includes(name)
    ? ["none", "manual", "single-shot", "continuous"]
    : capability

  const options = entries.map((value) => {
    const enabled = capability?.includes(value) ?? false
    const radio = createLabeledRadio(document, name, value, value, {
      disabled: !enabled,
    })

    radio.dataset.name = name

    return radio
  })

  setSelections(item?.querySelector(".setting-values"), options)
}

function setRadioValue(item, value) {
  const selectors = item?.querySelectorAll("input[type='radio']")
  for (const radio of selectors ?? []) {
    radio.checked = radio.value === value
  }
}

// --- input[type="range"] ---

function createRangeInput(document, id, name) {
  const input = document.createElement("input")
  input.type = "range"

  input.dataset.name = name

  const display = document.createElement("label")
  display.className = "range-value"

  return createSettingItem(document, id, name, [input, display])
}

function subscribeRangeEvent(item, onchange) {
  const input = item?.querySelector("input[type='range']")
  input?.addEventListener("change", onchange)

  const display = item?.querySelector(".range-value")
  if (display) {
    subscribeInputLabel(input, display)
  }
}

function setRangeCapability(item, capability) {
  const input = item?.querySelector("input[type='range']")
  if (!input) {
    return
  }

  const positive = capability?.min < capability?.max
  if (positive) {
    input.max = capability?.max
    input.min = capability?.min
    input.step = capability?.step ?? 1
  } else {
    input.max = capability?.max
    input.min = 0
    input.step = capability?.step ?? 1
  }
}

function setRangeValue(item, value) {
  const input = item?.querySelector("input[type='range']")
  if (!input) {
    return
  }

  input.value = value

  const display = item?.querySelector(".range-value")
  if (display) {
    display.innerText = value
  }
}

// --- input[type="checkbox"] ---

function createCheckboxInput(document, id, name) {
  const input = document.createElement("input")
  input.type = "checkbox"
  input.id = `${id}-input`

  input.dataset.name = name

  const display = document.createElement("label")
  display.className = "checkbox-value"
  display.setAttribute("for", input.id)

  return createSettingItem(document, id, name, [input, display])
}

function subscribeCheckboxEvent(item, onchange) {
  const input = item?.querySelector("input[type='checkbox']")
  input?.addEventListener("change", onchange)
}

function setCheckboxCapability(item, capability) {
  // nothing to do.
}

function setCheckboxValue(item, checked) {
  const input = item?.querySelector("input[type='checkbox']")
  if (!input) {
    return
  }

  input.checked = checked

  const display = item?.querySelector(".checkbox-value")
  if (display) {
    display.innerText = checked ? "ON" : "OFF"
  }
}

// ---- others

export function flipCameraHorizontal(video, front) {
  video.className = front ? "camera-front" : ""
}
