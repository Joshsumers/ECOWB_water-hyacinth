//// ECO-WB Water Hycanith Project ////
//// NorthEast Gulf Draft Script ////
//// By: Joshua Sumers ////
//// Start Date: 06-25-2019 ////
//// Update Date: 07-11-2019 ////

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

var SImage = vvvh.median().select('VV','VH');
//set visualization parameters
var visParm = {Bands: 'VV,VH', min: -30, max: 5};

 Map.addLayer(vvvh, visParm, 'North');
 Map.addLayer(SImage, visParm, 'Median image');
 Map.centerObject(NorthGulf, 11);
 Map.style().set('cursor', 'crosshair');

// create inspector
 var inspector = ui.Panel([ui.Label('Click to get VV / VH Values')]);
 Map.add(inspector);

//get vv & VH values on click
var Click = Map.onClick(function(coords) {
  var Inspectionpoint = ee.Geometry.Point(coords.lon, coords.lat);
  //var PointValue = Inspectionpoint.select('VV');
  var sample = SImage.sample(Inspectionpoint,10);
  inspector.widgets().set(0, ui.Label({
    value: 'VV/VH' + sample,
    style: {color: 'gray'}
  }))});

//Do you want to export an image?
var IExport = false;

//export image
if (IExport === true){
  Export.image.toDrive({
    image: SImage,
    description: "WaterHycanith",
    maxPixels: 1e10,
    crs: "EPSG:3857",
    scale: 10,
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
