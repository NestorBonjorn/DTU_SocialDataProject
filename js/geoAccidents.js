//Width and height
var wMap = 800;
var hMap = 500;
var dataset_points = [];
var dataset_points_year = {"2012": [], "2013": [], "2014": [], "2015": [], "2016": []};
var yearVar = 2012;
var kindOfMapVar = 0;
var dataset_points_killed = []
var dataset_killed_year = {"2012": [], "2013": [], "2014": [], "2015": [], "2016": []};
var datasetLegendMap = ["Non-injured", "Injured", "Fatal"];

//Create SVG element
var svgMap = d3.select("#mapSection .svg-div")
.append("svg")
.attr("width", wMap)
.attr("height", hMap);

var map = svgMap.append('g');
var mapCircles = svgMap.append('g');
var mapKilled = svgMap.append('g');

//Define map projection
var projection = d3.geo.mercator()
.center([-73.94, 40.70])
.scale(45000)
.translate([wMap/2, hMap/2]);

//Define path generator
var path = d3.geo.path()
.projection(projection);

//Colors scale
var colors = ["rgb(44, 160, 44)", "rgb(255, 127, 14)", "rgb(214, 39, 40)"]

//Add title to the map
d3.select("#mapSection")
	.select("#MapTitle")
	.text("Accidents in " + yearVar + " (10%)");

//Legend scale
var legendScaleMap = d3.scale.linear()
					.domain([0,2])
					.range([80, 150]);

//Load in GeoJSON data
d3.json("Datasets/nyc.geojson", function(json) {
	

	//Bind data and create one path per GeoJSON feature
	map.selectAll("path")
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

	//Create dots labels legend
	map.append("g")
	   .selectAll("circle")
	   .data(datasetLegendMap)
	   .enter()
	   .append("circle")
	   .attr("cx", 170)
	   .attr("cy", function(d, i) {
		  	return legendScaleMap(i);
	   })
	   .attr("r", function(d, i) {
		  	if (i == 2) {
				return 10;
			}
			return parseInt(i)*2+2; 
	   })
	   .style("fill", function(d, i) {
		  	return colors[i];
	   });

	//Create legend text
	map.append("g")
	   .selectAll("text")
	   .data(datasetLegendMap)
	   .enter()
	   .append("text")
	   .text(function(d) {
		  return d;
	   })
	   .attr("x", 195)
	   .attr("y", function(d, i) {
			//return (i/datasetLegend.length*0.7*h + (h*0.15));
			return legendScaleMap(i)+5;
	   });


	d3.csv('Datasets/geoAccidentsNormLabel.csv', function(data) {
		dataset_points = data;
		for (var i = 0; i < dataset_points.length; i++) {
			if (dataset_points[i].year == 2012) {
				dataset_points_year["2012"].push(dataset_points[i]);
			}
			else if (dataset_points[i].year == 2013) {
				dataset_points_year["2013"].push(dataset_points[i]);
			}
			else if (dataset_points[i].year == 2014) {
				dataset_points_year["2014"].push(dataset_points[i]);
			}
			else if (dataset_points[i].year == 2015) {
				dataset_points_year["2015"].push(dataset_points[i]);
			}
			else if (dataset_points[i].year == 2016) {
				dataset_points_year["2016"].push(dataset_points[i]);
			}
		}
		dataset_points = dataset_points_year["2012"];
		mapCircles/*.append("g")
		.attr("clip-path", "url(#chart-area-map)")*/
		.selectAll("circles")
		.data(dataset_points_year["2012"])
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return projection([d.lon, d.lat])[0];
		})
		.attr("cy", function(d) {
			return projection([d.lon, d.lat])[1];
		})
		.attr("r", function(d) {
			if (d.label == 2) {
				return 10;
			}
			return parseInt(d.label)*2+2; 
		})
		.attr("pointer-events", "none")
		.style("fill", function(d) {
			return colors[parseInt(d.label)];
		})
		.attr("opacity", 0.8);
	});

	d3.csv('Datasets/geoAccidentsKilled.csv', function(data) {
		dataset_points_killed = data;
		for (var i = 0; i < dataset_points_killed.length; i++) {
			if (dataset_points_killed[i].year == 2012) {
				dataset_killed_year["2012"].push(dataset_points_killed[i]);
			}
			else if (dataset_points_killed[i].year == 2013) {
				dataset_killed_year["2013"].push(dataset_points_killed[i]);
			}
			else if (dataset_points_killed[i].year == 2014) {
				dataset_killed_year["2014"].push(dataset_points_killed[i]);
			}
			else if (dataset_points_killed[i].year == 2015) {
				dataset_killed_year["2015"].push(dataset_points_killed[i]);
			}
			else if (dataset_points_killed[i].year == 2016) {
				dataset_killed_year["2016"].push(dataset_points_killed[i]);
			}
		}
		dataset_points_killed = dataset_killed_year["2012"];
	});

});

