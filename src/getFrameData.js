import { aggregateFrame } from './aggregateFrame';
import * as _ from 'lodash';

export function getFrameData(error, response, options, callback) {
  console.log('getFrame was called');
  console.log('response passed to getFrame', response);
  console.log('options passed to getFrame', options);

  // call the h2o-3 API to get data for all rows
  // from an h2o-3 data frame
  const frameID = options.frameID;
  const server = options.server;
  const port = options.port;
  const columnOffset = options.columnOffset;
  const baseURL = `http://${server}:${port}/3`;
  const xVariable = options.xVariable;
  const yVariable = options.yVariable;
  const maxMembers = options.maxMembers;

  //
  // get the number of rows in the specified frame
  //
  // ignore fields that are not the row count
  const getFrameMetricsOptions = '?_exclude_fields=frames/__meta,frames/chunk_summary,frames/default_percentiles,frames/distribution_summary,__meta';
  const getFrameMetricsURL = `${baseURL}/Frames/${frameID}/summary${getFrameMetricsOptions}`;

  fetch(getFrameMetricsURL, { method: 'GET' })
    .then(res => res.json())
    .then(json => {
      console.log('json response from getFrameMetrics request', json);
      const frame = {
        frameID: json.frames[0].frame_id.name,
        rowCount: json.frames[0].rows,
        columnCount: json.frames[0].column_count,
        columns: json.frames[0].columns.map(d => d.label)
      };
      console.log('frame', frame);

      if (
        typeof maxMembers !== 'undefined' &&
        frame.rowCount > maxMembers
      ) {
        // aggregate the large members frame
        const ignoredColumns = _.pullAll(frame.columns, [xVariable, yVariable]);
        console.log('ignoredColumns from getFrameData', ignoredColumns);
        const aggregateFrameOptions = {
          server,
          port,
          frameID: frame.frameID,
          radiusScale: 0.05, // TODO: pick a data-driven radius scale
          ignoredColumns
        };
        aggregateFrame(aggregateFrameOptions);
      } else {
        // specify columnCount and rowCount so that h2o-3 will return all data from the frame
        const columnCount = frame.columnCount;
        const rowCount = frame.rowCount;
        const getFrameURL = `${baseURL}/Frames/${frameID}?column_offset=${columnOffset}&column_count=${columnCount}&row_count=${rowCount}`;
        console.log('getFrameURL', getFrameURL);

        fetch(getFrameURL, { method: 'GET' })
          .then(res => res.json())
          .then(json => {
            callback(null, json);
          });
      }
    });
}
