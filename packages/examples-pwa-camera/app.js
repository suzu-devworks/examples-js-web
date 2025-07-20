import { Camera } from "./assets/js/camera.js"
import { Logger } from "./assets/js/logger.js"
import {
  configureDefaultControls,
  configureDefaultControlsEvent,
  configureDeviceSelector,
  configureAspectRatioSelector,
  resetSelector,
  clearCameraSettingValues,
  setCameraSettingValues,
  flipCameraHorizontal,
  configurePointOfInterestSelector,
  setControlsEnabled,
  subscribeControlsEvent,
} from "./assets/js/settings.js"
;(() => {
  const logger = new Logger(document.getElementById("logs"))

  const video = document.getElementById("video")
  const canvas = document.getElementById("canvas")
  const photo = document.getElementById("photo")

  const camera = new Camera(video, navigator)

  function clearPhoto() {
    console.log("called clearPhoto.")

    canvas.width = video.videoWidth ? video.videoWidth : 360
    canvas.height = video.videoHeight ? video.videoHeight : 360 * 0.75
    const fillColor = getComputedStyle(photo.parentElement).getPropertyValue("background-color")

    const context = canvas.getContext("2d")
    context.fillStyle = fillColor
    context.fillRect(0, 0, canvas.width, canvas.height)

    const data = canvas.toDataURL("image/png")
    photo.setAttribute("src", data)

    const info = document.getElementById("photo-info")
    info.innerHTML = "&nbsp;"
  }

  function takePhoto() {
    console.log("called takePhoto.")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")

    if (camera.front) {
      // Flip horizontally for front camera.
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const data = canvas.toDataURL("image/png")
    photo.setAttribute("src", data)

    const message = `size: ${canvas.width}x${canvas.height}`
    const info = document.getElementById("photo-info")
    info.innerText = message
    logger.logInfo(`Take Photo, ${message}`)
  }

  clearPhoto()
  configureDefaultControls(document)

  const shutterbutton = document.getElementById("shutter-button")
  shutterbutton?.addEventListener("click", (ev) => {
    console.log("event shutter click!", ev)
    try {
      takePhoto()
    } catch (err) {
      console.error(err)
      logger.logError(err)
    }
    ev.preventDefault()
  })

  const clearbutton = document.getElementById("clear-button")
  clearbutton?.addEventListener("click", (ev) => {
    console.log("event clear click!", ev)
    try {
      clearPhoto()
    } catch (err) {
      console.error(err)
      logger.logError(err)
    }
    ev.preventDefault()
  })

  //----------

  const switchbutton = document.getElementById("switch-button")
  switchbutton?.addEventListener("click", async (ev) => {
    console.log("event switch click!", ev)
    try {
      const parent = document.getElementById("setting-items")
      clearCameraSettingValues(parent)
      resetSelector(document.getElementById("specify-item-device"))
      resetSelector(document.getElementById("setting-item-aspectRatio"))

      await camera.switchDevices()
    } catch (err) {
      console.error(err)
      logger.logError(err)
    }
    ev.preventDefault()
  })

  //----------

  const deviceItem = document.getElementById("specify-item-device")
  configureDeviceSelector(document, deviceItem, camera)

  const devicebutton = document.getElementById("apply-device-button")
  devicebutton?.addEventListener("click", async (ev) => {
    console.log("event device click!", ev)
    try {
      const deviceId = document.getElementById("specify-item-device-selector")?.value

      const constraints = deviceId ? { video: { deviceId: { exact: deviceId } } } : { video: {} }

      const parent = document.getElementById("setting-items")
      clearCameraSettingValues(parent)
      resetSelector(document.getElementById("setting-item-aspectRatio"))

      await camera.switchDevices(constraints)
    } catch (err) {
      console.error(err)
      logger.logError(err)
    }
    ev.preventDefault()
  })

  //----------

  const aspectRatioItem = document.getElementById("setting-item-aspectRatio")
  if (aspectRatioItem) {
    configureAspectRatioSelector(document, aspectRatioItem)
  }

  //----------
  async function onAppliedConstraints(ev) {
    const name = ev.target?.dataset.name ?? ev.target?.closest("[data-name]")?.dataset.name
    const value = ev.target?.value

    const constraints = {}
    constraints[name] = value
    await camera.applyAdvancedConstraints(constraints)
  }

  configureDefaultControlsEvent(document, onAppliedConstraints)

  video.addEventListener("appliedConstraints", (ev) => {
    console.log("event applied!", ev, ev.detail)
    logger.logInfo(ev.detail)

    try {
      const parent = document.getElementById("setting-items")
      setCameraSettingValues(document, parent, ev.detail, async (ev2) => {
        await onAppliedConstraints(ev2)
        flipCameraHorizontal(video, camera.front)
      })

      const settings = ev.detail?.settings
      const message = `size: ${settings?.width}x${settings?.height}` + `, aspectRatio: ${settings?.aspectRatio}`
      const info = document.getElementById("video-info")
      info.innerText = message
    } catch (err) {
      console.error(err)
      logger.logError(err)
    }
  })

  //--- pointOfInterest

  const pointOfInterestItem = document.getElementById("specify-item-point")
  if (pointOfInterestItem) {
    configurePointOfInterestSelector(document, pointOfInterestItem)

    // eslint-disable-next-line no-inner-declarations
    function getPointOfInterestEnabled(_document) {
      return pointOfInterestItem.querySelector("input[type='checkbox']")?.checked ?? false
    }

    const focusPoint = pointOfInterestItem.querySelector(".focus-point")
    const focusGhost = pointOfInterestItem.querySelector(".focus-ghost")
    const display = pointOfInterestItem.querySelector(".point-value")
    const buttons = pointOfInterestItem.querySelectorAll("button")

    video.addEventListener("mouseenter", (_ev) => {
      if (!getPointOfInterestEnabled(document)) {
        return
      }

      if (focusGhost) {
        focusGhost.style.display = "block"
      }
    })

    video.addEventListener("mouseleave", (_ev) => {
      if (!getPointOfInterestEnabled(document)) {
        return
      }
      if (focusGhost) {
        focusGhost.style.display = "none"
      }
    })

    video.addEventListener("mousemove", (ev) => {
      if (!getPointOfInterestEnabled(document)) {
        return
      }
      if (focusGhost) {
        focusGhost.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px)`
      }
    })

    video.addEventListener("mouseup", async (ev) => {
      if (!getPointOfInterestEnabled(document)) {
        return
      }

      if (focusGhost) {
        focusPoint.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px)`
        focusPoint.style.display = "block"
      }

      const offsetPoint = { x: ev.offsetX, y: ev.offsetY }
      const normalPoint = {
        x: ev.offsetX / video.offsetWidth,
        y: ev.offsetY / video.offsetHeight,
      }

      const offset = JSON.stringify(offsetPoint)
      const normal = JSON.stringify(normalPoint)

      focusPoint.dataset.normalPoint = normal

      if (display) {
        display.innerText = `offset: ${offset}\nnormal: ${normal}`
      }

      if (buttons?.length > 0) {
        setControlsEnabled(buttons, true)
      } else {
        await onApplyPointOfInterest(normal, null, "continuous")
      }
    })

    subscribeControlsEvent(buttons, "click", async (ev) => {
      const point = focusPoint.dataset.normalPoint
      const appendName = ev.target?.dataset.name

      await onApplyPointOfInterest(point, appendName, "continuous")
      ev.preventDefault()
    })

    // eslint-disable-next-line no-inner-declarations
    async function onApplyPointOfInterest(point, appendName, appendValue) {
      const constraints = {}
      constraints.pointOfInterest = { exact: [point] }

      if (appendName) {
        constraints[appendName] = appendValue
      } else {
        constraints.exposureMode = appendValue
        constraints.focusMode = appendValue
        constraints.whiteBalanceMode = appendValue
      }

      await camera.applyAdvancedConstraints(constraints)
    }
  }

  //----------

  window.addEventListener("load", async () => {
    await camera.open()
    console.log("started!")
  })

  //run immediate.
  console.log("run immediate!")
})()
