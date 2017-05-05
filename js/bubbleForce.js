//Based on https://bl.ocks.org/ctufts/f38ef0187f98c537d791d24fda4a6ef9

var widthForce = 960,
    heightForce = 800,
    paddingForce = 1.5, // separation between same-color nodes
    clusterPadding = 5, // separation between different-color nodes
    maxRadius = 0.05;
    r_factor = 1.2;

/*var colorForce = d3.scale.ordinal()
.range(["#7A99AC", "#E4002B", "#7FFFD4"]);*/


var colorForce = d3.scale.category10();

var tooltipForce = d3.select("body")
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

var buttonIDBubble = "radioBubble1";

var contador = 0;
var radis_total = [];
var datasetForce_total = [];
var radis_deaths = [];
var datasetForce_deaths = [];

var nodeForce;

var radioVar = true;

d3.text("Datasets/bubble_force2.csv", function(error, text) {
  if (error) throw error;
  var colNames = "text,size,group\n" + text;
  var dataForce = d3.csv.parse(colNames);

  dataForce.forEach(function(d) {
    d.size = +d.size;
});

    //Obtain the radius of the cercles (total dataset)
    datasetForce_total = text.split(",");
    for (var i = 0; i<datasetForce_total.length; i++) {
        if ((i-1)%2==0) {
            radis_total.push(parseFloat(datasetForce_total[i]));
        }
    }


//unique cluster/group id's
var cs = [];
dataForce.forEach(function(d){
    if(!cs.contains(d.group)) {
        cs.push(d.group);
    }
});

var n = dataForce.length, // total number of nodes
    m = cs.length; // number of distinct clusters

//create clusters and nodes
var clustersForce = new Array(m);
var nodesForce = [];
for (var i = 0; i<n; i++){
    nodesForce.push(create_nodes(dataForce,i));
}

var force = d3.layout.force()
.nodes(nodesForce)
.size([widthForce, heightForce])
.gravity(.01)
.charge(0)
.on("tick", tick)
.start();

var svgForce = d3.select("#bubbleForceSection .svg-div").append("svg")
.attr("width", widthForce)
.attr("height", heightForce);



d3.text("Datasets/bubble_force_deaths.csv", function(data) {


    //Obtain the radius of the cercles (deaths dataset)
    datasetForce_deaths = data.split(",");
    for (var i = 0; i<datasetForce_deaths.length; i++) {
        if ((i-1)%2==0) {
            radis_deaths.push(parseFloat(datasetForce_deaths[i]));
        }
    }
    
});


nodeForce = svgForce.selectAll("circle")
.data(nodesForce)
.enter().append("g").call(force.drag);


nodeForce.append("circle")
.style("fill", function (d) {
    return colorForce(d.cluster);
})
.attr("r", function(d){return (d.radius)})
.attr("stroke", "#565352")
.attr("stroke-width", 0)
.on("mouseover", function(d) {

    if (radioVar == true) {
        tooltipForce.text(d.text + ": " + Math.round(Math.pow((d.radius)/r_factor,2)*11));
    }
    else {
        tooltipForce.text(d.text + ": " + Math.round(Math.pow((d.radius)/r_factor,2)*0.0092));
    }
    tooltipForce.style("visibility", "visible");
})
.on("mousemove", function() {
  return tooltipForce.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
})
.on("mouseout", function(){return tooltipForce.style("visibility", "hidden");});


nodeForce.append("text")
.attr("dy", ".3em")
.style("text-anchor", "middle")
.attr("font-size", "12px")
.style("fill", "white")
.attr("font-family", "sans-serif")
.text(function(d) { return d.text.substring(0, d.radius / 3); });


function create_nodes(data,node_counter) {
  var i = cs.indexOf(dataForce[node_counter].group),
  r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
  d = {
    cluster: i,
    radius: data[node_counter].size*r_factor,
    text: data[node_counter].text,
    x: Math.cos(i / m * 2 * Math.PI) * 200 + widthForce / 2 + Math.random(),
    y: Math.sin(i / m * 2 * Math.PI) * 200 + heightForce / 2 + Math.random()
};
if (!clustersForce[i] || (r > clustersForce[i].radius)) clustersForce[i] = d;
return d;
};



function tick(e) {
    nodeForce.each(cluster(2 * e.alpha * e.alpha))
    .each(collide(.3))
    .attr("transform", function (d) {
        var k = "translate(" + d.x + "," + d.y + ")";
        return k;
    })

}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
    return function (d) {
        var cluster = clustersForce[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
        }
    };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodesForce);
    return function (d) {
        var r = d.radius + maxRadius + Math.max(paddingForce, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? paddingForce : clusterPadding);
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
    };
}
});

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

function button_total_bubble() {

    radioVar = true;

    nodeForce.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", function(d){
            d.radius=radis_total[contador]*r_factor;
            contador = contador + 1;
            return (d.radius)
        });

    nodeForce.selectAll("text")
    .transition()
    .duration(1000)
    .text(function(d) { 
        return d.text.substring(0, d.radius / 3); 
    });
    contador = 0;
}


function button_deaths_bubble() {

    radioVar = false;

    nodeForce.selectAll("circle")
        .transition()
        .duration(1000)
        .attr("r", function(d){
            d.radius=radis_deaths[contador]*r_factor;
            contador = contador + 1;
            return (d.radius)
        });

    nodeForce.selectAll("text")
    .transition()
    .duration(1000)
    .text(function(d) { 
        return d.text.substring(0, d.radius / 3); 
    });
    contador = 0;
}