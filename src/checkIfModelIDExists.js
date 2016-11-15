import { getExemplarsFrameID } from './getExemplarsFrameID';
import { aggregateFrame } from './aggregateFrame';
import * as _ from 'lodash';

export function checkIfModelIDExists(options, callback) {
  const server = options.server;
  const port = options.port;
  const columnOffset = options.columnOffset;
  const vis = options.vis;
  const frame = options.frame;
  const xVariable = options.xVariable;
  const yVariable = options.yVariable;
  const modelID = options.modelID;
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
        // go ahead and get the exemplars FrameID from the current Aggregator model
        //
        const getExemplarsFrameIDOptions = {
          server,
          port,
          modelID,
          columnOffset,
          vis
        };
        getExemplarsFrameID(getExemplarsFrameIDOptions, callback);
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
}
