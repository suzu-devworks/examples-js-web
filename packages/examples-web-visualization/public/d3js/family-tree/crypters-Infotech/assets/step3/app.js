/** Complete Family Tree (From Udemy D3.js Course) - Crypters Infotech.
 *
 * See also:
 *  - [Part 1](https://www.youtube.com/watch?v=U3EOqbYwHSo)
 *  - [Part 2](https://www.youtube.com/watch?v=U3EOqbYwHSo)
 *  - [Part 3](https://www.youtube.com/watch?v=aWT0EEXe83s)
 *  - [How to Add A Couple Without Child](https://www.youtube.com/watch?v=ejYq40pCMIg)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const data = [
  { child: "John", parent: "", spouse: "Isabella" },
  { child: "Aaron", parent: "Kevin" },
  { child: "Kevin", parent: "John", spouse: "Emma" },
  { child: "Mark", parent: "Ann" },
  { child: "Hannah", parent: "Ann", spouse: "Williams" },
  { child: "Rose", parent: "Sarah" },
  { child: "Ann", parent: "John", spouse: "George" },
  { child: "Sarah", parent: "Kevin", spouse: "James" },
  { child: "Angel", parent: "Sarah" },
  { child: null, parent: "Hannah" },
]

export function draw(container) {
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", 800)
    .attr("height", 450)
    .append("g")
    .attr("transform", "translate(50, 50)")

  const dataStructure = d3
    .stratify()
    .id((d) => d.child)
    .parentId((d) => d.parent)(data)

  const treeStructure = d3.tree().size([650, 300])
  const information = treeStructure(dataStructure)
  // console.log(information.descendants())
  // console.log(information.links())

  const connections1 = svg.append("g").selectAll("path").data(information.links())
  connections1
    .enter()
    .append("path")
    .attr(
      "d",
      (d) =>
        `M${d.source.x - 20},${d.source.y}` +
        ` h60` +
        ` v${(d.target.y - d.source.y) / 2}` +
        ` H${d.target.x}` +
        ` V${d.target.y}`
    )
    .classed("hide", (d) => d.target.data.child == undefined)

  const connections2 = svg.append("g").selectAll("path").data(information.links())
  connections2
    .enter()
    .append("path")
    .attr("d", (d) =>
      d.target.data.child == undefined ? `M${d.source.x} ${d.source.y} h80` : `M${d.source.x + 40} ${d.source.y} h40`
    )

  const rectangles = svg.append("g").selectAll("rect").data(information.descendants())
  rectangles
    .enter()
    .append("rect")
    .attr("x", (d) => d.x - (40 + 20))
    .attr("y", (d) => d.y - 20)
    .classed("hide", (d) => d.data.child == undefined)
    .on("mousedown", (_e, d) => {
      // console.log("mousedown", e, d)
      d3.select("#details")
        .style("visibility", "visible")
        .html(() => {
          if (d.data.spouse != undefined) return `Spouse: ${d.data.spouse}`
          else return "No Spouse"
        })
    })
    .on("mouseup", (_e, _d) => {
      // console.log("mouseup", e, d)
      d3.select("#details").style("visibility", "hidden")
    })

  const spouseRectangles = svg.append("g").selectAll("rect").data(information.descendants())
  spouseRectangles
    .enter()
    .append("rect")
    .attr("x", (d) => d.x + (40 + 20))
    .attr("y", (d) => d.y - 20)
    .classed("hide", (d) => d.data.spouse == undefined)

  const names = svg.append("g").selectAll("text").data(information.descendants())
  names
    .enter()
    .append("text")
    .text((d) => d.data.child)
    .attr("x", (d) => d.x - 20)
    .attr("y", (d) => d.y)
    .classed("bigger", true)

  const spouseNames = svg.append("g").selectAll("text").data(information.descendants())
  spouseNames
    .enter()
    .append("text")
    .text((d) => d.data.spouse)
    .attr("x", (d) => d.x + (80 + 20))
    .attr("y", (d) => d.y)
    .classed("bigger", true)
}
