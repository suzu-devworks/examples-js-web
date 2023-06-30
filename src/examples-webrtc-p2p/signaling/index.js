"use strict"

import { createServer } from "https"
import { WebSocketServer } from "ws"
import fs from "fs"

const port = 3010

const server = createServer({
  key: fs.readFileSync("/etc/ssl/local/localhost.key"),
  cert: fs.readFileSync("/etc/ssl/local/localhost.crt"),
})

const wssServer = new WebSocketServer({ server })
server.listen(port)
console.log(`websocket server start. port=${port}`)

wssServer.on("connection", (ws /*, request*/) => {
  console.log(new Date().toISOString(), "-- websocket connected --")
  ws.on("error", console.error)
  ws.on("close", (code /*, reason*/) => console.log(`close [${code}]`))
  ws.on("message", (message) => {
    wssServer.clients.forEach((client) => {
      if (isSame(ws, client)) {
        console.log(new Date().toISOString(), "- skip sender -")
      } else {
        console.log(
          new Date().toISOString(),
          `- send message [${message.length} bytes]` +
            `, from: "${ws._socket.remoteAddress}:${ws._socket.remotePort}"` +
            `, to: "${client._socket.remoteAddress}:${client._socket.remotePort}"`
        )

        client.send(message)
      }
    })
    console.log("")
  })
})

function isSame(ws1, ws2) {
  return ws1 === ws2
}
