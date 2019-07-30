//// ECO-WB Water Hycanith Project ////
//// NorthEast Gulf Draft Script ////
//// By: Joshua Sumers ////
//// Start Date: 06-25-2019 ////
//// Update Date: 07-29-2019 ////

//Set NE study Area
var NorthGulf = ee.FeatureCollection("users/joshsumers1996/North_Gulf");

//set start Date
var Start = '2017-05-06';

//set End Date

var End = '2017-05-08';

//imagery date for test
//var TDate = '2017-05-07';

// import sentinel imagery


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

//Create a band to serve as a Hycanith Determination based on VH value greater than -22
var HycDet = function(image){
  var VH = image.select(['VH']);
  return image.addBands(ee.Image(1).updateMask(VH.gte(-22)).rename('Hycanith'));
};

//Create a Band to serve as a Water determination based on VH value less than -22
var WaterDet = function(image){
  var VH = image.select(['VH']);
  return image.addBands(ee.Image(1).updateMask(VH.lte(-22)).rename('Water'));
};

//create variable that has both bands
var HycanithDeter = vvvh.map(HycDet).map(WaterDet);

//print out values
print(HycanithDeter);

//create image of Hycanith based on median VH values
var Hycanith = HycanithDeter.select('Hycanith').median();

//create image of water based on median VH values
var Water = HycanithDeter.select('Water').median();

//standard image using VV and VH values
var SImage = vvvh.select('VV','VH').median();

//set visualization parameters
var visParm = {Bands: 'VV,VH', min: -30, max: 5};

//visualation parameters for water/hycanith determination
var visParms = {Bands: 'VHH', min: 0, max: 1};

 //Map.addLayer(testingm, visParms, 'test');
 Map.addLayer(Hycanith, visParms, 'Hycanith');
 Map.addLayer(Water, visParms, 'Water');
 Map.addLayer(vvvh, visParm, 'North');
 Map.addLayer(SImage, visParm, 'Median image');
 Map.centerObject(NorthGulf, 11);
 Map.style().set('cursor', 'crosshair');

//Do you want to export an image?
var IExport = true;

//export image
if (IExport === true){
  Export.image.toDrive({
    image: Hycanith,
    description: "WaterHycanith",
    maxPixels: 1e13,
    crs: "EPSG:3857",
    scale: 10,
    region: NorthGulf,
    fileFormat: 'GeoTIFF',
  })
}

//Do you want to export video?
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
