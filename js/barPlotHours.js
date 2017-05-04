
//Width and height
var w = 800;
var h = 400;
var padding = 70;
var accidents_no_injuries_hw = [];
var accidents_injuries_hw = [];
var accidents_death_hw = [];
var accidents_no_injuries_hwe = [];
var accidents_injuries_hwe = [];
var accidents_death_hwe = [];
var xScale, yScale, svg;
var dataset_week = [];
var curr_no_injuries_h = [];
var curr_injuries_h = [];
var curr_death_h = [];
var hours_legend = [0,1]
var hour_types = ["Weekday", "Weekend"]
var colors_hours = ["rgb(0,116,183)", "rgb(255,165,0)"];
var accident_types = ["No injuries", "Injuries", "Deaths"]
var active_types = [];
d3.csv("Datasets/accidents_hour_types.csv", function(data) {
	accidents_no_injuries_hw = get_array(data[0]);
	accidents_injuries_hw = get_array(data[1]);
	accidents_death_hw = get_array(data[2]);
	accidents_no_injuries_hwe = get_array(data[3]);
	accidents_injuries_hwe = get_array(data[4]);
	accidents_death_hwe = get_array(data[5]);

	curr_no_injuries_h = zip2(accidents_no_injuries_hw, accidents_no_injuries_hwe);
	curr_injuries_h = zip2(accidents_injuries_hw, accidents_injuries_hwe);
	curr_death_h = zip2(accidents_death_hw, accidents_death_hwe);
	dataset_week = get_current_total_h();

	var div = d3.select("#barPlotHoursSection .svg-div").append("div")	
	.attr("class", "tooltip")				
	.style("opacity", 0);

	//Create SVG element
	svg = d3.select("#barPlotHoursSection .svg-div")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

	plot_bars_hours();   				
});

function no_injuries_selected() {
	if(document.getElementById('chkHours1').checked){
		curr_no_injuries_h = zip2(accidents_no_injuries_hw, accidents_no_injuries_hwe);
	}
	else
		curr_no_injuries_h = new Array(curr_no_injuries_h.length).fill(0);
	dataset_week = get_current_total_h();
	update_hours_types();
	
}
function injuries_selected() {
	if(document.getElementById('chkHours2').checked){
		curr_injuries_h = zip2(accidents_injuries_hw, accidents_injuries_hwe);
	}
	else
		curr_injuries_h = new Array(curr_injuries_h.length).fill(0);
	dataset_week = get_current_total_h();
	update_hours_types();
}
function deaths_selected() {
	if(document.getElementById('chkHours3').checked){
		curr_death_h = zip2(accidents_death_hw, accidents_death_hwe);
	}
	else
		curr_death_h = new Array(curr_death_h.length).fill(0);
	dataset_week = get_current_total_h();
	update_hours_types();
}
function zip2(a,b) {
	var joint_array = new Array(a.length+b.length).fill(0)
	var a_i = 0;
	var b_i = 0;
	for (var i = 0; i<joint_array.length; i++) {
		if (i%2 == 0){
			joint_array[i] = a[a_i];
			a_i++;
		}
		else{
			joint_array[i] = b[b_i];
			b_i++;
		}
	}
	return joint_array;
}

