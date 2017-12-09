//var utilFile = require('./src/util/File');
//var s3Util = require('./src/util/s3util');
//var rekoUtil = require('./src/util/rekoUtil');
var dynamoUtil = require('./src/util/dynamoUtil');


/* var fileName = 'baibhav/image/abc.jpg';
var bucket = 'aws-201-image-transform';
var URL = 'http://www.sobha.com/images/sobha-azalea-banner1.jpg';
s3Util.getImageFromURL(URL, fileName, bucket, function () {
    console.log('done');
});
 */
/* 
var key = "baibhav/image/CId-1-PId1.jpg";
var bucket = "aws-201-image-transform";
var abc = rekoUtil.getRekognitionLabels(bucket, key);
console.log("abc:", abc); */

var table = 'PropertiesImageLabels';
var labels = [
    { "Skateboard": 99.25341796875 }, { "Sport": 99.25341796875 }, { "Sports": 99.25341796875 },
    { "Human": 99.24723052978516 }, { "People": 99.24723052978516 }, { "Person": 99.24723052978516 },
    { "Parking": 97.4248275756836 }, { "Parking Lot": 97.4248275756836 }, { "Automobile": 91.53312683105469 },
    { "Car": 91.53312683105469 }, { "Transportation": 91.53312683105469 }, { "Vehicle": 91.53312683105469 },
    { "Intersection": 76.8509521484375 }, { "Road": 76.8509521484375 }, { "Path": 76.2149429321289 },
    { "Pavement": 76.2149429321289 }, { "Sidewalk": 76.2149429321289 }, { "Walkway": 76.2149429321289 },
    { "Building": 66.71541595458984 }, { "Coupe": 62.047218322753906 }, { "Sports Car": 62.047218322753906 },
    { "Urban": 61.988914489746094 }
];


var labels2 = {
    "Labels":
        [
            { "Name": "Skateboard", "Confidence": 99.25341796875 }, { "Name": "Sport", "Confidence": 99.25341796875 },
            { "Name": "Sports", "Confidence": 99.25341796875 }, { "Name": "Human", "Confidence": 99.24723052978516 },
            { "Name": "People", "Confidence": 99.24723052978516 }, { "Name": "Person", "Confidence": 99.24723052978516 },
            { "Name": "Parking", "Confidence": 97.4248275756836 }, { "Name": "Parking Lot", "Confidence": 97.4248275756836 },
            { "Name": "Automobile", "Confidence": 91.53312683105469 }, { "Name": "Car", "Confidence": 91.53312683105469 },
            { "Name": "Transportation", "Confidence": 91.53312683105469 }, { "Name": "Vehicle", "Confidence": 91.53312683105469 },
            { "Name": "Intersection", "Confidence": 76.8509521484375 }, { "Name": "Road", "Confidence": 76.8509521484375 },
            { "Name": "Path", "Confidence": 76.2149429321289 }, { "Name": "Pavement", "Confidence": 76.2149429321289 },
            { "Name": "Sidewalk", "Confidence": 76.2149429321289 }, { "Name": "Walkway", "Confidence": 76.2149429321289 },
            { "Name": "Building", "Confidence": 66.71541595458984 }, { "Name": "Coupe", "Confidence": 62.047218322753906 },
            { "Name": "Sports Car", "Confidence": 62.047218322753906 }, { "Name": "Urban", "Confidence": 61.988914489746094 },
            { "Name": "Neighborhood", "Confidence": 60.97810745239258 }, { "Name": "Sedan", "Confidence": 59.22069549560547 },
            { "Name": "City", "Confidence": 57.33274841308594 }, { "Name": "Town", "Confidence": 57.33274841308594 },
            { "Name": "Street", "Confidence": 56.48063278198242 }, { "Name": "Housing", "Confidence": 54.23549270629883 },
            { "Name": "Downtown", "Confidence": 53.852264404296875 }, { "Name": "Office Building", "Confidence": 52.00179672241211 },
            { "Name": "Suv", "Confidence": 51.3253288269043 }, { "Name": "Apartment Building", "Confidence": 51.260765075683594 },
            { "Name": "High Rise", "Confidence": 51.260765075683594 }, { "Name": "Pedestrian", "Confidence": 50.68067932128906 },
            { "Name": "Freeway", "Confidence": 50.59547424316406 }, { "Name": "Bumper", "Confidence": 50.56858825683594 }
        ]
};

var PropertyId = 16;

dynamoUtil.writePropertyItem(PropertyId, labels2, table);