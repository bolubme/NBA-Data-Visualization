import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import axios from 'axios';



//Create new DocumentClient
const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);


export const handler = async (event) => {
    console.log(JSON.stringify(event))
    
    try{
        for(let record of event.Records){
            if(record. eventName === "INSERT"){
                
                // retrieve important information 
                let teamName = record.dynamodb.NewImage.teamName.S
                let text = record.dynamodb.NewImage.title.S
                let timestampNews = record.dynamodb.NewImage.timestampNews.S
                
                console.log(`Team Name:  ${teamName}`)
                console.log(`Text: ${text}`)
                console.log(`Timestamp: ${timestampNews}`)
                
                // Call text processing to get sentiment 
                const sentimentResult = await getSentiment(text)
                
                
                // Save Team Name, timestamp and sentiment to new table 
                const command = new PutCommand({
                    TableName: "News_sentiment",
                    Item: {
                        "teamName": teamName,
                        "timestampNews": timestampNews,
                        "sentiment": sentimentResult
                    }
                })
                
                try{
                    const response = await documentClient.send(command);
                    console.log(response)
                }catch (err){
                    console.log("ERROR uploading NBA data: " + JSON.stringify(err))
                    throw err;
                }
            }
        }
    } catch(e){
        console.log("Error: " + e)
    }
} 

// Function for calling and processing sentiment. 
async function getSentiment(text){
    //URL of web service
    let url = `https://kmqvzxr68e.execute-api.us-east-1.amazonaws.com/prod`;

    //Sent GET to endpoint with Axios
    let response = await axios.post(url, {
            text
        },{
            headers: {
            'Content-Type': 'text/plain'
        }
    });
    
    return response.data.sentiment
}