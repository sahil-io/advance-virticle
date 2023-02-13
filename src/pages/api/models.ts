import * as uuid from 'uuid';
import {
    DynamoDBClient,
    GetItemCommand,

} from '@aws-sdk/client-dynamodb';

import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {NextApiRequest, NextApiResponse} from "next";

export const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY as string,
        secretAccessKey: process.env.SECRET_KEY as string
    },
    region: process.env.REGION
});

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

 const ddbDocClient = DynamoDBDocumentClient.from(client, {
    marshallOptions,
    unmarshallOptions,
});

const params = {
    TableName: process.env.TABLE_NAME
};

export {ddbDocClient}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    if (req.method === 'GET') {
        try {
            const data = await ddbDocClient.send(new ScanCommand(params));
            return res.status(200).json(data.Items);

        } catch (err) {
            console.log("Error", err);
        }
    }

    return {}
}
