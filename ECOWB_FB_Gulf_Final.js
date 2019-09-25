//// ECO-WB Water Hycanith Project ////
//// Full Gulf Final Script ////
//// By: Joshua Sumers ////
//// Start Date: 06-25-2019 ////
//// Update Date: 09-12-2019 ////

//Set NE study Area
var FullGulf = ee.FeatureCollection("users/joshsumers1996/FullBound");

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
 //filter Gulf Boundary
 .filterBounds(FullGulf)
 //Clip Gulf Boundary
 .map(function(image){return image.clip(FullGulf)});

//Create a band to serve as a Hycanith Determination based on VH value greater than -23
var HycDet = function(image){
  var VH = image.select(['VH']);
  return image.addBands(ee.Image(1).updateMask(VH.gte(VHV)).rename('Hycanith'));
};

var IC = function(image){
  var ICV = 1
  return image.addBands(ee.Image(1).updateMask(ICV).rename('imagecount'));
};

//create variable that has hycanith band and image count
var HycanithDeter = vvvh.map(HycDet);
var Imagecounting = HycanithDeter.map(IC);

//select hycanith band
var Hyc = Imagecounting.select('Hycanith');

//Select image number band
var ICv = Imagecounting.select('imagecount');

//create image collections
var finalcolHyc = ee.ImageCollection(Hyc);
var finalcolIC = ee.ImageCollection(ICv);

//create count of images
var totalimagecount = finalcolHyc.size();

//print number of images in collection
print('Number of images in collection', totalimagecount);

//create sum presence of hycanith
var hycdet = finalcolHyc.sum();

//create sum of imagecounts
var ICV = finalcolIC.sum();

//create frequency
var FQI = hycdet.divide(ICV);

//convert to percent coverage
var PI = FQI.multiply(100);


//set visualization parameters
var visParm = {Bands: 'hycanith', min: 0, max: 100};

 //Map.addLayer(testingm, visParms, 'test');
 Map.addLayer(PI, visParm, 'Distribution')
 Map.centerObject(FullGulf, 11);

//Do you want to export the frequency image?
var IExport = true;

//export frequency image
if (IExport === true){
  Export.image.toDrive({
    image: PI,
    description: "Water Hycanith Frequency Image",
    maxPixels: 1e13,
    crs: "EPSG:3857",
    scale: 10,
    region: FullGulf,
    fileFormat: 'GeoTIFF',
  })
}
