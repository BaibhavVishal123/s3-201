//var utilFile = require('./src/util/File');
//var s3Util = require('./src/util/s3util');
var rekoUtil = require('./src/util/rekoUtil');



/* var fileName = 'baibhav/image/abc.jpg';
var bucket = 'aws-201-image-transform';
var URL = 'http://www.sobha.com/images/sobha-azalea-banner1.jpg';
s3Util.getImageFromURL(URL, fileName, bucket, function () {
    console.log('done');
});
 */

var key = "baibhav/image/CId-1-PId1.jpg";
var bucket = "aws-201-image-transform";
var abc = rekoUtil.getRekognitionLabels(bucket, key);
console.log("abc:", abc);