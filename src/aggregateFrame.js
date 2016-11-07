export function aggregateFrame(options) {
  console.log('aggregate was called');
  const server = options.server;
  const port = options.port;

  // the big frame we want to aggregate
  const frameID = options.frameID;
  console.log('frameID to be aggregated', frameID);
  const radius_scale = options.radiusScale; // '0.6'; // '0.05'; // '0.005';

  const model_id = `aggregator-${frameID}`;
  const ignore_const_cols = 'true';
  const categorical_encoding = 'AUTO';
  const transform = 'NORMALIZE';

  // an array
  const ignoredColumns = options.ignoredColumns;
  // a string that we build from the array
  // to match the format h2o-3 REST API expects
  // for the ignored_columns parameter
  let ignored_columns = '[';
  ignoredColumns.forEach((d, i) => {
    ignored_columns += `"${d}"`;
    if (i < (ignoredColumns.length - 1)) {
      ignored_columns += ',';
    }
  });
  ignored_columns += ']';
  console.log('ignored_columns', ignored_columns);

  const fetchOptions = {
    method: 'POST',
    body: `model_id=${model_id}&training_frame=${frameID}&ignored_columns=${ignored_columns}&ignore_const_cols=${ignore_const_cols}&radius_scale=${radius_scale}&categorical_encoding=${categorical_encoding}&transform=${transform}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  fetch(`http://${server}:${port}/99/ModelBuilders/aggregator`, fetchOptions)
    .then((res) => res.json())
    .then((json) => {
      console.log('json response from aggregator model created on members frame', json);
      // return frameID for new exmplars frame of aggregated values
    });
}
