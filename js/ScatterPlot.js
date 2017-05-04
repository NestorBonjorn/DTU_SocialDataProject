//Scatter plot variables
var w = 800;
var h = 500;
var xpadding = 70;
var ypadding = 100;
var Rmin = 4;
var Rmax = 9;
var dataset2003;
var dataset2015;
var dataset;
var datasetLegend = [];
var dots_labels = true;

//Create SVG element
var svgPlot = d3.select("#plotSection .svg-div")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
			
// Append buttons
d3.select("#plotSection .button-div").append("button")
.attr("class", "button")
.attr("id", "2003Button")
.style("background-color", "rgb(255, 127, 14)")
.text("2003");

d3.select("#plotSection .button-div").append("button")
.attr("class", "button")
.attr("id", "2015Button")
.style("background-color", "rgb(23, 190, 207)")
.text("2015");

d3.select("#plotSection .button-div").append("button")
.attr("class", "button")
.attr("id", "labelButton")
.style("background-color", "rgb(214, 39, 40)")
.text("Show/hide labels");
	
			
//Load 2003 dataset
d3.csv("Datasets/data2003.csv", function(data) {
	dataset2003 = data;
	
	//Generate dataset for the legend visualization
	for (i=0; i<dataset2003.length; i++) {
		datasetLegend.push(i);
	}
	
	//Load 2003 dataset
	d3.csv("Datasets/data2015.csv", function(data) {
		dataset2015 = data;    
		code();
	});
});

