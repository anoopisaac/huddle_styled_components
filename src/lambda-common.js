const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});
export class DynamoDbHandler {
    tableName;
    partKey;
    id;
    item;
    constructor(tableName, partKey, id, item) {
        this.tableName = tableName;
        this.partKey = partKey;
        this.id = id;
        this.item = item;
    }
    async handleRequest(httpMethod) {
        // return generateResponse({method:httpMethod});
        try {
            if (!this.isItemPresent()) {
                throw new Error("body not present");
            }
            let response = "method not allowed";
            if (httpMethod === "PATCH") {
                response = await this.updateItem()
            }
            if (httpMethod === "POST") {
                response = await this.insertItem()
            }
            if (httpMethod === "GET") {
                response = await this.fetchItems()
            }
            console.log("hello check", response)
            return this.generateResponse(response);
        } catch (err) {
            return this.generateResponse(err.message, true)
        }


    }
    test() {
        // let a,b;
        console.log("hello", ee);
    }
    isItemPresent = () => {
        return (this.item !== null && this.item !== undefined)
    }
    generateResponse = (message, err) => {
        const response = {
            statusCode: err === true ? 500 : 200,
            body: JSON.stringify(message),
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
        };
        return response;
    }

    fetchItems = async () => {
        const params = {
            ExpressionAttributeValues: {
                ":v1": this.partKey,
                // ":how": "how"
            },
            KeyConditionExpression: "partKey = :v1",
            TableName: this.tableName
        }
        const response = await db.query(params).promise();
        return response;
    }
    insertItem = async () => {
        const params = {
            TableName: this.tableName,
            Item: {
                partKey: this.partKey,
                id: this.id,
                MapAttribute: this.item,
            }
        }
        await db.put(params).promise();
        const message = "done";
        return message;
    }

    updateItem = async () => {
        const params = {
            TableName: this.tableName,
            Key: {
                partKey: this.partKey,
                id: this.id
            },
            UpdateExpression: "set MapAttribute=:body",
            ExpressionAttributeValues: {
                ":body": body
            },
            // ExpressionAttributeNames: {
            //     // "#body":"body"
            // },
            ReturnValues: "UPDATED_NEW"
        }
        await db.update(params).promise();
        const message = "done";
        return message;
        //your code

    }
}