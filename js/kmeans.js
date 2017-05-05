var w_kmeans = 600;
var h_kmeans = 550;
var xpadding_kmeans = 70;
var ypadding_kmeans = 70;
var colors_kmeans = ["deepskyblue", "rgb(255, 127, 14)", "blueviolet", "gold", "rgb(227, 119, 194)", "crimson"]

var svgKmeans = d3.select("#kmeansSection .svg-div")
.append("svg")
.attr("width", w_kmeans)
.attr("height", h_kmeans);

var circles, kmeans_points, kmeans_centers, layer1, labels, layer2; 

var i_kmeans = 0;

var projectionKmeans = d3.geo.mercator()
.center([-73.94, 40.70])
.scale(45000)
.translate([w_kmeans/2, h_kmeans/2]);

//Define path generator
var pathKmeans = d3.geo.path()
.projection(projectionKmeans);

d3.json("Datasets/nyc.geojson", function(json){
	svgKmeans.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", pathKmeans)
	.style("fill", "gainsboro")
	.style("stroke", "dimgray")
	.on("mouseover", function(d) {
		d3.select(this).style("fill", "darkgray")
	})
	.on("mouseout", function(d) {
		d3.select(this).style("fill", "gainsboro")
	});

	layer1 = svgKmeans.append('g')
	labels = svgKmeans.append('g')
	layer2 = svgKmeans.append('g');

//Add title to the plot
svgKmeans.append("text")
.attr("text-anchor", "middle")
.attr("transform", "translate("+ (w_kmeans/2*0.85) +"," + ypadding_kmeans/2 + ")")
.attr("font-size", "22px")
.attr("font-weight", "bold")
.attr("id", "kmeans_title")
.text("Showing K-means for K = 2")
.attr("font-family", "sans-serif");

d3.csv("Datasets/kmeans_10.csv", function(data) {
	
	kmeans_points = data;
	circles = layer1.selectAll("circle")
	.data(kmeans_points)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projectionKmeans([d.lon, d.lat])[0];
	})
	.attr("cy", function(d) {
		return projectionKmeans([d.lon, d.lat])[1];
	})
	/*.attr("r", function(d) {
		i_kmeans += 1;
		if ((i_kmeans%10)==0) {
			return 2;
		}
		else {
			return 0;
		}
	})*/
	.attr("r", 2)
	.attr("pointer-events", "none")
	.style("fill", function(d) {
		return colors_kmeans[parseInt(d.l2)];
	});

});
//Load kmeans centroides data
d3.csv("Datasets/centers.csv", function(centers){
	kmeans_centers = centers;
	centroids = layer2.selectAll("circle")
	.data(kmeans_centers)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projectionKmeans([d.lon, d.lat])[0];
	})
	.attr("cy", function(d) {
		return projectionKmeans([d.lon, d.lat])[1];
	})
	.attr("r", 8)
	.attr("pointer-events", "none")
	.style("stroke", "black")
	.style("fill", function(d){return colors_kmeans[d.color];})
	.style("fill-opacity", function(d){
		if (d.k == "2") {return "1";}
		else {return "0";}
	})
	.style("stroke-opacity", function(d){
		if (d.k == "2") {return "1";}
		else {return "0";}
	});

	//Add district names
	labels.selectAll("text")
	.data(json.features)
	.enter()
	.append("svg2:text")
	.text(function(d){
		return d.properties.BoroName.toUpperCase();
	})
	.attr("x", function(d){
		return pathKmeans.centroid(d)[0];
	})
	.attr("y", function(d){
		return  pathKmeans.centroid(d)[1];
	})
	.attr("text-anchor","middle")
	.attr("font-family", "sans-serif")
	.style("font-weight", "bold")
	.attr("fill", "dimgray")
	.attr("stroke", "lightgray")
	.attr("stroke-opacity", 0.5)
	.attr('font-size','10pt');

}); 


})
function kmeansclicked(){
//var buttonID_kmeans = d3.select(this).attr("id");
//d3.select('input[name="radioskmeans"]:checked').node().value;

var kmeans_selected = d3.select('input[name="radioskmeans"]:checked').node().value;
centroids = layer2.selectAll("circle")
.data(kmeans_centers)
.style("fill", function(d){return colors_kmeans[d.color];})
.style("fill-opacity", function(d){
	if (d.k == kmeans_selected) {return "1";}
	else {return "0";}
})
.style("stroke-opacity", function(d){
	if (d.k == kmeans_selected) {return "1";}
	else {return "0";}
});

circles = layer1.selectAll("circle")
.data(kmeans_points)
.style("fill", function(d) {
	return colors_kmeans[parseInt(d["l" + kmeans_selected])];
});
svgKmeans.select("#kmeans_title")
.text("Showing K-means for K = " + kmeans_selected);
}