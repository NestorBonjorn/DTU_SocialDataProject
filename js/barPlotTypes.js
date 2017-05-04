//Width and height
var wTypes = 800;
var hTypes = 400;
var paddingTypes = 70;
var years = ["2012", "2013", "2014", "2015", "2016"];
var accidents_no_injuries = [];
var accidents_injuries = [];
var accidents_death = [];
var accidents_total = [];
var datasetTypes = [];
var xScaleTypes, yScaleTypes, svgTypes, types_legend;
var dataset_types = [];
var curr_no_injuries = accidents_no_injuries;
var curr_injuries = accidents_injuries;
var curr_death = accidents_death;
var types_legend = [0,1,2];
var colors_types = ["rgb(50,205,50)", "rgb(218,165,32)", "rgb(178,34,34)"];
var accident_types = ["No injuries", "Injuries", "Deaths"]
d3.csv("Datasets/accidents_with_type_year.csv", function(data) {
	i = 0;
	for(var key in data[0]){
		accidents_no_injuries[i] = parseInt(data[0][key]);
		i++;
	}
	i = 0;
	for(var key in data[1]){
		accidents_injuries[i] =parseInt(data[1][key]);
		i++;
	}
	i = 0;
	for(var key in data[2]){
		accidents_death[i] = parseInt(data[2][key]);
		i++;
	}
	i = 0;
	for(var key in data[2]){
		accidents_total[i] = parseInt(data[3][key]);
		i++;
	}

	datasetTypes = accidents_total;

	var div = d3.select("#barPlotTypesSection .svg-div").append("div")	
	.attr("class", "tooltip")				
	.style("opacity", 0);

	//Create SVG element
	svgTypes = d3.select("#barPlotTypesSection .svg-div")
	.append("svg")
	.attr("width", wTypes)
	.attr("height", hTypes);

	plot_bars();   				
});

function total_clicked(){
	d3.select("#acc_types").classed("show", false);
	svgTypes.selectAll("rect").remove();
	svgTypes.selectAll("text").remove();
	svgTypes.selectAll("g").remove();

	plot_bars();
}
function types_clicked(){
	d3.select("#acc_types").classed("show", true);
	dataset_types = zip(curr_no_injuries, curr_injuries, curr_death);

	svgTypes.selectAll("rect").remove();
	svgTypes.selectAll("text").remove();
	svgTypes.selectAll("g").remove();

	plot_bars_types();		

}
function no_injuries_clicked() {
	if(document.getElementById('chk1').checked){
		curr_no_injuries = accidents_no_injuries;
	}
	else
		curr_no_injuries = new Array(curr_no_injuries.length).fill(0);
	dataset_types = zip(curr_no_injuries, curr_injuries, curr_death);
	update_types();

}
function injuries_clicked() {
	if(document.getElementById('chk2').checked){
		curr_injuries = accidents_injuries;
	}
	else
		curr_injuries = new Array(curr_injuries.length).fill(0);
	dataset_types = zip(curr_no_injuries, curr_injuries, curr_death);
	update_types();
}
function deaths_clicked() {
	if(document.getElementById('chk3').checked){
		curr_death = accidents_death;
	}
	else
		curr_death = new Array(curr_death.length).fill(0);
	dataset_types = zip(curr_no_injuries, curr_injuries, curr_death);
	update_types();
}
function zip(a,b,c) {
	var joint_array = new Array(a.length+b.length+c.length).fill(0)
	var a_i = 0;
	var b_i = 0;
	var c_i = 0;
	for (var i = 0; i<joint_array.length; i++) {
		if (i%3 == 0){
			joint_array[i] = a[a_i];
			a_i++;
		}
		else if (i%3 == 1){
			joint_array[i] = b[b_i];
			b_i++;
		}
		else{
			joint_array[i] = c[c_i];
			c_i++;
		}
	}
	return joint_array;
}

