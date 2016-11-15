import { aggregateFrame } from './aggregateFrame';

export function findRadiusScale(options) {
  console.log('findRadiusScale was called');
  // const targetExtent = options.targetExtent;
  const server = options.server;
  const port = options.port;
  const ignoredColumns = options.ignoredColumns;

  // the big frame we want to aggregate
  const frameID = options.frameID;
  console.log('frameID to be aggregated', frameID);

  // initialize radius_scale with a seed value
  const radiusScale = 0.6; // '0.6'; // '0.05'; // '0.005';

  // the name we want to give to our new Aggregator model
  const modelID = `aggregator-${frameID}-${radiusScale}`;

  const aggregateFrameOptions = {
    server,
    port,
    frameID,
    modelID,
    ignoredColumns,
    radiusScale,
  };
  aggregateFrame(aggregateFrameOptions, getExemplarFrameRowCount, null);

  function getExemplarFrameRowCount() {
    //
    // go ahead and get the exemplars
    //
    const getCurrentModelURL = `http://${server}:${port}/3/Models/${modelID}`;
    fetch(getCurrentModelURL)
      .then(res => res.json())
      .then(json => {
        const exemplarsFrameID = json.models[0].output.output_frame.name;
        console.log('exemplarsFrameID', exemplarsFrameID);
        if (exemplarsFrameID !== null) {
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
              console.log(`${frame.rowCount} rows in ${exemplarsFrameID}`);
              return frame.rowCount;
            });
        }
      });
  }
}

