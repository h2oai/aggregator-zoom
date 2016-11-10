import { poll } from './poll';

export function aggregateFrame(options) {
  console.log('aggregateFrame was called');
  console.log('options passed to aggregateFrame', options);
  const server = options.server;
  const port = options.port;
  const modelID = options.modelID;
  const radius_scale = options.radiusScale; // '0.6'; // '0.05'; // '0.005';

  const successCallback = options.successCallback;
  const errorCallback = options.errorCallback;

  // the big frame we want to aggregate
  const frameID = options.frameID;
  console.log('frameID to be aggregated', frameID);

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
    body: `model_id=${modelID}&training_frame=${frameID}&ignored_columns=${ignored_columns}&ignore_const_cols=${ignore_const_cols}&radius_scale=${radius_scale}&categorical_encoding=${categorical_encoding}&transform=${transform}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  fetch(`http://${server}:${port}/99/ModelBuilders/aggregator`, fetchOptions)
    .then(res => res.json())
    .then(json => {
      console.log('json response from aggregator model created on members frame', json);
      const jobKey = json.job.key.name;

      // return frameID for new exemplars frame of aggregated values
      poll(
          () => {
            // get status of aggregator model training job
            // return true if model training is complete
            const jobURL = `http://${server}:${port}/3/Jobs/${jobKey}`;
            fetch(jobURL)
              .then(res => res.json())
              .then(json => {
                // console.log('json response from request for aggregator job status', json);
                const readyForView = json.jobs[0].ready_for_view;
                const status = json.jobs[0].status;
                console.log('status', status);
                if (readyForView) {
                  console.log('readyForView');
                  successCallback();
                  return true;
                }
                return undefined;
              });
          },
          () => {
            // Done, success callback
            // return object with new exemplars frameID
            console.log('success callback from aggregateFrames');
            if (typeof successCallback !== 'undefined') successCallback();
          },
          () => {
            // Error, failure callback
            console.log('error callback from aggregateFrames');
            if (typeof errorCallback !== 'undefined') errorCallback();
          }
      );
    });
}
