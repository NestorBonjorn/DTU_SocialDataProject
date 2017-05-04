//Amplada (i alcada) grafic
var diameter = 900,
    formatBubble = d3.format(",d"),
    color_bubble = d3.scale.category10();
    //color = ["rgb(95,158,160)", "rgb(34,139,34)", "rgb(255,165,0)"]

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svgBubble = d3.select("#bubbleSection .svg-div").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");
    
var tooltipBubble = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");

d3.json("json/bubble.json", function(error, root) {
  
  var node = svgBubble.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color_bubble(d.packageName); })
      .on("mouseover", function(d) {
              tooltipBubble.text(d.className + ": " + formatBubble(d.value));
              tooltipBubble.style("visibility", "visible");
      })
      .on("mousemove", function() {
          return tooltipBubble.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){return tooltipBubble.style("visibility", "hidden");});

  node.append("text")
      .attr("dy", ".3em")
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .style("fill", "white")
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .text(function(d) { return d.className.substring(0, d.r / 3); });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");