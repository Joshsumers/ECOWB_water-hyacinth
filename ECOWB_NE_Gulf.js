//// ECO-WB Water Hycanith Project ////
//// NorthEast Gulf Draft Script ////
//// By: Joshua Sumers ////
//// Start Date: 06-25-2019 ////
//// Update Date: 06-26-2019 ////

//Set NE study Area
var NorthGulf = ee.FeatureCollection("users/joshsumers1996/North_Gulf");

//set start Date
var Start = '2018-01-01';

//set End Date

var End = '2018-12-31';

// import sentinel imagery
var Sent1 = ee.ImageCollection('COPERNICUS/S1_GRD');

//filter sentinel imagery to include vv+vh
var vvvh = Sent1
 //VV
 .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
 //VH
 .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
// set to IW mode
 .filter(ee.Filter.eq('instrumentMode', 'IW'))
 //Date
 .filter(ee.Filter.date(Start,End))
 //filter North
 .filterBounds(NorthGulf)
 //Clip North
 .map(function(image){return image.clip(NorthGulf)});

//filtering by view angles
var vhAscending = vvvh.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));
var vhDescending = vvvh.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));

//creating composite
var NComp = ee.Image.cat([
  vhAscending.select('VH').mean(),
  ee.ImageCollection(vhAscending.select('VV').merge(vhDescending.select('VV'))).mean(),
  vhDescending.select('VH').mean()
]).focal_median();



//set visualization parameters
var visParm = {min: - 25, max: 5};

 Map.addLayer(NComp, visParm, 'North');
 Map.centerObject(NorthGulf, 10);
