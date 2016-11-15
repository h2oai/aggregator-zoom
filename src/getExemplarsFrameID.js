import { getSubMemberFrameRowCount } from './getSubMemberFrameRowCount';

export function getExemplarsFrameID(options, callback) {
  const server = options.server;
  const port = options.port;
  const modelID = options.modelID;
  const columnOffset = options.columnOffset;
  const vis = options.vis;
  //
  // go ahead and get the exemplars FrameID from the current Aggregator model
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
        const getSubMemberFrameRowCountOptions = {
          server,
          port,
          exemplarsFrameID,
          columnOffset,
          vis
        };
        getSubMemberFrameRowCount(getSubMemberFrameRowCountOptions, callback);
      } else {
        console.error('exemplarsFrameID is', exemplarsFrameID);
      }
    });

  //
  // callback function tree
  // 
  // getSubMemberFrameRowCount()
  //    --> getSubMemberFrameData()
  //        --> callback();
}
