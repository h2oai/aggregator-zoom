import { getFrameData } from './getFrameData';
import { parseAndPlot } from './parseAndPlot';
import dat from 'dat-gui';
import d3 from 'd3';
import d3_request from 'd3-request';
d3.request = d3_request.request;

import { worldCitiesConfig } from './config/worldCitiesConfig';
// import { coverTypeConfig } from './config/coverTypeConfig';
// import { grupoBimboGLMConfig } from './config/gruboBimboGLMConfig';
// import { pcaConfig } from './pcaConfig';

export function drawScatterplot() {
  const vis = {};
  vis.margin = { top: 50, right: 300, bottom: 50, left: 60 };
  vis.outerWidth = 960; // 3648
  vis.outerHeight = 500; // 1900
  vis.width = vis.outerWidth - vis.margin.left - vis.margin.right;
  vis.height = vis.outerHeight - vis.margin.top - vis.margin.bottom;

  vis.x = d3.scale.linear()
    .range([0, vis.width]).nice();

  vis.y = d3.scale.linear()
    .range([vis.height, 0]).nice();

  // const rScale = d3.scale.linear()
  //   .range([0, 3]);

  /* call API to get exemplar data */
  vis.apiConfig = worldCitiesConfig;

  vis.xCat = vis.apiConfig.defaultXVariable;
  vis.yCat = vis.apiConfig.defaultYVariable;
  vis.tooltipVariables = vis.apiConfig.tooltipVariables;
  // const rCat = 'C2';
  // const colorCat = 'C3';

  const server = vis.apiConfig.server;
  const port = vis.apiConfig.port;
  const exemplarsFrame = vis.apiConfig.exemplarFrame;
  const frameID = exemplarsFrame;
  const columnOffset = vis.apiConfig.columnOffset;
  // const columnCount = vis.apiConfig.columnCount;
  // const queryUrl = `http://${server}:${port}/3/Frames/${exemplarsFrame}?column_offset=${columnOffset}&column_count=${columnCount}`;

  const getFrameDataOptions = {
    frameID,
    server,
    port,
    columnOffset,
    vis
  };
  getFrameData(null, null, getFrameDataOptions, parseAndPlot);

  // d3.request(queryUrl)
  //   .get(callback);

  const gui = new dat.GUI();
  gui.close();
  d3.select('div.dg.ac')
    .style({
      position: 'fixed',
      top: '5px',
      left: '435px',
      width: '250px'
    });

  const opts = {
    showPointIds: true,
    radius: 2
  };

  const idsController = gui.add(opts, 'showPointIds');

  const radiusController = gui.add(opts, 'radius', 1, 8);

  idsController.onFinishChange(value => {
    if (value === true) {
      vis.dots.selectAll('text')
        .style('fill-opacity', 0.7);
    } else {
      vis.dots.selectAll('text')
        .style('fill-opacity', 0);
    }
  });

  radiusController.onFinishChange(value => {
    d3.selectAll('circle')
      .attr('r', value);
  });
}
