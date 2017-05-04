//Width and height
var wDistrict = 800;
var hDistrict = 400;
var xpaddingDistrict = 70;
var ypaddingDistrict = 50;
var neighbourhoods = ["BRONX", "BROOKLYN", "STATEN ISLAND", "MANHATTAN", "QUEENS"];
var accidents_by_neighbourhood = [];
var accidents_by_neighbourhood_area = [];
var accidents_by_neighbourhood_population = [];
var datasetDistrict = [];
var xScaleDistrict, yScaleDistrict, svgBarPlot, yAxisDistrict, yScaleAxis;
var xPositionDistrict, yPositionDistrict;

//Create SVG element
svgBarPlot = d3.select("#barPlotSection .svg-div")
			.append("svg")
			.attr("width", wDistrict)
			.attr("height", hDistrict);


var div = d3.select("#barPlotSection .hidden").append("div")		
.attr("class", "tooltip")				
.style("opacity", 0);

d3.csv("Datasets/accidents_by_neighbourhood.csv", function(data) {
	i = 0
	for(var key in data[0]){
		accidents_by_neighbourhood[i] = parseFloat(data[0][key]);
		i++;
	}
	i = 0
	for(var key in data[1]){
		accidents_by_neighbourhood_population[i] =parseFloat(data[1][key]);
		i++;
	}
	i = 0
	for(var key in data[2]){
		accidents_by_neighbourhood_area[i] = parseFloat(data[2][key]);
		i++;
	}
	datasetDistrict = accidents_by_neighbourhood;
	
	xScaleDistrict = d3.scale.ordinal()
	.domain(d3.range(datasetDistrict.length))
	.rangeRoundBands([xpaddingDistrict, wDistrict - xpaddingDistrict * 2], 0.05);
	
	yScaleDistrict = d3.scale.linear()
	.domain([0, 1.1*d3.max(datasetDistrict)])
	.range([ypaddingDistrict, hDistrict-ypaddingDistrict]);

	yScaleAxisDistrict = d3.scale.linear()
	.domain([0, 1.1*d3.max(datasetDistrict)])
	.range([hDistrict - ypaddingDistrict, ypaddingDistrict]);

	yAxisDistrict = d3.svg.axis()
	.scale(yScaleAxisDistrict)
	.orient("left")
	.ticks(5);

	//Create bars
	svgBarPlot.selectAll("rect")
	.data(datasetDistrict)
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
		return xScaleDistrict(i);
	})
	.attr("y", function(d) {
		return hDistrict - yScaleDistrict(d);
	})
	.attr("width", xScaleDistrict.rangeBand())
	.attr("height", function(d) {
		return yScaleDistrict(d)-ypaddingDistrict;
	})
	.attr("fill", "rgb(0,116,183)")
	.on("mouseover", function(d){
		xPositionDistrict = d3.event.pageX;
		yPositionDistrict = d3.event.pageY;
		d3.select("#tooltipDistrict")
		//.style("left", xPositionDistrict + "px")
		//.style("top", yPositionDistrict + "px")
		.style("left", xPositionDistrict + "px")
		.style("top", yPositionDistrict-540 + "px")
		.select("#value")
		.text(parseFloat(Math.round(d * 100) / 100).toFixed(2));
		d3.select("#tooltipDistrict").classed("hidden", false);
	})
	.on("mouseout", function(){
		d3.select("#tooltipDistrict").classed("hidden", true);
	});
	//Create labels
	svgBarPlot.selectAll("text")
	.data(neighbourhoods)
	.enter()
	.append("text")
	.text(function(d) {
		return d;
	})
	.attr("text-anchor", "middle")
	.attr("x", function(d, i) {
		return xScaleDistrict(i) + xScaleDistrict.rangeBand() / 2;
	})
	.attr("y", function(d,i) {
		return hDistrict - yScaleDistrict(datasetDistrict[i]) + 14;
	})
	.attr("font-family", "sans-serif")
	.attr("font-size", "11px")
	.attr("fill", "white");   

	svgBarPlot.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + xpaddingDistrict + ",0)")
	.call(yAxisDistrict);

	svgBarPlot.append("text")
	.attr("class", "title")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (wDistrict/2*0.9) +"," + ypaddingDistrict/2 + ")")
	.attr("font-size", "18px")
	.attr("font-weight", "bold")
	.attr("id", "plot_title")
	.text("Accidents/district/year");

	svgBarPlot.append("text")
	.attr("class", "yaxis")
	.attr("text-anchor", "middle")
	.attr("font-size", "12px")
	.attr("transform", "translate("+ (xpaddingDistrict/5) +","+(hDistrict/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
	.text("Accidents average");

});

function button_clicked() {
	var casDistrict = "";
	if(document.getElementById("radioDistrict1").checked){
		datasetDistrict = accidents_by_neighbourhood;
	}
	else if(document.getElementById("radioDistrict2").checked){
		datasetDistrict = accidents_by_neighbourhood_population;
		casDistrict = "/person";
	}
	else if(document.getElementById("radioDistrict3").checked){
		datasetDistrict = accidents_by_neighbourhood_area;
		casDistrict = "/km²";
	}

	yScaleDistrict.domain([0, 1.1*d3.max(datasetDistrict)]);
	yScaleAxisDistrict.domain([0, 1.1*d3.max(datasetDistrict)]);

	svgBarPlot.selectAll("rect")
	.data(datasetDistrict)
	.transition()
	.delay(function(d, i) {
		return i / datasetDistrict.length * 1000;
	})
	.duration(500)
	.attr("y", function(d) {
		return hDistrict - yScaleDistrict(d);
	})
	.attr("height", function(d) {
		return yScaleDistrict(d)-ypaddingDistrict;
	})

	svgBarPlot.selectAll("text")
	.data(neighbourhoods)
	.transition()
	.delay(function(d, i) {
		return i / neighbourhoods.length * 1000;
	})
	.duration(500)
	.text(function(d) {
		return d;
	})
	.attr("x", function(d, i) {
		return xScaleDistrict(i) + xScaleDistrict.rangeBand() / 2;
	})
	.attr("y", function(d,i) {
		return hDistrict - yScaleDistrict(datasetDistrict[i]) + 14;
	});

	//Update Y axis
	svgBarPlot.select(".y.axis")
	.transition()
	.duration(1000)
	.call(yAxisDistrict);

	svgBarPlot.select(".title")
	.text("Accidents/district/year" + casDistrict);
}