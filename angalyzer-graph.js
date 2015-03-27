// Code goes here
var otherdata = {
  "nodes":[
    {"name":"mainCtrl", "group":"1"},
    {"name":"factory1","group":"2"},
    {"name":"$http","group":"3"}], 
  
  "links":[
    {"source":0,"target":2,"value":1},
    {"source":1,"target":2,"value":2}
  ]
};

var angalyzer = new Angalyzer();
angalyzer.crawlApp();
var data = angalyzer.generateNodeMap();

var m = 10;
var color = d3.scale.category10()
    .domain(d3.range(m));  
  
var width = window.innerWidth,
    height = window.innerHeight*2;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .distance(width/6)
    .linkStrength(2)
    .charge(-2000)
    .size([width, height]);

// var nodes = data.nodes.slice(),
//       links = [],
//       bilinks = [];

//   data.links.forEach(function(link) {
//     var s = nodes[link.source],
//         t = nodes[link.target],
//         i = {}; // intermediate node
//     nodes.push(i);
//     links.push({source: s, target: i}, {source: i, target: t});
//     bilinks.push([s, i, t]);
//   });
  
  

force
.nodes(data.nodes)
.links(data.links)
.start();

  var link = svg.selectAll(".link")
      .data(data.links)
    .enter().append("line")
      .attr("class", "link");
  // var link = svg.selectAll(".link")
  //     .data(bilinks)
  //   .enter().append("path")
  //     .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(data.nodes)
    .enter().append('g');
    
    node
      .append('circle')
      .attr('class', 'node')
      .attr('r', 50)
      .attr('cx', 0)
      .attr('cy', 0)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);
    
    node.append("text")
      .attr("dx", -25)
      .attr("dy", 0)
      .text(function(d) { return d.name });
      



  force.on("tick", function(e) {
    var k = 6 * e.alpha;
    data.links.forEach(function(d, i) {
      d.source.y -= k;
      d.target.y += k;
    });

    // link.attr("d", function(d) {
    //   return "M" + d[0].x + "," + d[0].y
    //       + "S" + d[1].x + "," + d[1].y
    //       + " " + d[2].x + "," + d[2].y;
    // });
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });


