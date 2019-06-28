//// ECO-WB Water Hycanith Project ////
//// NorthEast Gulf Draft Script ////
//// By: Joshua Sumers ////
//// Start Date: 06-25-2019 ////
//// Update Date: 06-27-2019 ////

//Set NE study Area
var NorthGulf = ee.FeatureCollection("users/joshsumers1996/North_Gulf");

//set start Date
var Start = '2017-05-06';

//set End Date

var End = '2017-05-08';

//imagery date for test
//var TDate = '2017-05-07';

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
 .filter(ee.Filter.date(Start, End))
 //filter North
 .filterBounds(NorthGulf)
 //Clip North
 .map(function(image){return image.clip(NorthGulf)});


//set visualization parameters
var visParm = {Bands: 'VV,VH', min: -30, max: 5};

 Map.addLayer(vvvh, visParm, 'North');
 Map.centerObject(NorthGulf, 11);


//Do you want to export?
var VExport = false;

//export video
if (VExport === true) {
Export.video.toDrive({
    collection: Video,
    description: "VideoOfWaterHy" ,
    scale: 30,
    framesPerSecond: 10,
    region: NorthGulf
})}
