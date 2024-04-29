//Import functions 
import { invokeEndpoint } from "./endpoint_config.mjs"

const endpointData = {
    "instances":
      [
        {
          "start":"15-03-2017",
          "target": [8,18,-11,15,-17,-4,1,17,-4,-3,13,-2,3,3,8,-7,4,11,-17,-6,-3,6,-1,3,-17,11,10,-9,-9,3,-25,6,12,7,-11,-29,5,-28,-12,12,25,-7,6,5,-6,1,12,-15,18,-24,6,7,4,1,1,8,18,-8,5,-6,1,-9,-1,4,7,-2,-6,-4,-2,-8,6,-3,-2,-1,26,1,-18,9,22,-4,9,27,-16,-4,1,8,21,-6,-6,19,11,-1,3,29,-24,-22,7,-27,10,-20]
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
invokeEndpoint(endpointData, "MiamiEndpoint", "miami", "Miami Heat");