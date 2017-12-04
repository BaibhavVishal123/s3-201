var request = require('request');

var AWS = require('aws-sdk');
// Configure sdk
AWS.config = new AWS.Config({
    region: 'us-east-1'
});
// Create Rekognition Object
const rekognition = new AWS.Rekognition();



module.exports = {

    getRekognitionLabels(destBucket, key) {
        var params = {
            Image: {
                S3Object: {
                    Bucket: destBucket,
                    Name: key
                }
            },
            MaxLabels: 123,
            MinConfidence: 40
        };
        rekognition.detectLabels(params, function (err, data) {
            if (err) {
                // an error occurred
                console.log(err, err.stack);
            } else {
                // successful response
                console.log(data);
                return data;
            }
        });
    }
}