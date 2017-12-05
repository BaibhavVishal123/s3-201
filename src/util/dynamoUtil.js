// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
// AWS.config.update({region: 'REGION'});
AWS.config = new AWS.Config({
    region: 'us-east-1'
});


// Create the DynamoDB service object
ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

module.exports = {

    writePropertyItem(PropertyId, labels, table){
        var params = {
            TableName: 'PropertiesImageLabels',
            Item: {
                'PropertyId': { N: '001' },
                'CustomerId': { S: 'Richard Roe' },
            }
        };

    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}
}