function code(){
	//Create scale functions
	//X-axis scale
	var xScale = d3.scale.linear()
			   //.domain([d3.min(dataset, function(d) { return parseInt(d["Prostitution"]);   }), 
			   .domain([0, 
				1.05*d3.max([d3.max(dataset2003, function(d) { return parseInt(d["Prostitution"]);   }), 
				d3.max(dataset2015, function(d) { return parseInt(d["Prostitution"]);   })])])
			   .range([xpadding, w-xpadding*3]);
	
	//Y-axis scale
	var yScale = d3.scale.linear()
			   //.domain([d3.min(dataset, function(d) { return parseInt(d["Vehicle_theft"]);   }), 
			   .domain([0, 
				1.05*d3.max([d3.max(dataset2003, function(d) { return parseInt(d["Vehicle_theft"]);   }), 
				d3.max(dataset2015, function(d) { return parseInt(d["Vehicle_theft"]);   })])])
			   .range([h-ypadding, ypadding]);

	//Dots radius scale
	var rScale = d3.scale.linear()
			   .domain([d3.min([d3.min(dataset2003, function(d) { return parseInt(d["Total_crime"]);   }), 
			   d3.min(dataset2015, function(d) { return parseInt(d["Total_crime"]);   })]), 
				d3.max([d3.max(dataset2003, function(d) { return parseInt(d["Total_crime"]);   }), 
				d3.max(dataset2015, function(d) { return parseInt(d["Total_crime"]);   })])])
			   .range([Rmin, Rmax]);
		
	//Legend scale
	var legendScale = d3.scale.linear()
						.domain([0,9])
						.range([ypadding + 10, h-ypadding-10]);
						
	//Colors scale
	var colors = d3.scale.category10();
				   
	//Define X axis
	var xAxis = d3.svg.axis()
					  .scale(xScale)
					  .orient("bottom")
					  .ticks(5);
					  
	//Define Y axis
	var yAxis = d3.svg.axis()
					  .scale(yScale)
					  .orient("left")
					  .ticks(5);
				 
	// Define the div for the tooltip
	var div = d3.select("#plotSection .svg-div").append("div")	
		.attr("class", "tooltip")				
		.style("opacity", 0);

	//Define clipping path
	svgPlot.append("clipPath")
		.attr("id", "chart-area")
		.append("rect")
		.attr("x", xpadding)
		.attr("y", ypadding)
		.attr("width", w - xpadding * 2)
		.attr("height", h - ypadding * 2);

	//Create circles
	svgPlot.append("g")
	   .attr("id", "circles")
	   .attr("clip-path", "url(#chart-area)")
	   .selectAll("circle")
	   .data(dataset2003)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
		  return xScale(parseInt(d["Prostitution"]));
	   })
	   .attr("cy", function(d) {
		  return yScale(parseInt(d["Vehicle_theft"]));
	   })
	   .attr("r", function(d) {
		  return rScale(parseInt(d["Total_crime"]));

	   })
	   .style("fill", function(d, i) {
		  return colors(i);
	   })
	   .style("opacity", 0.9)
	   .on("mouseover", function(d) {
			
			//Increase the dots size
			d3.select(this)
			  .attr("r", "11px");
			
			//Get this bar's x/y values, then augment for the tooltip
			var xPosition = d3.event.pageX + 5;
			var yPosition = d3.event.pageY - 100;

			//Update the tooltip position and value
			d3.select("#tooltipDistrict")
				.style("left", xPosition + "px")
				.style("top", yPosition + "px")						
				.select("#district")
				.text(d["District"]);
				
			d3.select("#tooltipDistrict")
				.select("#totalCrime")
				.text(d["Total_crime"]);
				
			d3.select("#tooltipDistrict")
				.select("#prostitutionCrime")
				.text(d["Prostitution"]);
				
			d3.select("#tooltipDistrict")
				.select("#vehicleCrime")
				.text(d["Vehicle_theft"]);
	   
			//Show the tooltip
			d3.select("#tooltipDistrict").classed("hidden", false);

	   })
	   .on("mouseout", function() {
			
			//Return the dots to the original size
			d3.select(this)
			  .transition()
			  .duration(500)
			  .attr("r", function(d) {
				  return rScale(parseInt(d["Total_crime"]));
			  })
			  
			//Hide the tooltip
			d3.select("#tooltipDistrict").classed("hidden", true);
			
	   });
	
	//Create labels
	svgPlot.selectAll("text")
	   .data(dataset2003)
	   .enter()
	   .append("text")
	   .text(function(d) {
		  return d["District"];
	   })
	   .attr("x", function(d) {
		  return xScale(parseInt(d["Prostitution"]));
	   })
	   .attr("y", function(d) {
		  return yScale(parseInt(d["Vehicle_theft"]));
	   })
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "11px")
	   .attr("fill", "black")
	   .attr("opacity", 1);
	   
	//Create dots labels legend
	svgPlot.append("g")
	   .selectAll("circle")
	   .data(datasetLegend)
	   .enter()
	   .append("circle")
	   .attr("cx", w-xpadding*2)
	   .attr("cy", function(d, i) {
		  return legendScale(d);
	   })
	   .attr("r", 8)
	   .style("fill", function(d, i) {
		  return colors(i);
	   })
	   .attr("opacity", 1);
	   
	//Create X axis
	svgPlot.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + (h - ypadding) + ")")
		.call(xAxis);
	
	//Create Y axis
	svgPlot.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + xpadding + ",0)")
		.call(yAxis);
		
	// Add title to the plot
	svgPlot.append("text")
		.attr("text-anchor", "middle") 
		.attr("transform", "translate("+ (w/2*0.85) +"," + ypadding/2 + ")")
		.attr("font-size", "22px")
		.attr("font-weight", "bold")
		.attr("id", "plot_title")
		.text("San Francisco crimes per district (2003)");
	
	// Add titles to the axes
	svgPlot.append("text")
		.attr("text-anchor", "middle")
		.attr("transform", "translate("+ (xpadding/5) +","+(h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
		.text("Vehicle-theft crimes");

	svgPlot.append("text")
		.attr("text-anchor", "middle")
		.attr("transform", "translate("+ (w/2*0.85) +","+(h-(ypadding/2))+")")  // centre below axis
		.text("Prostitution crimes");
		
	//On click (button), update with new data			
	d3.select("#plotSection").selectAll("button")
		.on("click", function() {
			
			//See which button was clicked
			buttonID = d3.select(this).attr("id");
			
			//Scatter plot buttons
			if (buttonID == "2003Button") {
				// 2003 data
				dataset = dataset2003;
				d3.select("#plot_title")
				  .text("San Francisco crimes per district (2003)");
				  
			} else if (buttonID == "2015Button") {
				// 2015 data
				dataset = dataset2015;
				d3.select("#plot_title")
				  .text("San Francisco crimes per district (2015)");
				  
			} else if (buttonID == "labelButton") {
				
				if (dots_labels == true) {
				
					if (dataset == null) {
						dataset = dataset2003;
					} 
					
					//Change the color of the button
					d3.select(this).style("background-color", "#4CAF50");
					
					//Create labels
					svgPlot.selectAll("text")
					   .data(dataset)
					   .transition()
					   .duration(1000)
					   .attr("x", w-xpadding*2+15)
					   .attr("y", function(d, i) {
							//return (i/datasetLegend.length*0.7*h + (h*0.15));
							return legendScale(i)+4;
					   })
					   .attr("opacity", 1);
					
					dots_labels = false;
				} 
				else if (dots_labels == false) {
				
					if (dataset == null) {
						dataset = dataset2003;
					} 
					
					//Change the color of the button
					d3.select(this).style("background-color", "rgb(214, 39, 40)");
					
					//Create labels
					svgPlot.selectAll("text")
					   .data(dataset)
					   .transition()
					   .duration(1000)
					   .attr("x", function(d) {
						  return xScale(parseInt(d["Prostitution"]));
					   })
					   .attr("y", function(d) {
						  return yScale(parseInt(d["Vehicle_theft"]));
					   })
					   .attr("opacity", 1);
					
					dots_labels = true;
				}
				
			}
			
			if (dataset == null) {
				dataset = dataset2003;
			}

			//Update all circles from scatter plot
			svgPlot.selectAll("circle")
			   .data(dataset)
			   .transition()
			   .duration(1000)
			   //Create circles
			   .attr("cx", function(d) {
				  return xScale(parseInt(d["Prostitution"]));
			   })
			   .attr("cy", function(d) {
				  return yScale(parseInt(d["Vehicle_theft"]));
			   })
			   .attr("r", function(d) {
				  return rScale(parseInt(d["Total_crime"]));
			   });
			   
			if (dots_labels == true) {
				//Create labels
				svgPlot.selectAll("text")
				   .data(dataset)
				   .transition()
				   .duration(1000)
				   .text(function(d) {
					  return d["District"];
				   })
				   .attr("x", function(d) {
					  return xScale(parseInt(d["Prostitution"]));
				   })
				   .attr("y", function(d) {
					  return yScale(parseInt(d["Vehicle_theft"]));
				   })
				   .attr("opacity", 1);
			}
		});
}
