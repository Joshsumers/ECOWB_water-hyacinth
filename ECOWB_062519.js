//// ECO-WB Water Hycanith Project ////
//// Draft Script 1 ////
//// By: Joshua Sumers ////
//// Start Date: 06-25-2019 ////
//// Update Date: 06-26-2019 ////

//Set two study areas to eliminate overlap
var North = ee.FeatureCollection("users/joshsumers1996/North_Gulf"),
    South = ee.FeatureCollection("users/joshsumers1996/South_Gulf");



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
var

//set visualization parameters
var visParm = {min: [-25, -20, -5], max: [0, 10, 25]}

 Map.addLayer(vvvhN, visParm, 'North');
 Map.addLayer(vvvhS, visParm, 'South');
 Map.centerObject(vvvhN);
