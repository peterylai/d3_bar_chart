var margin = {top: 20, right: 30, bottom: 30, left: 100},
    canvasW = 960 - margin.left - margin.right,
    canvasH = 500 - margin.top - margin.bottom;

var scaleY = d3.scale.linear().range([canvasH, 0]);

var chart = d3.select(".chart")
    .attr("width", canvasW + margin.left + margin.right)
    .attr("height", canvasH + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('../gross.csv')
  .row(function(d) { return {title: d.Title, year: d.Year, gross: +d.Gross}; })
  .get(function(error, data) { 

	var maxGross = d3.max(data, function(d) { return d.gross; })
	scaleY.domain([0, maxGross]);

	//Axis
	var yAxis = d3.svg.axis()
		.scale(scaleY)
		.orient("left");

	chart.append('g')
		.attr('class', 'axis')
		.call(yAxis);

	// Bars:
		var bars = chart.selectAll('rect')
			.data(data);

		bars
			.enter()
			.append('rect')
			.attr('y', canvasH)
			.attr('height', 0)

		bars
			.transition()
			.attr('x', function(d, i) { return i * (canvasW / data.length); })
			.attr('width', function(d, i) { return canvasW / data.length - 2; })
			.attr('y', function(d, i) { return scaleY(d.gross); })
			.attr('height', function(d) { return scaleY(0) - scaleY(d.gross); })
			.attr("fill", function(d) {
			    return "rgb(0, 0, " + (d.gross / maxGross) * 255 + ")";
			});

  });