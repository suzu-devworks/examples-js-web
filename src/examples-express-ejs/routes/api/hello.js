const express = require("express")
const router = express.Router()

// GET hello world API.
router.get("/", function (req, res, _next) {
  res.json({ message: "Hello World" })
})

module.exports = router
