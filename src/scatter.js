import { parseResponseObject } from './parseResponseObject';
import { plotExemplars } from './plotExemplars';
import { getFrameData } from './getFrameData';
import dat from 'dat-gui';
import d3 from 'd3';
import d3_request from 'd3-request';
d3.request = d3_request.request;

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
  vis.coverTypeConfig = {
    server: 'mr-0xc8',
    port: '55555',
    exemplarFrame: 'aggregated_covtype_20k_data.hex_by_aggregatormodel',
    columnOffset: '0',
    columnCount: '10',
    defaultXVariable: 'C10',
    defaultYVariable: 'C1'
  };

  vis.pcaConfig = {
    server: 'mr-0xc8',
    port: '55555',
    exemplarFrame: 'aggregated_pca_processed_events_sql_to_hex_by_aggregatormodel',
    columnOffset: '0',
    columnCount: '8',
    defaultXVariable: 'PC1',
    defaultYVariable: 'PC2'
  };

  vis.grupoBimboGLMConfig = {
    server: '172.16.2.141',
    port: '54321',
    aggregatorModelID: 'aggregator-glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5',
    exemplarFrame: 'aggregated_combined-combined-predictions_8862_glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5_on_Bimbo_valid_processed.hex-deviances_b87c_glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5_on_Bimbo_valid_processed.hex-Bimbo_valid_processed.hex_by_aggregator-glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5',
    columnOffset: '0',
    columnCount: '54',
    defaultXVariable: 'predict',
    defaultYVariable: 'deviance'
  };

  vis.worldCitiesConfig = {
    server: '172.16.2.141',
    port: '54321',
    aggregatorModelID: 'aggregator-03753d72-06a3-4513-9953-e266164d394c',
    exemplarFrame: 'aggregated_Key_Frame__worldcitiespop.hex_by_aggregator-03753d72-06a3-4513-9953-e266164d394c',
    columnOffset: '0',
    columnCount: '8',
    defaultXVariable: 'Longitude',
    defaultYVariable: 'Latitude',
    tooltipVariables: ['City']
  };

  vis.apiConfig = vis.worldCitiesConfig;

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

  function parseAndPlot(error, response) {
    console.log('response', response);
    // const responseData = JSON.parse(response.response);
    // console.log('responseData', responseData);
    vis.exemplarData = parseResponseObject(response);
    plotExemplars(vis);
  }

  const getFrameDataOptions = {
    frameID,
    server,
    port,
    columnOffset
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
