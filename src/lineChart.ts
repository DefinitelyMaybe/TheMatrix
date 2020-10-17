// graph library
import * as d3 from "https://deno.land/x/d3_4_deno@v6.2.0.1/src/mod.js";
// https://observablehq.com/@d3/line-chart

console.log(d3);

let width = 500
let height = 500

const margin = {
  top:20,
  bottom: 30,
  right:30,
  left:40
}

const svg = d3.select("output#graph")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("url", (d) => {
  return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
}, (data)=> {
  var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )
})