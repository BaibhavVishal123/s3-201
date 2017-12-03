var util = require('util');
var async = require('async');
var AWS = require('aws-sdk');
//var csv = require('csv');
var csv = require('csv-parser');
var fs = require('fs');

var utilFile = require('./src/util/File');
var s3Util = require('./src/util/s3util');

// get reference to S3 client 
var s3 = new AWS.S3();
const fileName = '/tmp/data.csv';
const outFileName = '/tmp/data-out.csv';
const bucket = 'aws-201-image-transform';
const keyPrefix = 'baibhav/image/';


function outPropertyCSV(CustomerId, CustomerName, Address, TotalCost, YearBuilt, SaleDate, Seller) {
    this.CustomerId = CustomerId;
    this.CustomerName = CustomerName;
    this.Address = Address;
    this.TotalCost = TotalCost;
    this.YearBuilt = YearBuilt;
    this.SaleDate = SaleDate;
    this.Seller = Seller;
}

var input = [];
var output = [];

exports.handler = function (event, context, callback) {
    console.log("Starting Lambda Call");
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
            s3.getObject(params, async function (err, data) {
                if (err) {
                    throw (err);
                }
                else {
                    var body = data.Body.toString('utf-8');
                    //console.log("Body:", body);
                    var success = await utilFile.saveText(body, fileName);
                    if (success) {
                        next(null, fileName);
                    }
                }
            });
        },
        async function getImages(fileName, next) {
            console.log("Filename received:", fileName);
            var index = 0;
            await fs.createReadStream(fileName)
                .pipe(csv())
                .on('data', function (data) {
                    s3Util.getImageFromURL(data.Image, keyPrefix + "Id-" + data['Customer Id'] + '-' + data.Address + '.jpg', bucket, function () {
                        console.log('done: ', bucket + keyPrefix + "Id-" + data['Customer Id'] + '-' + data.Address + '.jpg');
                    });
                    output.push(new outPropertyCSV(data['Customer Id'], data['Customer Name'], data.Address, data['Total cost'], data.yearBuilt, data['Sale Date'], data.Seller));
                });
            next(null, output);
        },
        function uploadCSV(json, next) {
            console.log("CSV-JSON received:", json);
            
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