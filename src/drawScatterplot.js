import { getFrameData } from './getFrameData';
import { parseAndPlot } from './parseAndPlot';
import { drawControls } from './drawControls';
import d3 from 'd3';

// import { worldCitiesCorsairConfig } from './config/worldCitiesCorsairConfig';
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

  vis.opacityScale = d3.scale.pow()
    .range([0.05, 1]);

  // const rScale = d3.scale.linear()
  //   .range([0, 3]);

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

  const getFrameDataOptions = {
    frameID,
    server,
    port,
    columnOffset,
    vis
  };
  getFrameData(null, null, getFrameDataOptions, parseAndPlot);

  //
  // setup controls widget
  //
  drawControls(vis);
}
