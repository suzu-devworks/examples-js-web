/* eslint-disable no-var */

interface DocumentPictureInPictureEvent extends Event {
  window: Window
}

interface DocumentPictureInPictureEventMap {
  enter: DocumentPictureInPictureEvent
}

interface DocumentPictureInPicture extends EventTarget {
  readonly window?: Window
  onenter?: EventListener

  requestWindow: (options?: {
    width?: number
    height?: number
    disallowReturnToOpener?: boolean
    preferInitialWindowPlacement?: boolean
  }) => Promise<Window>

  addEventListener<K extends keyof DocumentPictureInPictureEventMap>(
    type: K,
    listener: (this: DocumentPictureInPicture, ev: DocumentPictureInPictureEventMap[K]) => Any,
    options?: boolean | AddEventListenerOptions
  ): void
}

declare interface Window {
  readonly documentPictureInPicture: DocumentPictureInPicture
}

declare var window: Window
declare var documentPictureInPicture: DocumentPictureInPicture
