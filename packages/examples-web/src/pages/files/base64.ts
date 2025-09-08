export const toBase64 = (uint8Array: Uint8Array): string =>
  btoa(uint8Array.reduce((binaryString, uint8) => binaryString + String.fromCharCode(uint8), ""))
