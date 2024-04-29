//Import functions 
import { invokeEndpoint } from "./endpoint_config.mjs"



const endpointData = {
    "instances":
      [
        {
          "start":"08-11-2017",
          "target": [11,3,1,7,4,11,8,-6,15,10,-10,11,5,11,7,-3,10,-23,6,-12,9,1,-1,-9,25,-8,11,1,3,14,7,2,11,-3,-9,-8,-1,11,-4,1,30,9,1,-20,6,-6,-22,-10,12,9,11,28,-3,16,8,-2,-1,9,-19,1,5,11,8,3,11,-4,-18,7,-6,-12,13,6,14,-24,-2,5,-11,16,16,5,3,-11,2,25,13,-30,-9,13,-10,-8,18,-12,2,-3,6,20,3,4,-1,-8]
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
invokeEndpoint(endpointData, "BostonEndpoint", "boston", "Boston Celtics");




