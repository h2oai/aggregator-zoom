var margin = { top: 50, right: 300, bottom: 50, left: 60 },
    outerWidth = 960 // 3648,
    outerHeight = 500 // 1900,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var rScale = d3.scale.linear()
  .range([
    0,
    3
  ])

var xCat = 'C10',
    yCat = 'C1',
    rCat = 'C2',
    colorCat = 'C3';

var fileName = 'members_exemplar0.csv'
d3.csv(fileName, function(data) {

  // TODO define this in terms of the max point radius
  var domainPaddingFactor = 0.1;

  var xMax = d3.max(data, function (d) { return +d[xCat]; });
  var xMin = d3.min(data, function (d) { return +d[xCat]; });
  var xExtent = xMax - xMin;
  var xDMax = xMax + (xExtent * domainPaddingFactor);
  var xDMin = xMin - (xExtent * domainPaddingFactor);

  var yMax = d3.max(data, function (d) { return +d[yCat]; });
  var yMin = d3.min(data, function (d) { return +d[yCat]; });
  var yExtent = yMax - yMin;
  var yDMax = yMax + (yExtent * domainPaddingFactor);
  var yDMin = yMin - (yExtent * domainPaddingFactor);



  x.domain([xDMin, xDMax]);
  y.domain([yDMin, yDMax]);

  console.log('x.domain()', x.domain());
  console.log('y.domain()', y.domain());

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function (d) {
        return xCat + ': ' + d[xCat] + '<br>' + yCat + ': ' + d[yCat];
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on('zoom', zoom)
      .on('zoomend', zoomend);

  var svg = d3.select('#scatter')
    .append('svg')
      .attr('width', outerWidth)
      .attr('height', outerHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoomBeh);

  svg.call(tip);

  svg.append('rect')
      .attr('width', width)
      .attr('height', height);

  svg.append('g')
      .classed('x axis', true)
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .append('text')
      .classed('label', true)
      .attr('x', width)
      .attr('y', margin.bottom - 10)
      .style('text-anchor', 'end')
      .text(xCat);

  svg.append('g')
      .classed('y axis', true)
      .call(yAxis)
    .append('text')
      .classed('label', true)
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(yCat);

  var objects = svg.append('svg')
      .classed('objects', true)
      .attr('width', width)
      .attr('height', height);

  objects.append('svg:line')
      .classed('axisLine hAxisLine', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', width)
      .attr('y2', 0)
      .attr('transform', 'translate(0,' + height + ')');

  objects.append('svg:line')
      .classed('axisLine vAxisLine', true)
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', height);

  var dots = objects.selectAll('.dot')
      .data(data)
    .enter().append('circle')
      .classed('dot', true)
      .attr('r', function (d) { 
        return 1 * Math.sqrt(rScale(d[rCat]) / Math.PI); 
      })
      .attr('transform', transform)
      .style('fill', function (d) { return color(d[colorCat]); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  dots.classed('aggregate', true);

  var legend = svg.selectAll('.legend')
      .data(color.domain())
    .enter().append('g')
      .classed('legend', true)
      .attr('transform', function (d, i) {
        return 'translate(0,' + i * 20 + ')';
      });

  legend.append('circle')
      .attr('r', 3.5)
      .attr('cx', width + 20)
      .attr('fill', color);

  legend.append('text')
      .attr('x', width + 26)
      .attr('dy', '.35em')
      .text(function (d) { return d; });

  /*
  var testRecord = data
    .filter(function (d) {
      return d.Potassium === 190 && d.Calories === 90;
    })
    
  var detailData = testRecord[0].values;
  console.log('testRecord', testRecord)
  console.log('detailData', detailData);
  */

/*
  function change() {
    xCat = 'Calories';
    xMax = d3.max(data, function (d) { return d[xCat]; });
    xMin = d3.min(data, function (d) { return d[xCat]; });

    zoomBeh
      .x(x.domain([xMin, xMax]))
      .y(y.domain([yMin, yMax]));

    var svg = d3.select('#scatter').transition();

    svg.select('.x.axis')
      .duration(750)
      .call(xAxis)
      .select('.label')
      .text(xCat);

    objects
      .selectAll('.dot')
      .transition()
      .duration(1000)
      .attr('transform', transform);
  }
*/
  function zoom() {
    svg.select('.x.axis').call(xAxis);
    svg.select('.y.axis').call(yAxis);

    svg.selectAll('.dot')
        .attr('transform', transform);

    var zoomLevel = zoomBeh.scale();
    var zoomThreshold = 4.620;

    console.log('zoomLevel', zoomLevel);
    if (zoomLevel > zoomThreshold) {
      if (d3.selectAll('.detailDot')[0].length === 0) {
        var detailDots = objects.selectAll('.detailDot')
          .data(detailData)
        .enter().append('circle')
          .classed('dot', true)
          .classed('detailDot', true)
          .attr('r', function (d) { 
            return 1 * Math.sqrt(rScale(d[rCat]) / Math.PI); 
          })
          .attr('transform', translateToAggregate)
          .style('fill', 'none')
          .style('stroke-opacity', 0)
          .style('stroke', function (d) { return color(d[colorCat]); })
          .style('stroke-width', function (d) { 
            return 3 * Math.sqrt(d[rCat] / Math.PI); 
          })
          
        detailDots.transition()
            .duration(2000)
            .attr('transform', transform)
            .style('stroke-opacity', 1);
         
        d3.selectAll('.detailDot') 
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
      }
    }

    if (zoomLevel < zoomThreshold) {
      if (d3.selectAll('.detailDot')[0].length > 0) {
        d3.selectAll('.detailDot').transition()
          .duration(2000)
          .attr('transform', translateToAggregate)
          .style('stroke-opacity', 0)
          .remove();
      }
      
    }
  }

  function zoomend() {
    
  }

  function transform(d) {
    return 'translate(' + x(d[xCat]) + ',' + y(d[yCat]) + ')';
  }

  function translateToAggregate (d) {
    return 'translate(' + 
      (x(testRecord[0][xCat])) + ',' +
      (y(testRecord[0][yCat])) +
    ')';
  }

  function translateFromAggregateToDetail (d) {
    return 'translate(' + 
      (x(d[xCat]) - x(testRecord[0][xCat])) + ',' +
      (y(d[yCat]) + y(testRecord[0][yCat])) +
    ')';
  }
});
