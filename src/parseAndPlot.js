import { parseResponseObject } from './parseResponseObject';
import { plotExemplars } from './plotExemplars';

export function parseAndPlot(error, response, vis) {
  console.log('parseAndPlot was called');
  console.log('response', response);
  // const responseData = JSON.parse(response.response);
  // console.log('responseData', responseData);

  // TODO use something better than the global vis variable
  vis.exemplarData = parseResponseObject(response);
  plotExemplars(vis);
}
