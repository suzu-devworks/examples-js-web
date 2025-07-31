/** Family Tree using D3.js (From D3.js Course) - Crypters Infotech.
 *
 * See also:
 *  - [Part 1](https://www.youtube.com/watch?v=DvqeaVSe6Ko)
 *  - [Part 2](https://www.youtube.com/watch?v=sIackqM0M3M)
 */
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const data = [
  { child: "John", parent: "" },
  { child: "Aaron", parent: "Kevin" },
  { child: "Kevin", parent: "John" },
  { child: "Hannah", parent: "Ann" },
  { child: "Rose", parent: "Sarah" },
  { child: "Ann", parent: "John" },
  { child: "Sarah", parent: "Kevin" },
  { child: "Mark", parent: "Ann" },
  { child: "Angel", parent: "Sarah" },
  { child: "Tom", parent: "Hannah" },
]

export function draw(container) {
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", 600)
    .attr("height", 450)
    .append("g")
    .attr("transform", "translate(50, 50)")

  const dataStructure = d3
    .stratify()
    .id((d) => d.child)
    .parentId((d) => d.parent)(data)

  const treeStructure = d3.tree().size([500, 300])
  const information = treeStructure(dataStructure)
  // console.log(information.descendants())
  // console.log(information.links())

  const circles = svg.append("g").selectAll("circle").data(information.descendants())
  circles
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 5)

  const connections = svg.append("g").selectAll("path").data(information.links())
  connections
    .enter()
    .append("path")
    .attr(
      "d",
      (d) =>
        `M${d.source.x},${d.source.y} ` +
        ` C ` +
        ` ${d.source.x},${(d.source.y + d.target.y) / 2}` +
        ` ${d.target.x},${(d.source.y + d.target.y) / 2}` +
        ` ${d.target.x},${d.target.y}`
    )

  const names = svg.append("g").selectAll("text").data(information.descendants())
  names
    .enter()
    .append("text")
    .text((d) => d.data.child)
    .attr("x", (d) => d.x + 7)
    .attr("y", (d) => d.y + 4)
}
