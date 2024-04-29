//Import functions 
import { invokeEndpoint } from "./endpoint_config.mjs"

const endpointData = {
    "instances":
      [
        {
          "start":"13-01-2018",
          "target": [6,-9,-24,13,20,1,5,-12,-22,3,4,19,25,-7,-22,-8,22,5,19,18,4,-5,1,-9,14,9,-11,-1,-10,-3,7,-6,10,-2,-1,-7,10,-17,-15,-6,15,-9,-9,-1,18,7,-4,-4,1,4,-14,4,15,1,9,-13,16,4,7,-4,-32,8,11,24,8,-13,23,3,-15,28,-18,-5,8,-8,26,-1,-11,7,-7,-7,-22,10,13,-18,-6,7,10,-4,-19,-15,14,-16,3,-14,-42,1,-23,-4,5,-13]
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
invokeEndpoint(endpointData, "LakersEndpoint", "lakers", "Los Angeles Lakers");