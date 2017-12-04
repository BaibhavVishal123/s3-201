var util = require('util');
var async = require('async');
var AWS = require('aws-sdk');
//var csv = require('csv');
var csv = require('csv-parser');
var fs = require('fs');
var json2csv = require('json2csv');

const config = require('./config/config');
var utilFile = require('./src/util/File');
var s3Util = require('./src/util/s3util');

// get reference to S3 client 
var s3 = new AWS.S3();

// Create Rekognition Object
const rekognition = new AWS.Rekognition();

const fileName = '/tmp/data.csv';
const outFileName = 'outputProperties.csv';


const bucket = config.srcS3.bucket;
const destBucket = config.destS3.bucket;
const csvPrefix = config.destS3.csvPrefeix;
const imagePrefix = config.destS3.imagePrefix;


var fields = ['Property Id', 'Address', 'Customer Id', 'Customer Name', 'Total Cost', 'yearBuilt', 'Sale Date', 'Seller'];


var output = [];

function outPropertyCSV(PropertyId, CustomerId, CustomerName, Address, TotalCost, YearBuilt, SaleDate, Seller) {
    this['Property Id'] = PropertyId;
    this['Customer Id'] = CustomerId;
    this['Customer Name'] = CustomerName;
    this.Address = Address;
    this['Total Cost'] = TotalCost;
    this.yearBuilt = YearBuilt;
    this['Sale Date'] = SaleDate;
    this.Seller = Seller;
}

var imageList = [];

exports.handler = function (event, context, callback) {
    // console.log("Starting Lambda Call");
    console.log("\n Event Received in String:\n", JSON.stringify(event));

    // Even If records is an array and may contain multiple event details, 
    // each S3 event triggers a complete new event, listing details of the object uploaded
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    var objectData = '';

    async.waterfall([
        // Download the file from S3
        function download(next) {
            var params = {
                Bucket: srcBucket,
                Key: srcKey
            };
            // console.log("downloads' next:", next);
            s3.getObject(params, async function (err, data) {
                if (err) {
                    throw (err);
                } else {
                    var body = data.Body.toString('utf-8');
                    //console.log("Body:", body);
                    var success = await utilFile.saveText(body, fileName);
                    if (success) {
                        next(null, fileName);
                    }
                }
            });
        },
        function getImages(fileName, next) {
            // console.log("get Images' next:", next);
            console.log("Filename received:", fileName);
            var localImageFile = '';
            fs.createReadStream(fileName)
                .pipe(csv())
                .on('data', function (data) {
                    s3Util.getImageFromURL(data.Image, imagePrefix + "CId-" + data['Customer Id'] + '-PId' + data['Property Id'] + '.jpg', destBucket, function () {
                        // console.log('done: ', destBucket + imagePrefix + "Id-" + data['Customer Id'] + '-PId' + data['Property Id'] + '.jpg');
                    });
                    output.push(new outPropertyCSV(data['Property Id'], data['Customer Id'], data['Customer Name'], data.Address, data['Total Cost'], data.yearBuilt, data['Sale Date'], data.Seller));
                    // console.log(output.length, " <<<  data  >>> ", data['Property Id']);
                    localImageFile = imagePrefix + "CId-" + data['Customer Id'] + '-PId' + data['Property Id'] + '.jpg';
                    imageList.push(({
                        "fileName": localImageFile
                    }));

                })
                .on('end', function () {
                    console.log("enddddddddd   ", output);
                    console.log("iiiiiiiiiiiiii   ", imageList);
                    next(null, output, imageList);
                });
        },
        async function uploadCSV(output, imageList, next) {
            // console.log("uploadCSVs' next:", next);
            console.log("CSV-JSON received:", output);
            console.log("ImageList to be passed on:", imageList);
            var result = json2csv({
                data: output,
                fields: fields
            });
            console.log(result);
            s3.putObject({
                Body: result,
                Key: csvPrefix + outFileName,
                Bucket: destBucket
            }, function (error, data) {
                if (error) {
                    console.log("error saving file to s3", outFileName);
                } else {
                    console.log("success uploading to s3", outFileName);
                    console.log("Just before passing:", imageList);
                    next(null, imageList);
                }
            });
        },

        function rekognitionProcessing(imageList, next) {
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");
            console.log("From Rekognition Method:", JSON.stringify(imageList));
            var params = {
                Image: {
                    S3Object: {
                        Bucket: destBucket,
                        Name: "baibhav/image/CId-1-PId1.jpg"
                    }
                },
                MaxLabels: 123,
                MinConfidence: 40
            };
            rekognition.detectLabels(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data); // successful response
            });
        }
    ], function (err) {
        if (err) {
            console.error(' error: ' + err);
        } else {
            console.log("Success");
        }
        callback(null, "message");
    });
};