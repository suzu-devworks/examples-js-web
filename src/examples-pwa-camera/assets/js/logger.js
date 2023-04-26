export class Logger {
  #element

  constructor(element) {
    this.#element = element
  }

  #createEntry(className, massage) {
    const entry = document.createElement("pre")
    entry.className = className
    entry.innerText = massage
    return entry
  }

  logInfo(parameter, options) {
    let data = parameter
    if (typeof parameter === "string") {
      data = { message: parameter }
    }

    const notify = {
      timestamp: new Date().toISOString(),
      ...data,
      ...options,
    }

    this.#element.appendChild(this.#createEntry("log-info", JSON.stringify(notify)))
  }

  logError(error, options) {
    let data = error
    if (typeof error === "string") {
      data = { message: parameter }
    }

    if (error instanceof Error) {
      data = { message: `${error.name}: ${error.message}` }
    }

    const notify = {
      timestamp: new Date().toISOString(),
      ...data,
      ...options,
    }

    this.#element.appendChild(this.#createEntry("log-error", JSON.stringify(notify)))
  }
}
