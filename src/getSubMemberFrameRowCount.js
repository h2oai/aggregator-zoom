import { getSubMemberFrameData } from './getSubMemberFrameData';

export function getSubMemberFrameRowCount(options, callback) {
  const server = options.server;
  const port = options.port;
  const exemplarsFrameID = options.exemplarsFrameID;
  const columnOffset = options.columnOffset;
  const vis = options.vis;

  //
  // get the rowCount for this sub-member frame
  //
  const getFrameMetricsOptions = '?_exclude_fields=frames/__meta,frames/chunk_summary,frames/default_percentiles,frames/distribution_summary,__meta';
  const getFrameMetricsURL = `http://${server}:${port}/3/Frames/${exemplarsFrameID}/summary${getFrameMetricsOptions}`;
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
      //
      // get the data for the sub-member frame
      // specify columnCount and rowCount so that h2o-3 will return all data from the frame
      //
      // TODO: generalize this to a getFrameData call
      const getSubMemberFrameDataOptions = {
        frame,
        server,
        port,
        exemplarsFrameID,
        columnOffset,
        vis
      };
      getSubMemberFrameData(getSubMemberFrameDataOptions, callback);
    });

  //
  // callback function tree
  //
  // getSubMemberFrameData()
  //   --> callback();
}
