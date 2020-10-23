// graph library
import * as d3 from "https://deno.land/x/d3_4_deno@v6.2.0.6/src/mod.js";
// https://observablehq.com/@d3/line-chart
// https://www.d3-graph-gallery.com/graph/line_basic.html

var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("output#graph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(
  "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
)
  .then((data) => {
    const minDate = data[0].date;
    const maxDate = data[data.length - 1].date;
    // Add X axis --> it is a date format
    var x = d3.scaleTime([minDate, maxDate]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")

    const valueIter = {
      *[Symbol.iterator](d:any) {
        for (let i = 0; i < d.length; i++) {
          yield d[i];
        }
      }
    }
    // const maxValue = d3.max(data)
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([
        0,
        100,
      ])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
  });

//Read the data
// d3.csv(
//   ,
//   // When reading the csv, I must format variables:
//   function (d:any) {
//     console.log(d);
//     return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value };
//   },
//   // Now I can use this dataset:
//   function (data) {
//     console.log(data);

//   },
// );
