//Import library and scan command
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const dbCliebt = new DynamoDBClient();

export const handler = async (event) => {
  
  let connId = event.requestContext.connectionId;
  console.log("Client connected with ID: " + connId);
  
  const params = {
    TableName:"WebSocketClients",
    Item:{
      ConnectionId: connId
    }
  }
  
  try{
    await dbCliebt.send(new PutCommand(params))
    console.log("Connection ID is stored")
    
    // Return response
    return{
      statusCode: 200,
      body: "Client connected with ID: " + connId
    };
  }catch(err) {
    console.log(JSON.stringify(err))
    return{
      statusCode: 500, 
      body: "Server Error: " + JSON.stringify(err)
    };
  };
};
