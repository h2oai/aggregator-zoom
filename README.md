# aggregator-zoom

### demo

install dependencies  
`npm install`  

now, open a browser with CORS (cross-origin protection) disabled  
`open -a Google\ Chrome --args --disable-web-security --user-data-dir`  
`open -a Google\ Chrome\ Canary --args --disable-web-security --user-data-dir`  

start the app  
`npm run start`  

visit [localhost:3000](localhost:3000)  

### development  

install dependencies  
`npm install`  

add the config for your h2o-3 server in `src/config/`  

tell the visualization to use your new config file in   
`src/drawScatterplot.js`  

now, open a browser with CORS disabled  

now, open a browser with CORS (cross-origin protection) disabled  
`open -a Google\ Chrome --args --disable-web-security --user-data-dir`  
`open -a Google\ Chrome\ Canary --args --disable-web-security --user-data-dir`  

start the app  
`npm run start`  

visit [localhost:3000](localhost:3000)  

![aggregator-zoom-color-2](https://cloud.githubusercontent.com/assets/2119400/20991759/fe604b1c-bc94-11e6-9789-c2daecd99c2a.gif)

### API Reference

a work in progress

to configure the opacity (color shade) of the top-level scatterplot points:

**opacityMin** a number.  values that produce nice results range from `0` and `0.7`. defaults to  `0.05` if unspecified.
**opacityScaleExponent** a number. values  values that produce nice results range from `0.1` to `2`.  defaults to `0.5` if unspecified.

example usage:

```
export const worldCitiesConfig = {
  server: '172.16.2.141',
  port: '54321',
  aggregatorModelID: 'aggregator-f34c7f25-18f6-4eab-a4e2-1868378fde15',
  exemplarFrame: 'aggregated_worldcitiespop.hex_by_aggregator-f34c7f25-18f6-4eab-a4e2-1868378fde15',
  columnOffset: '0',
  columnCount: '8',
  defaultXVariable: 'Longitude',
  defaultYVariable: 'Latitude',
  tooltipVariables: ['City'],
  opacityMin: 0.05,
  opacityScaleExponent: 0.5
};
```
