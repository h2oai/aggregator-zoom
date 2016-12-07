# aggregator-zoom

### development

install dependencies
`npm install`

add the config for your h2o-3 server in `src/config/`

tell the visualization to use your new config file in 
`src/drawScatterplot.js`

now, open a browser with CORS disabled

open chrome with cross-origin protection disabled
`open -a Google\ Chrome --args --disable-web-security --user-data-dir`

open chrome canary with cross-origin protection disabled
`open -a Google\ Chrome\ Canary --args --disable-web-security --user-data-dir`

start the app
`npm run start`

