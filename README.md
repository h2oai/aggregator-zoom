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
