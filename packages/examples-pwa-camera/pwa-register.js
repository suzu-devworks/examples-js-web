;(() => {
  // const userAgent = navigator.userAgent.toLowerCase();
  //
  // function createManifestLink(url) {
  //   const link = document.createElement("link")
  //   link.rel = "manifest"
  //   link.href = url
  //   return link
  // }
  //
  // const manifest =
  //   userAgent.indexOf("iphone") > 0 || userAgent.indexOf("ipad") > 0
  //     ? createManifestLink("manifest-ios.json")
  //     : createManifestLink("manifest.json");
  // document.head.appendChild(manifest);

  // Register service worker to control making site work offline

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("Service Worker Registration successfull with scope: ", registration.scope)
      })
      .catch((err) => {
        console.error("Service Worker Registration failed: ", err)
      })

    window.addEventListener("beforeinstallprompt", (_ev) => {
      console.log("Service Worker beforeinstallprompt")
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      //ev.preventDefault();

      // other ...
    })
  }

  //run immediate.
})()
