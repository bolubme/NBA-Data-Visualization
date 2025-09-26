//Import AWS modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export async function saveNBAData(team: string,  homeTeam: string, timestamp: string, awayTeam: string, points: number,  scoreDifference: number,): Promise<void> {
    const command = new PutCommand({
        TableName: "NbaMatchStats",
        Item: {
            "team": team,
            "homeTeam": homeTeam,
            "timestampNba": timestamp,
            "awayTeam": awayTeam,
            "scoreMainPoint": points,
            "scoreDifference": scoreDifference,
        }
    });

    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (err) {
        console.error("ERROR uploading NBA data: " + JSON.stringify(err));
        throw err;
    }
}




export async function saveNewsData(title: string, publishedAt: string, teamName: string): Promise<void> {
    const command = new PutCommand({
        TableName: "News",
        Item: {
            teamName: teamName,
            title: title,
            timestampNews: publishedAt
        }
    });

    try {
        const response = await documentClient.send(command);
        console.log(response);
    } catch (err) {
        console.error("ERROR uploading news data: " + JSON.stringify(err));
        throw err;
    }
}