function update_hours_types() {
	
	yScale.domain([0, 1.1*d3.max(dataset_week)]);
	yScaleAxis.domain([0, 1.1*d3.max(dataset_week)]);
	svg.selectAll("rect")
	.data(dataset_week)
	.transition()
	.delay(function(d, i) {
		return i / dataset_week.length * 1000;
	})
	.duration(500)
	.attr("y", function(d) {
		return h - yScale(d);
	})
	.attr("height", function(d) {
		return yScale(d)-padding;
	})
	//Update Y axis
	svg.select(".y.axis")
	.transition()
	.duration(1000)
	.call(yAxis);
	//var active_types = [];
	active_types = [];
	for (var i = 0; i < accident_types.length; i++) {
		if(document.getElementById('chkHours' + (i+1)).checked){
			active_types.push(accident_types[i]);
		}
	}
	
	if(active_types.length < 3){
		if (active_types.length == 0){
			console.log(active_types.length)
			svg.select(".title_hour")
			.text("Please choose at least one button");
		}
		else {
			svg.select(".title_hour")
			.text("Accidents/hour (" + active_types.join(" + ")+ ")")
		}

	}
	else {
		svg.select(".title_hour")
		.text("Accidents/hour (Total)")
	}
	

}
function plot_bars_hours(){
	xScale = d3.scale.ordinal()
	.domain(d3.range(dataset_week.length))
	.rangeRoundBands([padding, w - padding * 2], 0.25);

	xScaleAxis = d3.scale.ordinal()
	.domain(d3.range(dataset_week.length/2))
	.rangeRoundBands([padding, w - padding * 2], 0.05);

	xAxis = d3.svg.axis()
	.scale(xScaleAxis)
	.orient("bottom")
	.ticks(5);

	yScale = d3.scale.linear()
	.domain([0, 1.1*d3.max(dataset_week)])
	.range([padding, h-padding]);

	yScaleAxis = d3.scale.linear()
	.domain([0, 1.1*d3.max(dataset_week)])
	.range([h - padding, padding]);

	yAxis = d3.svg.axis()
	.scale(yScaleAxis)
	.orient("left")
	.ticks(5);

	svg.selectAll("rect")
	.data(dataset_week)
	.enter()
	.append("rect")
	.attr("x", function(d, i) {
		var width = xScale.rangeBand();
		var rest = i%2;
		if (rest == 0){
			pos = xScale(i);
			return pos;
		}
		
		else{
			return pos + width;
		}
	})
	.attr("y", function(d) {
		return h - yScale(d);
	})
	.attr("width", xScale.rangeBand())
	.attr("height", function(d) {
		return yScale(d) - padding;
	})
	.attr("fill", function(d,i){

		return colors_hours[i%2];

	})
	.on("mouseover", function(d){
		var xPosition = d3.event.pageX + 5;
		var yPosition = d3.event.pageY - 100;
		d3.select("#tooltip")
		.style("left", xPosition + "px")
		.style("top", yPosition + "px")
		.select("#value")
		.text(parseFloat(Math.round(d * 100) / 100).toFixed(2));
		d3.select("#tooltip").classed("hidden", false);
	})
	.on("mouseout", function(){
		d3.select("#tooltip").classed("hidden", true);
	});
	
	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (h-padding) + ")")
	.call(xAxis);

	svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + padding + ",0)")
	.call(yAxis);

	svg.append("text")
	.attr("class", "title_hour")
	.attr("text-anchor", "middle") 
	.attr("transform", "translate("+ (w/2*0.9) +"," + padding/2 + ")")
	.attr("font-size", "18px")
	.attr("font-weight", "bold")
	.attr("id", "plot_title")
	.text("Accidents/hour (Total)");
	svg.append("text")
	.attr("class", "yaxis")
	.attr("text-anchor", "middle")
	.attr("font-size", "12px")
	.attr("transform", "translate("+ (padding/3) +","+(h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
	.text("Accidents/hour");
	svg.append("text")
	.attr("text-anchor", "middle")
	.attr("transform", "translate("+ (w/2*0.91) +","+(h-(padding/2))+")")  // centre below axis
	.attr("font-size", "12px")
	.text("Hour");

	var hours_legendScale = d3.scale.linear()
	.domain([0,1])
	.range([padding + 30, padding + 60]);

	svg.append("g")
	.selectAll("rect")
	.data(hours_legend)
	.enter()
	.append("rect")
	.attr("x", w-padding*2)
	.attr("y", function(d){
		return hours_legendScale(d);
	})
	.attr("width", 20)
	.attr("height",10)
	.style("fill", function(d,i){
		return colors_hours[i];
	})
	.attr("opacity", 1);

	svg.append("g")
	.selectAll("text")
	.data(hour_types)
	.enter()
	.append("text")
	.attr("x", w-padding*2+25)
	.attr("y", function(d,i){
		return hours_legendScale(i)+9;
	})
	.text(function(d) {
		return d;
	})
	.attr("font-size", "14px");

}
function get_current_total_h(){
	array = []
	for(var i = 0; i < curr_death_h.length; i++){
		array.push(curr_death_h[i] + curr_injuries_h[i]+curr_no_injuries_h[i]);
	}
	return array;
}
function get_array(row){
	array = [];
	i = 0;
	for(var key in row){
		array[i] = parseFloat(row[key]);
		i++;
	}
	return array;
}