// VerticalHoverLine - How To Create A Vertical Hover Line In Chart JS 4
//
// see also:
//  - https://www.youtube.com/watch?v=-6xqMLOi7Uc
//
// how to use:
// ```js
// const config = {
//   options: {
//     interaction: {
//       mode: "index",
//       intersect: false,
//     },
//   },
//   plugins: [VerticalHoverLine],
// }
// ```
;(function (global, factory) {
  global = typeof globalThis !== "undefined" ? globalThis : global || self
  global.VerticalHoverLine = factory(global.Chart.helpers, global.Chart)
})(this, function (_helpers, _chart_js) {
  "use strict"
  const plugin = {
    id: "verticalHoverLine",

    beforeDatasetsDraw(chart, _args, _plugins) {
      const {
        ctx,
        chartArea: { top, bottom, _height },
      } = chart

      ctx.save()

      chart.getDatasetMeta(0).data.forEach((dataPoint, _index) => {
        if (dataPoint.active === true) {
          ctx.beginPath()
          ctx.strokeStyle = "gray"
          ctx.moveTo(dataPoint.x, top)
          ctx.lineTo(dataPoint.x, bottom)
          ctx.stroke()
        }
      })
    },
  }

  return plugin
})
