var util = require('util');
var async = require('async');
var AWS = require('aws-sdk');

// get reference to S3 client 
var s3 = new AWS.S3();

exports.handler = function (event, context, callback) {
    console.log("Starting Lambda Call");

    console.log("\n In String:\n", JSON.stringify(event));
    // console.log("Process.env: ", process.env);
    // Read options from the event.
    console.log("Reading options from event:\n", util.inspect(event, {
        depth: 5
    }));
    var srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    
    // Download the file from S3, 
    async.waterfall([
        function download(next) {
            // Download the file from S3 into a buffer.
            s3.getObject({
                Bucket: srcBucket,
                Key: srcKey
            }, next);
        }
        // ADD "," IN PREVIOUS LINE IF WE WANT TO ADD MORE FUNCTIONS
    ], function (err) {
        if (err) {
            console.error(' error: ' + err);
        } else {
            console.log("Success");
        }
        callback(null, "message");
    });
};