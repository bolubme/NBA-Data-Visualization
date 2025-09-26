//Open connection
let connection = new WebSocket("wss://wf1jodgofl.execute-api.us-east-1.amazonaws.com/prod/");
let mainData;

//Log connected response
connection.onopen = function (event) {
  console.log("Connected: " + JSON.stringify(event));

  sendMessage();
};

//Output messages from the server
connection.onmessage = function (msg) {
  console.log("Message received. : " + JSON.stringify(msg));

  const data = JSON.parse(msg.data);
  console.log(data);
  mainData = data;

    // Check if there's an active element
    const activeElement = document.querySelector('.nav-link.active');
    if (activeElement) {
      const team = activeElement.getAttribute('data-team');
      const mainTeam = activeElement.getAttribute('data-mainTeam');
      fetchAndPlotData(activeElement, team, mainTeam);
    }
};

//Log errors
connection.onerror = function (error) {
  console.log("WebSocket Error: " + JSON.stringify(error));
};

document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent the default behavior of the link

          // Retrieve the data attributes
          const team = this.getAttribute('data-team');
          const mainTeam = this.getAttribute('data-mainTeam');

          fetchAndPlotData(this, team, mainTeam)
      });
  });
});



//Send message to server
function sendMessage() {
  //Create message to be sent to server
  let msgObject = {
    action: "wsGetData", //Used for routing in API Gateway
    data: "",
  };

  //Send message
  connection.send(JSON.stringify(msgObject));

  //Log result
  console.log("Message sent: " + JSON.stringify(msgObject));
}




function changeActive(link) {
  // Remove 'active' class from all nav links
  let navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (navLink) {
    navLink.classList.remove("active");
  });

  // Add 'active' class to the clicked nav link
  link.classList.add("active");
}

// Loop through each news article and create HTML elements to display them
function displayNews(newsArticles, teamName) {
  const newsContainer = document.getElementById("news-container");

  const newsHeader = (document.querySelector(
    ".news-header"
  ).innerHTML = `${teamName} News`);

  // Clear previous content
  newsContainer.innerHTML = "";

  // Loop through each news article and create HTML elements to display them
  newsArticles.forEach((articleText) => {
    const newsItem = document.createElement("div");
    newsItem.classList.add("news-item");

    const textElement = document.createElement("div");
    textElement.classList.add("news-text");
    textElement.textContent = articleText;

    newsItem.appendChild(textElement);

    newsContainer.appendChild(newsItem);
  });
}

function formatDateArray(timestampsArray) {
  return timestampsArray.map(timestampInput => {
    const timestamp = Number(timestampInput);
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  });
}



async function fetchAndPlotData(element, team, mainTeam) {
  let wsData = mainData;
  changeActive(element);

  document.querySelector(".team-header").innerHTML = team;

  // Image
  const teamImage = document.querySelector(".image-team");
  teamImage.src = `./images/${team.toLowerCase()}.png`;


  const xValueOriginalData = (formatDateArray(wsData[mainTeam].actual.times)).reverse();
  const yValueOriginalData = (wsData[mainTeam].actual.values).reverse();


  // Displaying News
  displayNews(wsData[mainTeam].newsData, team);

  // Plotting Predictions and Original data
  plotData(team, xValueOriginalData, yValueOriginalData, wsData[mainTeam].predictions.mean, wsData[mainTeam].predictions.lowerQuantile, wsData[mainTeam].predictions.upperQuantile, wsData, mainTeam);

  // Plotting Piechart
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  wsData[mainTeam].sentiment.sentiment.forEach((sentiment) => {
    if (sentiment > 0) {
      positiveCount++;
    } else if (sentiment < 0) {
      negativeCount++;
    } else {
      neutralCount++;
    }
  });

  const pieData = {
    team: team,
    labels: ["Positive", "Negative", "Neutral"],
    values: [positiveCount, negativeCount, neutralCount],
  };

  plotPieChart(team);

  plotPieChart(pieData);
}



async function plotData(team, xValues, yValues, predictedMean, lowerQuantile, upperQuantile, wsData, mainTeam) {

  // Data structure for Plotly
  let mainOriginalData = {
    x: xValues,
    y: yValues,
    type: "scatter",
    mode: "line",
    name: "Original Data",
    marker: {
      color: "rgb(200, 64, 82)",
      size: 7,
    },
  };


console.log(mainTeam)
let startDateStr = ""

switch (mainTeam) {
  case "Los Angeles Lakers":
    startDateStr = "25-02-2019"
    break;
  case "Boston Celtics":
    startDateStr = "07-11-2018"
    break;
  case "Miami Heat":
    startDateStr = "21-04-2018"
    break;
  case "Golden State Warriors":
    startDateStr = "04-03-2018"
    break;
  case "Minnesota Timberwolves":
    startDateStr = "09-02-2019"
    break;  
  default:
    startDateStr = "01-01-2019"
    break;
}

console.log(startDateStr)

const startDateParts = startDateStr.split("-"); 
const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]);

let predictionValueX = []



  for (let i = 0; i < predictedMean.length; i++){
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + i * 2);
    const formattedDate = `${newDate.getDate().toString().padStart(2, '0')}-${(newDate.getMonth() + 1).toString().padStart(2, '0')}-${newDate.getFullYear()}`;
    predictionValueX.push(formattedDate);
  }

  console.log("Prediction Value of X:" ,predictionValueX)

  

  let predictionDataMean = {
    x: predictionValueX,
    y: predictedMean,
    type: "scatter",
    mode: "line",
    name: "Mean",
    marker: {
      color: "rgb(65, 105, 225)",
      size: 8,
    },
  };

  let prediction01Quantile = {
    x: predictionValueX,
    y: lowerQuantile,
    type: "scatter",
    mode: "line",
    name: "Prediction 0.1%",
    marker: {
      color: "rgb(34, 139, 34)",
      size: 8,
    },
  };

  let prediction09Quantile = {
    x: predictionValueX,
    y: upperQuantile,
    type: "scatter", 
    mode: "line",
    name: "Prediction 0.9%",
    marker: {
      color: "rgb(250, 179, 0)",
      size: 8,
    },
  };

  let graphData = [
    mainOriginalData,
    predictionDataMean,
    prediction09Quantile,
    prediction01Quantile,
  ];

  // Layout of the graph
  let layout = {
    title: `${team} Scoring Trends Over Time`,
    font: {
      size: 15,
    },
    xaxis: {
      title: {
        text: "<b>Date</b>",
        standoff: 10,
      },
    },
    yaxis: {
      title: "<b>Score Difference</b>",
    },
    hoverlabel: {
      align: "auto",
    },
    margin: {
      t: 50, 
      l: 60, 
      r: 50, 
      b: 150, 
    },
    width: 1000,
    height: 580,
    paper_bgclor: "rgba(255, 255, 255, 0.8)",
  };

  // Plot the graph using Plotly.js
  Plotly.newPlot("plot", graphData, layout);
}

function plotPieChart(pieData) {
  // Data structure for the pie chart
  const data = [
    {
      values: pieData.values,
      labels: pieData.labels,
      type: "pie",
    },
  ];

  // Layout options for the pie chart
  const layout = {
    title: `Sentiment Data for ${pieData.team}`,
  };

  // Plot the pie chart
  Plotly.newPlot("pieChart", data, layout);
}


