module.exports = {
    destS3:{
        bucket: process.env.DestS3Bucket,
        csvPrefeix: process.env.DestPrefixCSV,
        imagePrefix: process.env.DestPrefixImage
    },
    srcS3:{
        bucket: process.env.S3Bucket
    }
};