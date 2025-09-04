export function switchLocalhost(href) {
  const url = new URL(href)
  let modified = false
  if (url.hostname === "0.0.0.0") {
    url.hostname = "localhost"
    modified = true
    console.log(url.href)
  }
  return { modified, href: url.href }
}

if (window.location.href) {
  switchLocalhost(window.location.href)
}
