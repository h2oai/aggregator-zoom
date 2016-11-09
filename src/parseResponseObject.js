export function parseResponseObject(responseObject) {
  const columnsData = responseObject.frames[0].columns;
  const points = [];
  columnsData.forEach(d => {
    if (Object.prototype.toString.call(d.data) === '[object Array]') {
      d.data.forEach((e, j) => {
        if (typeof points[j] === 'undefined') points[j] = {};
        if (Object.prototype.toString.call(d.domain) === '[object Array]') {
          // if the domain is an array
          // then this is a categorical column
          // and we want to lookup the actual values from the domain
          // using the domain indices stored in data
          points[j][d.label] = d.domain[e];
        } else {
        // else this is a numeric column
          points[j][d.label] = e;
        }
      });
    }
  });
  // console.log('columnsData', columnsData);
  // console.log('points', points);

  points.forEach((d, i) => {
    d.id = i;
  });

  const parsedData = points;

  console.log('parsedData', parsedData);
  return parsedData;
}
