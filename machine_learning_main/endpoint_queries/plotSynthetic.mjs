//Axios will handle HTTP requests to web service
import axios from 'axios'
import predictions from '../data/wolves_prediction.json' assert { type: "json" };
import mainData from '../data/minnesotatimberwolves.json' assert {type: "json"}

//Authentication details for Plotly
//ADD YOUR OWN AUTHENTICATION DETAILS
const PLOTLY_USERNAME = 'bolu_bme';
const PLOTLY_KEY = 'cvetXVg3vZ90VHd2luoG';

//Initialize Plotly with user details.
import Plotly from 'plotly';
import { type } from 'os';
let plotly = Plotly(PLOTLY_USERNAME, PLOTLY_KEY);


async function handler(event) {
    try {
        //Get synthetic data
        let yValues = mainData.target

        //Add basic X values for plot
        let xValues = [];
        for(let i=0; i<yValues.length; ++i){
            xValues.push(i);
        }

        //Call function to plot data
        let plotResult = await plotData("Boston", xValues, yValues);
        console.log("Plot for student '" + "Boston" + "' available at: " + plotResult.url);

        return {
            statusCode: 200,
            body: "Ok"
        };
    }
    catch (err) {
        console.log("ERROR: " + JSON.stringify(err));
        return {
            statusCode: 500,
            body: "Error plotting data for student ID: " + "Boston"
        };
    }
};

//Plots the specified data
async function plotData(studentID, xValues, yValues){
    //Data structure
    let studentData = {
        x: xValues,
        y: yValues,
        type: "scatter",
        mode: 'line',
        name: "Original Data",
        marker: {
            color: 'rgb(200, 64, 82)',
            size: 12
        }
    };

    let predictionValueX = [];
    for (let i = yValues.length; i < yValues.length + predictions.mean.length; ++i){
        predictionValueX.push(i)
    }

    let predictionDataMean = {
        x: predictionValueX,
        y: predictions.mean,
        type: "scatter",
        mode: 'line',
        name: "Mean",
        marker: {
            color: 'rgb(65, 105, 225)',
            size: 12
        }
    }

    let prediction01Quantile = {
        x: predictionValueX,
        y: predictions.quantiles["0.1"],
        type: "scatter",
        mode: 'line',
        name: "Prediction 0.1 Quantile",
        marker: {
            color: 'rgb(34, 139, 34)',
            size: 12
        }
    }

    let prediction09Quantile = {
        x: predictionValueX,
        y: predictions.quantiles["0.9"],
        type: "scatter",
        mode: 'line',
        name: "Prediction 0.9 Quantile",
        marker: {
            color: 'rgb(250, 179, 0)',
            size: 12
        }
    }

    

    let data = [studentData, predictionDataMean, prediction01Quantile, prediction09Quantile];

    //Layout of graph
    let layout = {
        title: "Synthetic Data for Student " + studentID,
        font: {
            size: 25
        },
        xaxis: {
            title: 'Time (hours)'
        },
        yaxis: {
            title: 'Value'
        }
    };
    let graphOptions = {
        layout: layout,
        filename: "date-axes",
        fileopt: "overwrite"
    };

    //Wrap Plotly callback in a promise
    return new Promise ( (resolve, reject)=> {
        plotly.plot(data, graphOptions, function (err, msg) {
            if (err)
                reject(err);
            else {
                resolve(msg);
            }
        });
    });
};


handler();