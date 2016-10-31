import { parseResponse } from './parseResponse';
import { drawMemberCircles } from './drawMemberCircles';
import d3 from 'd3';
import d3_request from 'd3-request';
// import d3_queue from 'd3-queue';
d3.request = d3_request.request;
// d3.queue = d3_queue.queue;

export function getMembersData(vis) {
  // call the h2o-3 API to get members data
  // for the specified exemplar

  const exemplarId = vis.exemplarPointsVisible[0].id;
  const membersFrame = `members_exemplar${exemplarId}`;
  const aggregatorModelID = 'aggregator-glm-81e8729d-e7a5-4b36-ae26-c6c55a2d94c5';

  const server = vis.apiConfig.server;
  const port = vis.apiConfig.port;
  const columnOffset = vis.apiConfig.columnOffset;
  const columnCount = vis.apiConfig.columnCount;
  const baseUrl = `http://${server}:${port}/3`;

  const getMemberFrameUrl = `${baseUrl}/Frames/${membersFrame}?column_offset=${columnOffset}&column_count=${columnCount}`;
  console.log('getmemberFrameUrl', getMemberFrameUrl);

  function getMemberFrameCallback(error, response) {
    console.log('getMemberFrameCallback response', response);
    vis.detailData = parseResponse(response);
    drawMemberCircles(vis);
  }

  const generateMemberFrameUrl = `${baseUrl}/Predictions/models/${aggregatorModelID}/frames/null`;
  const generateMemberFrameData = `predictions_frame=members_exemplar${exemplarId}&exemplar_index=${exemplarId}`;
  console.log('generateMemberFrameUrl', generateMemberFrameUrl);
  console.log('generateMemberFrameData', generateMemberFrameData);

  function generateMemberFrameCallback(error, response) {
    console.log('generateMemberFrameCallback response', response);
    d3.request(getMemberFrameUrl)
      .get(getMemberFrameCallback);
  }

  // create a frame containing the members for a point
  // d3.request(generateMemberFrameUrl)
  //   .header('Content-Type', 'application/x-www-form-urlencoded')
  //   .post(generateMemberFrameData, generateMemberFrameCallback);

  const fetchOptions = {
    method: 'POST',
    body: generateMemberFrameData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  fetch(generateMemberFrameUrl, fetchOptions)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      generateMemberFrameCallback(null, json);
    });
}
