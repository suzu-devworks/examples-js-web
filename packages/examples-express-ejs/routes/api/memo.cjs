const express = require("express")
const router = express.Router()

// GET memo API.
router.get("/", function (req, res, _next) {
  res.json({
    memo: {
      id: 1,
      text: req.query.text ?? "text",
      updateAt: new Date().toISOString(),
    },
  })
})

// POST memo API.
router.post("/", function (req, res, _next) {
  console.log(req.body)
  res.json({
    id: req.body.memo.id,
    text: req.body.memo.text,
    updateAt: new Date().toISOString(),
  })
})

module.exports = router
