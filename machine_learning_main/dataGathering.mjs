import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import fs from "fs";

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);


/**
 * To retrieve NBA match statistics data for a specific team from DynamoDB
 * @param specificTeam, name of the team
 * @returns Formatted data object containing team name, timestamps, and score differences
 */
async function getTeamData(specificTeam) {
  console.log("Getting data for " + specificTeam);

  // Construct a query to fetch data for the specific team from DynamoDB
  const query = {
    TableName: "NbaMatchStats",
    Limit: 500,
    KeyConditionExpression: "team = :t",
    ExpressionAttributeValues: {
      ":t": specificTeam,
    },
  };
  const queryCommand = new QueryCommand(query);

  try {
    // Send the query command to DynamoDB and await the response
    const data = (await docClient.send(queryCommand)).Items;
    const scoreDifference = [];
    const timestamp = [];

    // Function to format timestamp
    function formatDate(timestampInput) {
      const timestamp = Number(timestampInput);
      const date = new Date(timestamp);

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }

    // Extract score main points and format timestamps
    for (let i = 0; i < data.length; i++) {
      scoreDifference[i] = data[i].scoreDifference;
      timestamp[i] = formatDate(data[i].timestampNba);
    }

    // Construct formatted data object
    const formatedData = {
      team_name: data[0].team,
      timestamps: timestamp,
      score_differences: scoreDifference,
    };

    return formatedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}


// Function to save data into a JSON file
function saveFile(fileName, data) {
    try {
      fs.writeFileSync(`./data/${fileName}`, JSON.stringify(data));
      console.log(`Data saved to ${fileName}`);
    } catch (err) {
      console.log("There was a error saving the file: " + err);
    }
  }

// Function to remove last 100 elements from an array the target array for training
const removeLast100FromTarget = (data) => {
  let newData = [...data];
  newData = newData.slice(0, -100);

  return newData;
};

// Function to get the 100 data for testing
function getDataForTesting(data) {
return data.slice(-100);
}

/**
 * Function to organize and save data into JSON files for main, training, and testing data
 * @param data, Formated Data from the Dyanme db
 */
function DataFile(data) {
  const mainData = {
    start: "",
    target: [],
  };

  const trainData = {
    start: "",
    target: [],
  };

  const testData = {
    start: "",
    target: [],
  };

  mainData.start = data.timestamps[0];
  mainData.target = data.score_differences;

  trainData.start = data.timestamps[0];
  trainData.target = removeLast100FromTarget(data.score_differences);

  testData.start = data.timestamps[400]
  testData.target = getDataForTesting(data.score_differences)

  

  const lowerSavingName = data.team_name.toLowerCase();
  const savingName =
    lowerSavingName.split(" ")[0] +
    lowerSavingName.split(" ")[1] +
    (lowerSavingName.split(" ")[2] || "");

  saveFile(`${savingName}.json`, mainData);
  saveFile(`${savingName}_train.json`, trainData);
  saveFile(`${savingName}_testing.json`, testData);
}

const teams = ["Boston Celtics", "Miami Heat", "Golden State Warriors", "Los Angeles Lakers", "Minnesota Timberwolves"]


for(let i = 0; i < teams.length; i++){
    const result = await getTeamData(teams[i])
    DataFile(result);
}





