var fs = require('fs');
var request = require('request');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();


module.exports = {
    async saveText(text, fileName) {
        return new Promise(async (resolve, reject) => {
            await fs.writeFile(fileName, text, function (err) {
                if (err) {
                    console.log("errrrrrrrrrrr", err);
                    reject(err);
                } else {
                    console.log('CSV File saved to Local');
                    resolve(true);
                }
            })
        })
    },


    // Stores Image from URL to File
    getImageFromURL(URL, fileName, callback) {
        //fileName= '/tmp/1.jpg';
        return new Promise((resolve, reject) => {
            // console.log("Downloading Image");
            request.head(URL, function (err, res, body) {
                // console.log('content-type:', res.headers['content-type']);
                // console.log('content-length:', res.headers['content-length']);
                request(URL).pipe(fs.createWriteStream(fileName)).on('close', callback);
            });
        })
    }


}