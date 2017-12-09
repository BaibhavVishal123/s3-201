// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
// AWS.config.update({region: 'REGION'});
AWS.config = new AWS.Config({
    region: 'us-east-1'
});


// Create the DynamoDB service object
ddb = new AWS.DynamoDB.DocumentClient();

module.exports = {

    writePropertyItem(PropertyId, CustomerId, data, table) {
        console.log("In Dynamodb Util, \nData:", data, "\nLabels:", data.Labels);
        
        var params = {
            TableName: 'PropertiesImageLabels',
            Item: {

                "PropertyId": PropertyId,
                "CustomerId": CustomerId,
                "json": data.Labels
            },
            "ReturnValues": "ALL_OLD"
        };
        ddb.put(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });

    }
};