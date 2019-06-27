//// ECO-WB Water Hycanith Project ////
//// Draft Script 1 ////
//// By: Joshua Sumers ////
//// Date: 06-25-2019 ////

//Set two study areas to eliminate overlap
var NorthGulf = /* color: #ffc82d */ee.Geometry.Polygon(
        [[[34.45449542486756, -0.1629348170856311],
          [34.64126300299256, -0.44033548712972165],
          [34.94888019049256, -0.2590645250529491],
          [34.69344806158631, -0.028352516004205346]]]),
    SouthGulf = /* color: #ff0000 */ee.Geometry.Polygon(
        [[[34.64072130588943, -0.43918920351144],
          [34.45410260311701, -0.16191296042985115],
          [33.9875801906428, -0.23635574796800354],
          [34.24987877462718, -0.6459611028902127]]]);

// import sentinel imagery
var Sent1 = ee.ImageCollection('COPERNICUS/S1_GRD');

//filter sentinel imagery to include vv+vh
var vvvh = Sent1
 //VV
 .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
 //VH
 .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
// set to IW mode
 .filter(ee.Filter.eq('instrumentMode', 'IW'));

//filter to north area
var vvvhN = vvvh
 .filterBounds(NorthGulf)
 .map(function(image){return image.clip(NorthGulf)});
//filter to south area
var vvvhS = vvvh
 .filterBounds(SouthGulf)
  .map(function(image){return image.clip(SouthGulf)});

//set visualization parameters
var visParm = {min: [-25, -20, -5], max: [0, 10, 25]}

 Map.addLayer(vvvhN, visParm, 'North');
 Map.addLayer(vvvhS, visParm, 'South');
 Map.centerObject(vvvhN);
