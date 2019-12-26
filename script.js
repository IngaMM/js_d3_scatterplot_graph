const w = 1000;
const h = 1000;
const padding = 80;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then(function(data) {
  const time = data.map(d => d.Time);
  const year = data.map(d => d.Year);
  const doping = data.map(d => d.Doping === "");
  const dopingInfo = data.map(d => d.Doping);
  const name = data.map(d => d.Name);
  const nationality = data.map(d => d.Nationality);

  const timeInDateFormat = time.map(d => {
    return new Date(
      Date.UTC(1970, 0, 1, 0, d.substring(0, 2), d.substring(3, 5))
    );
  });

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(year) - 1, d3.max(year) + 1])
    .range([padding, w - padding]);
  const yScale = d3
    .scaleTime()
    .domain([d3.max(timeInDateFormat), d3.min(timeInDateFormat)])
    .range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  // append x-axis
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis.tickSizeOuter(0))
    .style("font-size", "15px");

  // append y-axis
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis.tickSizeOuter(0))
    .style("font-size", "15px");

  // label for x-axis
  svg
    .append("text")
    .attr("transform", "translate(" + w / 2 + " ," + (h - padding / 2) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Year");

  // label for y-axis
  svg
    .append("text")
    .attr("x", padding + 30)
    .attr("y", h / 2)
    .attr("transform", "rotate(-90," + (padding + 20) + "," + h / 2 + ")")
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Time");

  // append legend
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(" + (3 / 4) * w + " ," + h / 4 + ")")
    .attr("height", 100)
    .attr("width", 100);

  const colors = ["green", "red"];
  const legendText = ["No doping allegations", "Doping allegations"];

  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("x", 5)
    .attr("y", (d, i) => 5 + i * 25)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", d => d);

  legend
    .selectAll("text")
    .data(legendText)
    .enter()
    .append("text")
    .attr("x", 30)
    .attr("y", (d, i) => 20 + i * 25)
    .text(d => d);

  // circles for data
  svg
    .selectAll("circle")
    .data(year)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d))
    .attr("cy", (d, i) => yScale(timeInDateFormat[i]))
    .attr("r", 8)
    .attr("class", "dot")
    .attr("data-xvalue", d => d)
    .attr("data-yvalue", (d, i) => timeInDateFormat[i])
    .style("fill", (d, i) => (doping[i] ? "green" : "red"))
    .on("mouseover", function(d, i) {
      // add information box
      d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("left", xScale(d) + 20 + "px")
        .style("top", yScale(timeInDateFormat[i]) + 20 + "px")
        .attr("data-year", d)
        .html(name[i] + ", " + nationality[i] + "<br>" + dopingInfo[i])
        .style("pointer-events", "none");
    })
    .on("mouseout", function(d, i) {
      d3.select("#tooltip").remove();
    });
});
