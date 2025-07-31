export class AsyncFileReader extends FileReader {
  constructor() {
    super()
  }

  readAsArrayBufferAsync(blob: Blob): Promise<ArrayBuffer | null | undefined> {
    return new Promise((resolve, reject) => {
      super.addEventListener("load", ({ target }) => resolve(target?.result as ArrayBuffer))
      super.addEventListener("error", ({ target }) => reject(target?.error))
      super.readAsArrayBuffer(blob)
    })
  }

  readAsDataURLAsync(blob: Blob): Promise<string | null | undefined> {
    return new Promise((resolve, reject) => {
      super.addEventListener("load", ({ target }) => resolve(target?.result as string))
      super.addEventListener("error", ({ target }) => reject(target?.error))
      super.readAsDataURL(blob)
    })
  }
}
