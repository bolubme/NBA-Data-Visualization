//Import external library with websocket functions
import { getSendDataPromises, sendData } from "./websocket.mjs";
import { getData } from "./database.mjs";

const domian = "wf1jodgofl.execute-api.us-east-1.amazonaws.com";
const stage = "prod";

export const handler = async (event) => {
  console.log(event);

  // broadcast new data to all connected clients when the database changes.
  if (event.Records !== undefined) {
    for (let record of event.Records) {
      if (record.eventName === "INSERT" || record.eventName === "REMOVE") {
        try {
          const data = await getData();

          // Get promises to send Data to connected clients
          let sendDataPromise = await getSendDataPromises(
            JSON.stringify(data),
            domian,
            stage
          );
          
          //Execute Promises
          await Promise.all(sendDataPromise)
          
        } catch (err) {
          return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
        }
        console.log("A new Data has been added")
      }
    }
  } else {
    // Send data to a single client when it connects.
    try {
      let connId = event.requestContext.connectionId;

      const domain = event.requestContext.domainName;
      const stage = event.requestContext.stage;

      // Get Data
      const data = await getData();

      // Get promise and send data to client
      let sendDataPromise = await sendData(
        connId,
        domain,
        stage,
        JSON.stringify(data)
      );

      await Promise.all(sendDataPromise);
    } catch (err) {
      return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }
  }

  // Success
  return { statusCode: 200, body: "Data sent successfully." };
};
