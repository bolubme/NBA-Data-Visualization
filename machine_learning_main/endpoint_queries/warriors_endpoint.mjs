//Import functions 
import { invokeEndpoint } from "./endpoint_config.mjs"

const endpointData = {
    "instances":
      [
        {
          "start":"06-03-2017",
          "target": [8,-13,-1,-22,2,30,25,16,25,14,12,7,12,9,24,14,9,22,-6,15,12,29,6,25,12,11,11,26,2,36,12,14,22,19,5,-21,9,-1,8,-10,30,5,3,-8,28,20,19,17,24,21,10,-4,8,7,-17,49,15,-4,4,21,28,10,14,4,7,15,2,13,7,-15,7,25,-11,13,3,10,16,10,-19,14,2,10,7,-8,11,13,4,-30,15,-7,-20,18,17,46,-6,7,32,14,8,5]
        }
      ],
      "configuration":
         {
           "num_samples": 50,
            "output_types":["mean","quantiles","samples"],
            "quantiles":["0.1","0.9"]
         }
  }



//Calls endpoint and Save Prediction to Database
invokeEndpoint(endpointData, "WarriorsEndpoint", "warriors", "Golden State Warriors");