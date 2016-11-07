import { parseResponseObject } from './parseResponseObject';
import { drawMemberCircles } from './drawMemberCircles';
import { getFrameData } from './getFrameData';
import d3 from 'd3';
import d3_request from 'd3-request';
d3.request = d3_request.request;

export function getMembersData(vis) {
  // call the h2o-3 API to get members data
  // for the specified exemplar
  const exemplarId = vis.exemplarPointsVisible[0].id;
  const frameID = `members_exemplar${exemplarId}`;
  const aggregatorModelID = vis.apiConfig.aggregatorModelID;

  const server = vis.apiConfig.server;
  const port = vis.apiConfig.port;
  const columnOffset = vis.apiConfig.columnOffset;
  const baseUrl = `http://${server}:${port}/3`;

  // with the default rowCount, which is the min(actual rowCount, 100 rows)
  const getMemberFrameDefaultRowCountUrl = `${baseUrl}/Frames/${frameID}?column_offset=${columnOffset}`; // &column_count=${columnCount}
  console.log('getMemberFrameDefaultRowCountUrl', getMemberFrameDefaultRowCountUrl);

  const generateMemberFrameUrl = `${baseUrl}/Predictions/models/${aggregatorModelID}/frames/null`;
  const generateMemberFrameData = `predictions_frame=members_exemplar${exemplarId}&exemplar_index=${exemplarId}`;
  console.log('generateMemberFrameUrl', generateMemberFrameUrl);
  console.log('generateMemberFrameData', generateMemberFrameData);

  //
  // generate the frame with member points for the current exemplar point
  //
  const fetchOptions = {
    method: 'POST',
    body: generateMemberFrameData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  fetch(generateMemberFrameUrl, fetchOptions)
    .then(res => res.json())
    .then(json => {
      console.log(json);
      getMemberFrameDefaultRowCount(null, json);
    });

  function getMemberFrameDefaultRowCount(error, response) {
    console.log('getMemberFrameDefaultRowCount response', response);
    const getFrameDataOptions = {
      frameID,
      server,
      port,
      columnOffset,
      xVariable: vis.xCat,
      yVariable: vis.yCat,
      maxMembers: 663 // rowCount of current top-level exemplars frame
    };
    d3.request(getMemberFrameDefaultRowCountUrl)
      .get((err, res) => getFrameData(err, res, getFrameDataOptions, drawMembersData));
  }

  function drawMembersData(error, response) {
    console.log('response passed to drawMembersData', response);
    vis.detailData = parseResponseObject(response);
    drawMemberCircles(vis);
  }
}
