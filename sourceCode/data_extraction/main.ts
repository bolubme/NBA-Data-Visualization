import { getNews } from './newsAPI';
import { readNBAData } from './nbaStats';

async function main() {
    try {
        // Fetch and store news data
        // const teams = ['Miami Heat', 'Golden State Warriors', 'Boston Celtics', 'Los Angeles Lakers', 'Minnesota Timberwolves'];
        const teams = ['Minnesota Timberwolves']
        await getNews(teams);

        // Read NBA data and store its
        // await readNBAData();

        console.log("All data processing complete");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Call the main function
main();