//Switch map between years
function accidentsYearMap (year) {

	yearVar = year;

	if (kindOfMapVar == 0) {
		if (dataset_points != dataset_points_year[yearVar]) {

			dataset_points = dataset_points_year[yearVar];

			mapCircles.selectAll("circle")
			//.remove();
			.data(dataset_points)
			.transition()
			.duration(1000)
			.attr("cx", function(d) {
				return projection([d.lon, d.lat])[0];
			})
			.attr("cy", function(d) {
				return projection([d.lon, d.lat])[1];
			})
			.attr("r", function(d) {
				if (d.label == 2) {
					return 10;
				}
				return parseInt(d.label)*2+2; 
			})
			.style("fill", function(d) {
				return colors[parseInt(d.label)];
			})
			.attr("opacity", 0.8);
		}

	} else if (kindOfMapVar == 1) {

		if (dataset_points_killed != dataset_killed_year[yearVar]) {

			dataset_points_killed = dataset_killed_year[yearVar];
			mapKilled.selectAll("circle")
			.remove();

			mapKilled.selectAll("circle")
			.data(dataset_points_killed)
			.enter()
			.append('circle')
			.attr("cx", function(d) {
				return projection([d.lon, d.lat])[0];
			})
			.attr("cy", function(d) {
				return projection([d.lon, d.lat])[1];
			})
			.attr("r", 10)
			.attr("pointer-events", "none")
			.style("fill", colors[2])
			.attr("opacity", 0.8);

		}
	}

	//Change title to the map
	if (kindOfMapVar == 0) {
		d3.select("#mapSection")
		.select("#MapTitle")
		.text("Accidents in " + yearVar + " (10%)");
	} else {
		d3.select("#mapSection")
		.select("#MapTitle")
		.text("Fatal accidents in " + yearVar + " (100%)");
	}
}

//Switch map by kind of accidents
function kindOfMap (kind) {

	kindVar = kind;

	if (kind == "All") {

		if (kindOfMapVar == 1) {

			mapKilled.selectAll("circle")
			.remove();

			dataset_points = dataset_points_year[yearVar];
			mapCircles.selectAll("circle")
			.data(dataset_points)
			.enter()
			.append('circle')
			.attr("cx", function(d) {
				return projection([d.lon, d.lat])[0];
			})
			.attr("cy", function(d) {
				return projection([d.lon, d.lat])[1];
			})
			.attr("r", function(d) {
				if (d.label == 2) {
					return 10;
				}
				return parseInt(d.label)*2+2; 
			})
			.style("fill", function(d) {
				return colors[parseInt(d.label)];
			})
			.attr("pointer-events", "none")
			.attr("opacity", 0.8);
			
		}

		kindOfMapVar = 0;

	} else if (kind == "Fatal") {

		if (kindOfMapVar == 0) {

			mapCircles.selectAll("circle")
			.remove();

			dataset_points_killed = dataset_killed_year[yearVar];
			mapKilled.selectAll("circle")
			.data(dataset_points_killed)
			.enter()
			.append('circle')
			.attr("cx", function(d) {
				return projection([d.lon, d.lat])[0];
			})
			.attr("cy", function(d) {
				return projection([d.lon, d.lat])[1];
			})
			.attr("r", 10)
			.style("fill", function(d) {
				return colors[2];
			})
			.attr("pointer-events", "none")
			.attr("opacity", 0.8);
		}

		kindOfMapVar = 1;

	}

	//Change title to the map
	if (kindOfMapVar == 0) {
		d3.select("#mapSection")
		.select("#MapTitle")
		.text("Accidents in " + yearVar + " (10%)");
	} else {
		d3.select("#mapSection")
		.select("#MapTitle")
		.text("Fatal accidents in " + yearVar + " (100%)");
	}
	
	
}
