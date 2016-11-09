import { getMembersData } from './getMembersData';

export function plotMembers(vis) {
  /* semantic zoom for members of clusters */
  const zoomLevel = vis.zoomBeh.scale();
  const zoomXDomain = vis.zoomBeh.x().domain();
  const zoomYDomain = vis.zoomBeh.y().domain();
  // const zoomThreshold = 31.8;

  console.log('zoomLevel', zoomLevel);
  console.log('zoomXDomain', zoomXDomain);
  console.log('zoomYDomain', zoomYDomain);

  // find the subset of exemplar points that we can see at the current zoom level
  vis.exemplarPointsVisible = vis.exemplarData.filter(d => {
    const xWithin = d[vis.xCat] > zoomXDomain[0] && d[vis.xCat] < zoomXDomain[1];
    const yWithin = d[vis.yCat] > zoomYDomain[0] && d[vis.yCat] < zoomYDomain[1];
    return xWithin && yWithin;
  });

  if (vis.exemplarPointsVisible.length <= 4) {
    console.log('vis.exemplarPointsVisible', vis.exemplarPointsVisible);
  }
  console.log('vis.exemplarPointsVisible.length', vis.exemplarPointsVisible.length);

  // get the data and show the member points
  if (vis.exemplarPointsVisible.length === 1) {
    console.log('//');
    console.log('// plotting members of the current point');
    console.log('//');
    getMembersData(vis);
  }

  // hide the member points
  if (vis.exemplarPointsVisible.length > 1) {
    if (d3.selectAll('g.detailDot')[0].length > 0) {
      d3.selectAll('g.detailDot').transition()
        .duration(500)
        .style('stroke-opacity', 0)
        .style('fill-opacity', 0)
        .remove();
    }
  }
}
