//Width and height
var wMap = 650;
var hMap = 650;

//Create SVG element
var svgMap = d3.select("#mapSection .svg-div")
			.append("svg")
			.attr("width", wMap)
			.attr("height", hMap);

//Define map projection
var projection = d3.geo.mercator()
				.center([-73.94, 40.70])
				.scale(55000)
				.translate([wMap/2, hMap/2]);

//Define path generator
var path = d3.geo.path()
				 .projection(projection);

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