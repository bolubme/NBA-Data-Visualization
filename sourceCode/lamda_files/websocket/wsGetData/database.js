//Import library and scan command
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";


//Create client 
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


export async function getData(){
    const teams = ["Boston Celtics", "Miami Heat", "Golden State Warriors", "Los Angeles Lakers", "Minnesota Timberwolves"]
    
    const finalData = {}
    
    for(let team of teams) {
        finalData[team] = await getTeamData(team);
    }
    
    console.log(JSON.stringify(finalData))
    
    return finalData;
}


async function getTeamData(specificTeam){
    console.log("Getting data for " + specificTeam)
    const query = {
        TableName: "NbaMatchStats",
        Limit: 500,
        KeyConditionExpression: "team = :t",
        ExpressionAttributeValues: {
            ":t": specificTeam 
        }
    };
    
    const query2 = {
        TableName: "News_sentiment",
        Limit: 100,
        KeyConditionExpression: "teamName = :t",
        ExpressionAttributeValues: {
            ":t": specificTeam 
        }
    };
    
    const query3 = {
      TableName: "Predictions",
      Limit: 5,
      KeyConditionExpression: "teamName = :t",
      ExpressionAttributeValues: {
        ":t": specificTeam,
      },
    }
    
    const query4 = {
      TableName: "News",
      Limit: 10,
      KeyConditionExpression: "teamName = :t",
      ExpressionAttributeValues: {
        ":t": specificTeam,
      },
    };

    const queryCommand = new QueryCommand(query);
    const queryCommand2 = new QueryCommand(query2);
    const queryCommand3 = new QueryCommand(query3);
    const queryCommand4 = new QueryCommand(query4);

    try {
        const data = await docClient.send(queryCommand);
        const data2 = await docClient.send(queryCommand2)
        const data3 = await docClient.send(queryCommand3)
        const data4 = await docClient.send(queryCommand4)
        
        // Data structure 
        const teamData = {actual: {times: [], values: []}, predictions: {mean: [], upperQuantile: [], lowerQuantile: []} , sentiment: {timestamp: [], sentiment: []}, newsData: []};
        teamData.actual.times = data.Items.map(item => item.timestampNba);
        teamData.actual.values = data.Items.map(item => item.scoreDifference);
        
        teamData.sentiment.timestamp = data2.Items.map(item => item.timestampNews)
        teamData.sentiment.sentiment = data2.Items.map(item => item.sentiment)
        
        teamData.predictions.mean = data3.Items[0].mean
        teamData.predictions.upperQuantile = data3.Items[0].upperQuantile
        teamData.predictions.lowerQuantile = data3.Items[0].lowerQuantile
        
        teamData.newsData = data4.Items.map(item => item.title)
        
        return teamData;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}




//Returns all of the connection IDs
export async function getConnectionIds() {
    const scanCommand = new ScanCommand({
        TableName: "WebSocketClients"
    });
    
    const response  = await docClient.send(scanCommand);
    return response.Items;
};


//Deletes the specified connection ID
export async function deleteConnectionId(connectionId){
    console.log("Deleting connection Id: " + connectionId);

    const deleteCommand = new DeleteCommand ({
        TableName: "WebSocketClients",
        Key: {
            ConnectionId: connectionId
        }
    });
    return docClient.send(deleteCommand);
};