export function getSubMemberFrameData(options, callback) {
  const frame = options.frame;
  const server = options.server;
  const port = options.port;
  const exemplarsFrameID = options.exemplarsFrameID;
  const columnOffset = options.columnOffset;
  const vis = options.vis;
  const columnCount = frame.columnCount;
  const rowCount = frame.rowCount;

  //
  // get the data for the sub-member frame
  // specify columnCount and rowCount so that h2o-3 will return all data from the frame
  //
  const getFrameURL = `http://${server}:${port}/3/Frames/${exemplarsFrameID}?column_offset=${columnOffset}&column_count=${columnCount}&row_count=${rowCount}`;
  console.log('getFrameURL', getFrameURL);
  fetch(getFrameURL, { method: 'GET' })
    .then(res => res.json())
    .then(json => {
      // pass the json data to the provided callback
      callback(null, json, vis);
    });

  //
  // callback function tree
  //
  // callback();
}
