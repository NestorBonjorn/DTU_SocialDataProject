var width_map = 960,
    height_map = 500;

var projection_map = d3.geo.mercator()
    .center([-73.94, 40.70])
	.scale(45000);

var path_map = d3.geo.path()
    .projection(projection_map);

var svg_map = d3.select("#mapClip .svg-div").append("svg")
    .attr("width", width_map)
    .attr("height", height_map);

var defs = svg_map.append("defs");

d3.json("Datasets/nyc_topo.json", function(error, topology) {
  if (error) throw error;

  defs.append("path")
      .attr("id", "land")
      //.datum(topojson.feature(topology, topology.objects.land))
      .datum(topojson.feature(topology, topology.objects.nyc_boroughs))
      //.datum(topology.features.properties.geometry)
      .attr("d", path_map)
      .style("fill", "gainsboro")
      .style("stroke", "#000")
      .style("stroke-width", .5);

  //es la clau, no esborrar
  defs.append("clipPath")
      .attr("id", "clip")
    .append("use")
      .attr("xlink:href", "#land");

  svg_map.append("use")
      .attr("xlink:href", "#land")
      .attr("class", "stroke");

 /*svg_map.append("g")
 .attr("clip-path", "url(#clip)")
 .append("circle")
 .attr("cx", projection_map([-73.94, 40.70])[0])
 .attr("cy",projection_map([-73.94, 40.70])[1])
 .attr("r", 150)
 .style("fill", "black");*/
});


d3.csv("Datasets/kmeans_10.csv", function(data) {
  
  kmeans_points = data;
  circles = svg_map.append("g")
  .attr("clip-path", "url(#clip)")
  .selectAll("circle")
  .data(kmeans_points)
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    return projection_map([d.lon, d.lat])[0];
  })
  .attr("cy", function(d) {
    return projection_map([d.lon, d.lat])[1];
  })
  /*.attr("r", function(d) {
    i_kmeans += 1;
    if ((i_kmeans%10)==0) {
      return 45;
    }
    else {
      return 0;
    }
  })*/
  .attr("r", 45)
  .attr("pointer-events", "none")
  .style("fill", "rgb(255, 127, 14)")
  .style("opacity", .015);

});