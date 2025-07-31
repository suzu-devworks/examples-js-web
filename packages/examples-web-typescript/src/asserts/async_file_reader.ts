export class AsyncFileReader extends FileReader {
  constructor() {
    super()
  }

  readAsArrayBufferAsync(blob: Blob): Promise<string | ArrayBuffer | null | undefined> {
    return new Promise((resolve, reject) => {
      super.addEventListener("load", ({ target }) => resolve(target?.result))
      super.addEventListener("error", ({ target }) => reject(target?.error))
      super.readAsArrayBuffer(blob)
    })
  }
}
