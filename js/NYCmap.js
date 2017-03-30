//Width and height
var w = 650;
var h = 650;

//Define map projection
var projection = d3.geo.mercator()
				.center([-73.94, 40.70])
				.scale(55000)
				.translate([w/2, h/2]);

//Define path generator
var path = d3.geo.path()
				 .projection(projection);

//Create SVG element
var svgMap = d3.select("#mapSection .svg-div")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

//Load in GeoJSON data
d3.json("Datasets/nyc.geojson", function(json) {
	
	//Bind data and create one path per GeoJSON feature
	svgMap.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill", "gainsboro")
		.style("stroke", "dimgray")
		.on("mouseover", function(d) {
			d3.select(this).style("fill", "grey")
		})
		.on("mouseout", function(d) {
			d3.select(this).style("fill", "gainsboro")
		});

});