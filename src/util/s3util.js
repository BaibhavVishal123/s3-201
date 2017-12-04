var request = require('request');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = {

    // Stores Image from URL to S3
    getImageFromURL(URL, fileName, bucket, callback) {
        var options = {
            uri: URL,
            encoding: null
        };
        request(options, function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log("failed to get image");
                console.log(error);
                if(response.statusCode !== 200){
                    console.log("200 status not received for URL:", options.uri);
                }
            } else {
                s3.putObject({
                    Body: body,
                    Key: fileName,
                    Bucket: bucket
                }, function (error, data) {
                    if (error) {
                        console.log("error downloading image to s3", fileName);
                    } else {
                        // console.log("body:", body);
                        // console.log("success uploading to s3", fileName);
                    }
                });
            }
        });
    }

}
