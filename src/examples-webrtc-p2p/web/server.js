"use strict"

import { createServer } from "https"
import path from "path"
import url from "url"
import fs from "fs"

const port = 3001

// __dirname hack.
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  // ".png": "image/png",
  // ".jpg": "image/jpg",
  // ".gif": "image/gif",
  // ".svg": "image/svg+xml",
  // ".wav": "audio/wav",
  // ".mp4": "video/mp4",
  // ".woff": "application/font-woff",
  // ".ttf": "application/font-ttf",
  // ".eot": "application/vnd.ms-fontobject",
  // ".otf": "application/font-otf",
  // ".wasm": "application/wasm",
}

const options = {
  key: fs.readFileSync("/etc/ssl/local/localhost.key"),
  cert: fs.readFileSync("/etc/ssl/local/localhost.crt"),
}

const server = createServer(options, (request, response) => {
  console.log(`Request method: ${request.method} ${request.url}`)

  //skip favicon.ico
  if (request.url == "/favicon.ico") {
    response.writeHead(200, { "Content-Type": "image/x-icon" })
    response.end()
    return
  }

  const urlpath = request.url == "/" ? "index.html" : request.url
  const filePath = path.join(__dirname, urlpath)
  const extname = String(path.extname(filePath)).toLocaleLowerCase()
  const contentType = mimeTypes[extname] || "application/octet-stream"

  fs.readFile(filePath, "UTF-8", (error, content) => {
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./404.html", function (_error, content) {
          response.writeHead(404, { "Content-Type": "text/html" })
          response.end(content, "utf-8")
        })
      } else {
        response.writeHead(500)
        response.end("Sorry, check with the site admin for error: " + error.code + " ..\n")
      }
    }
    response.writeHead(200, { "Content-Type": contentType })
    response.end(content, "utf-8")
  })
})
server.listen(port)
console.log(`server running... port=${port}`)
