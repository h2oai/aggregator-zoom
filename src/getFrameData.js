import { aggregateFrame } from './aggregateFrame';
// import { findRadiusScale } from './findRadiusScale';
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
  // const modelID = options.modelID;

  //
  // get the number of rows in the specified frame
  //
  // ignore fields that are not the row count
  const getFrameMetricsOptions = '?_exclude_fields=frames/__meta,frames/chunk_summary,frames/default_percentiles,frames/distribution_summary,__meta';
  let getFrameMetricsURL = `${baseURL}/Frames/${frameID}/summary${getFrameMetricsOptions}`;

  fetch(getFrameMetricsURL, { method: 'GET' })
    .then(res => res.json())
    .then(json => {
      console.log('json response from getFrameMetrics request', json);
      let frame = {
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
        const modelID = `aggregator-${frameID}`;
        //
        // check if modelID already exists on our h2o cluster
        //
        const getModelsURL = `http://${server}:${port}/3/Models`;
        fetch(getModelsURL)
          .then(res => res.json())
          .then(json => {
            const modelIDs = json.models.map(d => d.model_id.name);
            if (modelIDs.indexOf(modelID) > -1) {
              console.log(`modelID ${modelID} already exists in h2o-3`);
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
                    getFrameMetricsURL = `${baseURL}/Frames/${exemplarsFrameID}/summary${getFrameMetricsOptions}`;
                    fetch(getFrameMetricsURL, { method: 'GET' })
                      .then(res => res.json())
                      .then(json => {
                        console.log('json response from getFrameMetrics request', json);
                        frame = {
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
                        const columnCount = frame.columnCount;
                        const rowCount = frame.rowCount;
                        const getFrameURL = `${baseURL}/Frames/${exemplarsFrameID}?column_offset=${columnOffset}&column_count=${columnCount}&row_count=${rowCount}`;
                        console.log('getFrameURL', getFrameURL);

                        fetch(getFrameURL, { method: 'GET' })
                          .then(res => res.json())
                          .then(json => {
                            // pass the json data to the provided callback
                            callback(null, json);
                          });
                      });
                  } else {
                    console.error('exemplarsFrameID is', exemplarsFrameID);
                  }
                });
            } else {
              //
              // modelID is new, ok to proceed
              // aggregate the large members frame
              //
              console.log('//');
              console.log('// modelID is new, ok to proceed');
              console.log('// aggregate the large members frame');
              console.log('//');
              const ignoredColumns = _.pullAll(frame.columns, [xVariable, yVariable]);
              console.log('ignoredColumns from getFrameData', ignoredColumns);
              console.log('frame', frame);
              const radiusScaleFactor = 18166;
              const radiusScale = frame.rowCount / radiusScaleFactor;
              const aggregateFrameOptions = {
                server,
                port,
                frameID: frame.frameID,
                radiusScale, // TODO: pick a data-driven radius scale
                ignoredColumns,
                modelID
              };
              aggregateFrame(aggregateFrameOptions);
              // findRadiusScale(aggregateFrameOptions);
            }
          });
      } else {
        // specify columnCount and rowCount so that h2o-3 will return all data from the frame
        const columnCount = frame.columnCount;
        const rowCount = frame.rowCount;
        const getFrameURL = `${baseURL}/Frames/${frameID}?column_offset=${columnOffset}&column_count=${columnCount}&row_count=${rowCount}`;
        console.log('getFrameURL', getFrameURL);

        fetch(getFrameURL, { method: 'GET' })
          .then(res => res.json())
          .then(json => {
            // pass the json data to the provided callback
            callback(null, json);
          });
      }
    });
}