function update_types() {

	yScaleTypes.domain([0, 1.1*d3.max(dataset_types)]);
	yScaleAxisTypes.domain([0, 1.1*d3.max(dataset_types)]);
	svgTypes.selectAll("rect")
	.data(dataset_types)
	.transition()
	.delay(function(d, i) {
		return i / dataset_types.length * 1000;
	})
	.duration(500)
	.attr("y", function(d) {
		return hTypes - yScaleTypes(d);
	})
	.attr("height", function(d) {
		return yScaleTypes(d)-paddingTypes;
	})

	//Update Y axis
	svgTypes.select(".y.axis")
	.transition()
	.duration(1000)
	.call(yAxisTypes);
}
function plot_bars(){
	xScaleTypes = d3.scale.ordinal()
	.domain(d3.range(datasetTypes.length))
	.rangeRoundBands([paddingTypes, wTypes - paddingTypes * 2], 0.05);

	xScaleAxisTypes = d3.scale.ordinal()
	.domain([2012,2013,2014,2015,2016])
	.rangeRoundBands([paddingTypes, wTypes - paddingTypes * 2], 0.05);

	xAxisTypes = d3.svg.axis()
	.scale(xScaleAxisTypes)
	.orient("bottom")
	.ticks(5);

	yScaleTypes = d3.scale.linear()
	.domain([0, 1.1*d3.max(datasetTypes)])
	.range([paddingTypes, hTypes-paddingTypes]);

	yScaleAxisTypes = d3.scale.linear()
	.domain([0, 1.1*d3.max(datasetTypes)])
	.range([hTypes - paddingTypes, paddingTypes]);

	yAxisTypes = d3.svg.axis()
	.scale(yScaleAxisTypes)
	.orient("left")
	.ticks(5);

	svgTypes.selectAll("rect")
	.data(datasetTypes)
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
		return xScaleTypes(i);
	})
	.attr("y", function(d) {
		return hTypes - yScaleTypes(d);
	})
	.attr("width", xScaleTypes.rangeBand())
	.attr("height", function(d) {
		return yScaleTypes(d) - paddingTypes;
	})
	.attr("fill", "rgb(0,116,183)")
	.on("mouseover", function(d){
		var xPosition = d3.event.pageX + 5;
		var yPosition = d3.event.pageY - 100;
		d3.select("#tooltipType")
		.style("left", xPosition + "px")
		.style("top", yPosition + "px")
		.select("#value")
		.text(d);
		d3.select("#tooltipType").classed("hidden", false);
	})
	.on("mouseout", function(){
		d3.select("#tooltipType").classed("hidden", true);
	});
	svgTypes.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (hTypes-paddingTypes) + ")")
	.call(xAxisTypes);

	svgTypes.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + paddingTypes + ",0)")
	.call(yAxisTypes);

	svgTypes.append("text")
	.attr("class", "title")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (wTypes/2*0.9) +"," + paddingTypes/2 + ")")
	.attr("font-size", "18px")
	.attr("font-weight", "bold")
	.attr("id", "plot_title")
	.text("Accidents/year");
	svgTypes.append("text")
	.attr("class", "yaxis")
	.attr("text-anchor", "middle")
	.attr("font-size", "12px")
	.attr("transform", "translate("+ (paddingTypes/5) +","+(hTypes/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
	.text("Accidents");
	svgTypes.append("text")
	.attr("text-anchor", "middle")
	.attr("transform", "translate("+ (wTypes/2*0.91) +","+(hTypes-(paddingTypes/2))+")")  // centre below axis
	.attr("font-size", "12px")
	.text("Year");

}

function plot_bars_types(){

	xScaleTypes = d3.scale.ordinal()
	.domain(d3.range(dataset_types.length))
	.rangeRoundBands([paddingTypes, wTypes - paddingTypes * 2], 0.1);

	xScaleAxis = d3.scale.ordinal()
	.domain([2012,2013,2014,2015,2016])
	.rangeRoundBands([paddingTypes, wTypes - paddingTypes * 2], 0.05);

	xAxisTypes = d3.svg.axis()
	.scale(xScaleAxisTypes)
	.orient("bottom")
	.ticks(5);

	yScaleTypes = d3.scale.linear()
	.domain([0, 1.1*d3.max(dataset_types)])
	.range([paddingTypes, hTypes-paddingTypes]);

	yScaleAxisTypes = d3.scale.linear()
	.domain([0, 1.1*d3.max(dataset_types)])
	.range([hTypes - paddingTypes, paddingTypes]);

	yAxisTypes = d3.svg.axis()
	.scale(yScaleAxisTypes)
	.orient("left")
	.ticks(5);


	svgTypes.selectAll("rect")
	.data(dataset_types)
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
		var width = xScaleTypes.rangeBand();
		var rest = i%3;
		if (rest == 0){
			pos = xScaleTypes(i);
			return pos;
		}
		else if(i%3 == 1){
			return pos + width;
		}
		else{
			return pos + 2*width;
		}
	})
	.attr("y", function(d) {
		return hTypes - yScaleTypes(d);
	})
	.attr("width", xScaleTypes.rangeBand())
	.attr("height", function(d) {
		return yScaleTypes(d)-paddingTypes;
	})
	.attr("fill", function(d,i){
		return colors_types[i%3];	
	})
	.on("mouseover", function(d){
		var xPosition = d3.event.pageX;
		var yPosition = d3.event.pageY;
		d3.select("#tooltipType")
		.style("left", xPosition + "px")
		.style("top", yPosition + "px")
		.select("#value")
		.text(d);
		d3.select("#tooltipType").classed("hidden", false);
	})
	.on("mouseout", function(){
		d3.select("#tooltipType").classed("hidden", true);
	});
	svgTypes.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (hTypes-paddingTypes) + ")")
	.call(xAxisTypes);

	svgTypes.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + paddingTypes + ",0)")
	.call(yAxisTypes);

	svgTypes.append("text")
	.attr("class", "title")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (wTypes/2*0.9) +"," + paddingTypes/2 + ")")
	.attr("font-size", "18px")
	.attr("font-weight", "bold")
	.attr("id", "plot_title")
	.text("Accidents/year according to their consequences");
	svgTypes.append("text")
	.attr("class", "yaxis")
	.attr("text-anchor", "middle")
	.attr("font-size", "12px")
	.attr("transform", "translate("+ (paddingTypes/5) +","+(hTypes/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
	.text("Accidents");
	svgTypes.append("text")
	.attr("text-anchor", "middle")
	.attr("transform", "translate("+ (wTypes/2*0.91) +","+(hTypes-(paddingTypes/2))+")")  // centre below axis
	.attr("font-size", "12px")
	.text("Year");

	types_legendScale = d3.scale.linear()
	.domain([0,2])
	.range([paddingTypes + 10, paddingTypes + 70]);

	svgTypes.append("g")
	.selectAll("rect")
	.data(types_legend)
	.enter()
	.append("rect")
	.attr("x", wTypes-paddingTypes*2)
	.attr("y", function(d){
		return types_legendScale(d);
	})
	.attr("width", 20)
	.attr("height",10)
	.style("fill", function(d,i){
		return colors_types[i];
	})
	.attr("opacity", 1);

	svgTypes.append("g")
	.selectAll("text")
	.data(accident_types)
	.enter()
	.append("text")
	.attr("x", wTypes-paddingTypes*2+25)
	.attr("y", function(d,i){
		return types_legendScale(i)+9;
	})
	.text(function(d) {
		return d;
	})
	.attr("font-size", "14px");
}