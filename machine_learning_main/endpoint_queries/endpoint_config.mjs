import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime"; 

import fs from 'fs'

//Create new DocumentClient
const clientD = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(clientD);

//Create SageMakerRuntimeClient
const client = new SageMakerRuntimeClient({});


// Function to upload Data to Dynamo Db
export async function uploadData(teamName, mean, upperQuantile, lowerQuantile){
    const command = new PutCommand({
      TableName: "Predictions",
      Item: {
        "teamName": teamName,
        "mean" : mean,
        "upperQuantile": upperQuantile,
        "lowerQuantile": lowerQuantile
      }
    })
    try {
      const response = await documentClient.send(command);
      console.log(response);
    } catch (err) {
      console.error("ERROR uploading NBA data: " + JSON.stringify(err));
      throw err;
  }
  
}


  export async function invokeEndpoint (endpointData, endpointName, fileName, teamName) {
    //Create and send command with data
    const command = new InvokeEndpointCommand({
        EndpointName: endpointName,
        Body: JSON.stringify(endpointData),
        ContentType: "application/json",
        Accept: "application/json"
    });
    try {
    const response = await client.send(command);

    //Must install @types/node for this to work
    let predictions = JSON.parse(Buffer.from(response.Body).toString('utf8')).predictions[0]

    uploadData(teamName,predictions.mean, predictions.quantiles["0.9"], predictions.quantiles["0.1"])

    //Write prediction to a file 
    fs.writeFileSync(`${fileName}_prediction.json`, JSON.stringify(predictions, null , 2))
    console.log('Predictions written to boston_prediction.json successfully.');
    }catch(error){
      console.log(error)
    }
}  