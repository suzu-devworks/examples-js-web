// Reference Line
//
// how to use:
// ```js
// import plugin from "./reference-line.js"
//
// const config = {
//   options: {
//     interaction: {
//       mode: "nearest",
//       intersect: false,
//     },
//   },
//   plugins: [plugin],
// }
// ```
const toColor = (value) => {
  if (typeof value === "function") {
    return value.apply()
  } else if (Array.isArray(value)) {
    return value.length > 0 ? value[0] : undefined
  } else {
    return value
  }
}

const drawReferenceLine = (ctx, x, y, width, options) => {
  ctx.save()

  ctx.strokeStyle = options.borderColor ?? "rgb(0 0 0 / 0.6)"
  ctx.lineWith = options.lineWidth ?? 1
  ctx.setLineDash([3, 2])

  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + width, y)
  ctx.stroke()

  ctx.restore()
}

const drawReferenceArea = (ctx, x, y, width, height, options) => {
  ctx.save()

  ctx.fillStyle = options.backgroundColor ?? "rgb(0 0 0 / 0.1)"
  ctx.fillRect(x, y, width, height)

  ctx.restore()
}

const drawText = (ctx, text, x, y, options) => {
  if (!text) {
    return
  }

  const margin = 4
  const textRect = ctx.measureText(text)

  const { dx, dy } = getTextPosition()
  if (dx !== undefined && dy !== undefined) {
    ctx.save()

    ctx.fillStyle = options.textColor ?? "rgb(0 0 0)"
    ctx.fillText(text, dx, dy)

    ctx.restore()
  }

  function getTextPosition() {
    switch (options.textAlign) {
      case "inside": {
        const dx = Math.max(x + margin, 0)
        const dy = Math.max(y + textRect.fontBoundingBoxAscent + margin, 0)
        return { dx, dy }
      }
      case "outside": {
        const dx = Math.max(x - textRect.width - margin, 0)
        const dy = y
        return { dx, dy }
      }
      default:
        return {}
    }
  }
}

export default {
  id: "reference_line",

  defaults: {
    display: true,
    label: {
      align: "inside",
    },
  },

  beforeDraw: (chart, _args, options) => {
    if (!(options.display ?? true)) {
      return
    }

    const { ctx, data } = chart

    data.datasets.forEach((dataset) => {
      if (dataset.upperLimit || dataset.lowerLimit) {
        const yAxisID = dataset.yAxisID ?? "y"
        const axis = chart.scales[yAxisID]

        const dx = chart.scales.x.left
        const dw = chart.scales.x.width

        let upperLimit = dataset.upperLimit
        let lowerLimit = dataset.lowerLimit
        if (upperLimit && lowerLimit && upperLimit < lowerLimit) {
          ;[upperLimit, lowerLimit] = [lowerLimit, upperLimit]
        }

        if (upperLimit || lowerLimit) {
          const dy1 = upperLimit ? axis.getPixelForValue(upperLimit) : axis.top
          const dy2 = lowerLimit ? axis.getPixelForValue(lowerLimit) : axis.bottom
          const backgroundColor = toColor(dataset.backgroundColor)
          drawReferenceArea(ctx, dx, dy1, dw, dy2 - dy1, { backgroundColor })
        }

        if (upperLimit) {
          const dy = axis.getPixelForValue(upperLimit)
          const borderColor = toColor(dataset.borderColor)
          drawReferenceLine(ctx, dx, dy, dw, { borderColor })
          drawText(ctx, `[${upperLimit}]`, dx, dy, {
            textColor: borderColor,
            textAlign: options.label.align,
          })
        }

        if (lowerLimit) {
          const dy = axis.getPixelForValue(lowerLimit)
          const borderColor = toColor(dataset.borderColor)
          drawReferenceLine(ctx, dx, dy, dw, { borderColor })
          drawText(ctx, `[${lowerLimit}]`, dx, dy, {
            textColor: borderColor,
            textAlign: options.label.align,
          })
        }
      }
    })
  },
}
