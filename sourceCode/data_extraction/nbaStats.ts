// nbaStats.ts

import csv = require("csv-parser");
import { createReadStream } from "fs";
import { saveNBAData } from "./database";

interface NBA {
  datetime: string;
  homeTeam: string;
  awayTeam: string;
  pointsHome: string;
  pointsAway: string;
}

export async function readNBAData(): Promise<void> {
  const csvFile: string = "games.csv";
  const dataFolder: string = "data";

  // const teams: string[] = ['Miami Heat', 'Golden State Warriors', 'Boston Celtics', 'Los Angeles Lakers', 'Minnesota Timberwolves'];
  const teams: string[] = ["Minnesota Timberwolves"];

  for (const team of teams) {
    let counter: number = 0;

    console.log(`Reading NBA data for ${team}...`);

    await new Promise<void>((resolve, reject) => {
      createReadStream(`${dataFolder}/${csvFile}`)
        .pipe(csv())
        .on("data", (data: NBA) => {
          const date = new Date(data.datetime);
          const YearsAgo = new Date();
          YearsAgo.setFullYear(YearsAgo.getFullYear() - 11);

          if (
            date >= YearsAgo &&
            (data.homeTeam === team || data.awayTeam === team)
          ) {
            let scoreDifference: number;
            if (data.homeTeam === team) {
              scoreDifference =
                parseInt(data.pointsHome) - parseInt(data.pointsAway);
            } else if (data.awayTeam === team) {
              scoreDifference =
                parseInt(data.pointsAway) - parseInt(data.pointsHome);
            }

            let score: number;

            if (scoreDifference <= -30) {
              score = 0;
            } else if (scoreDifference <= -20) {
              score = 1;
            } else if (scoreDifference <= -10) {
              score = 2;
            } else if (scoreDifference <= -5) {
              score = 3;
            } else if (scoreDifference <= -1) {
              score = 4;
            } else if (scoreDifference === 0) {
              score = 5;
            } else if (scoreDifference <= 4) {
              score = 6;
            } else if (scoreDifference <= 9) {
              score = 7;
            } else if (scoreDifference <= 19) {
              score = 8;
            } else if (scoreDifference <= 29) {
              score = 9;
            } else {
              score = 10;
            }

            const timestamp = `${date.getTime()}`;
            const homeTeam = data.homeTeam;
            const awayTeam = data.awayTeam;

            // Store NBA data in DynamoDB
            saveNBAData(
              team,
              homeTeam,
              timestamp,
              awayTeam,
              score,
              scoreDifference
            );
            console.log(
              `Team:${team} ${++counter},| UnixTime: ${timestamp},| Home Team: ${homeTeam},| Away Team: ${awayTeam},| points: ${score},| score difference: ${scoreDifference} `
            );
          }
        })
        .on("end", () => {
          console.log(`Data reading complete for ${team}`);
          resolve();
        })
        .on("error", (error: any) => {
          console.error(`Error reading data for ${team}: ${error}`);
          reject(error);
        });
    });
  }

  console.log("All data reading complete");
}
