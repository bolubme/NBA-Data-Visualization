//Import functions 
import { invokeEndpoint } from "./endpoint_config.mjs"

const endpointData = {
    "instances":
      [
        {
          "start":"08-01-2018",
          "target": [28,16,10,17,-6,-18,6,8,-9,-13,14,-5,-5,19,11,-2,-1,5,-18,8,-18,18,18,-9,-8,-8,6,5,-16,-9,14,4,-12,-8,12,1,-24,-4,17,19,6,-3,-20,16,-19,-18,-4,8,-4,10,-7,-30,4,3,-17,-30,-11,-4,-11,7,7,16,-13,-2,10,15,7,39,-9,12,17,-8,-8,-11,-8,27,-6,-26,2,25,-3,9,-9,-13,17,22,2,-4,4,-42,-3,2,27,15,-4,-14,2,-1,-2,-10]
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
invokeEndpoint(endpointData, "WolvesEndpoint", "wolves", "Minnesota Timberwolves");