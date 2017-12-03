var utilFile = require('./src/util/File');
var s3Util= require('./src/util/s3util');



var fileName = 'baibhav/image/abc.jpg';
var bucket = 'aws-201-image-transform';
var URL = 'http://www.sobha.com/images/sobha-azalea-banner1.jpg';
s3Util.getImageFromURL(URL, fileName, bucket, function () {
    console.log('done');
});

