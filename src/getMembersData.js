import { parseResponse } from './parseResponse';
import { drawMemberCircles } from './drawMemberCircles';
import { getFrameData } from './getFrameData';
import d3 from 'd3';
import d3_request from 'd3-request';
d3.request = d3_request.request;

export function getMembersData(vis) {
  // call the h2o-3 API to get members data
  // for the specified exemplar

  //
  // set config
  //
  const exemplarId = vis.exemplarPointsVisible[0].id;
  const frameID = `members_exemplar${exemplarId}`;
  const aggregatorModelID = vis.apiConfig.aggregatorModelID;

  const server = vis.apiConfig.server;
  const port = vis.apiConfig.port;
  const columnOffset = vis.apiConfig.columnOffset;
  // const columnCount = vis.apiConfig.columnCount;
  const baseUrl = `http://${server}:${port}/3`;

  // with the default rowCount, which is the min(actual rowCount, 100 rows)
  const getMemberFrameDefaultRowCountUrl = `${baseUrl}/Frames/${frameID}?column_offset=${columnOffset}`; // &column_count=${columnCount}
  console.log('getMemberFrameDefaultRowCountUrl', getMemberFrameDefaultRowCountUrl);

  // with the actual rowCount
  // declare in this higher scope, set in a function
  // let getMemberFrameActualRowCountUrl;

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
      columnOffset
    };
    d3.request(getMemberFrameDefaultRowCountUrl)
      // .get(getMemberFrameRowCount);
      .get((err, res) => getFrameData(err, res, getFrameDataOptions, drawMembersData));
  }

  //
  // get the number of rows in the members frame
  //
  // function getMemberFrameRowCount() {
  //   // ignore fields that are not the row count
  //   const getRowsFrameOptions = '?_exclude_fields=frames/__meta,frames/chunk_summary,frames/default_percentiles,frames/columns,frames/distribution_summary,__meta';
  //   const getRowsRequestURL = `http://${server}:${port}/3/Frames/${frameID}/summary${getRowsFrameOptions}`;
  //   fetchOptions = {
  //     method: 'GET'
  //   };
  //   fetch(getRowsRequestURL, fetchOptions)
  //     .then(res => res.json())
  //     .then(json => {
  //       console.log('json from getRowsRequest response', json);
  //       const parsedRowResponse = json;
  //       const frame = {
  //         rowCount: parsedRowResponse.frames[0].rows,
  //         columnCount: parsedRowResponse.frames[0].column_count,
  //         frameID: parsedRowResponse.frames[0].frame_id.name
  //       };
  //       console.log('frame', frame);
  //       const rowCount = frame.rowCount;
  //       const columnCount = frame.columnCount;
  //       getMemberFrameActualRowCountUrl = `${baseUrl}/Frames/${frameID}?column_offset=${columnOffset}&column_count=${columnCount}&row_count=${rowCount}`;
  //       console.log('getMemberFrameActualRowCountUrl', getMemberFrameActualRowCountUrl);
  //       d3.request(getMemberFrameActualRowCountUrl)
  //         .get(getMemberFrameActualRowCount);
  //     });
  // }

  //
  // get the member frame with all of the rows
  //
  // function getMemberFrameActualRowCount(error, response) {
  //   console.log('getMemberFrameActualRowCount response', response);
  //   vis.detailData = parseResponse(response);
  //   drawMemberCircles(vis);
  // }

  function drawMembersData(error, response) {
    console.log('getMemberFrameActualRowCount response', response);
    vis.detailData = parseResponse(response);
    drawMemberCircles(vis);
  }
}
