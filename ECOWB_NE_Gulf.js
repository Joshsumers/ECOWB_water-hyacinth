//// ECO-WB Water Hycanith Project ////
//// NorthEast Gulf Draft Script ////
//// By: Joshua Sumers ////
//// Start Date: 06-25-2019 ////
//// Update Date: 09-03-2019 ////

//Set NE study Area
var NorthGulf = ee.FeatureCollection("users/joshsumers1996/North_Gulf");

//set start Date
var Start = ee.Date('2016-08-01');

//set End Date

var End = ee.Date('2019-08-01');

//set VH value for analysis
var VHV = -23;

// import sentinel imagery
var Sent1 = ee.ImageCollection("COPERNICUS/S1_GRD");

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

//Create a band to serve as a Hycanith Determination based on VH value greater than -23
var HycDet = function(image){
  var VH = image.select(['VH']);
  return image.addBands(ee.Image(1).updateMask(VH.gte(VHV)).rename('Hycanith'));
};


//create variable that has hycanith band
var HycanithDeter = vvvh.map(HycDet);

//select hycanith band
var Hyc = HycanithDeter.select('Hycanith');
//create image collection

var finalcol = ee.ImageCollection(Hyc);

//create count of images
var imagecount = finalcol.size();

//print number of images in collection
print('Number of images in collection', imagecount);

//create frequency image in percentage
var hycdet = finalcol.sum().divide(finalcol.size()).multiply(100);


//set visualization parameters
var visParm = {Bands: 'hycanith', min: 0, max: 100};

 //Map.addLayer(testingm, visParms, 'test');
 Map.addLayer(hycdet, visParm, 'Distribution')
 Map.centerObject(NorthGulf, 11);

//Do you want to export the frequency image?
var IExport = true;

//export frequency image
if (IExport === true){
  Export.image.toDrive({
    image: hycdet,
    description: "Water Hycanith Frequency Image",
    maxPixels: 1e13,
    crs: "EPSG:3857",
    scale: 10,
    region: NorthGulf,
    fileFormat: 'GeoTIFF',
  })
}
