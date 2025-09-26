// newsAPI.ts
import { saveNewsData } from './database';

const NewsAPI = require('newsapi');
require('dotenv').config();

interface Article {
    title: string;
    publishedAt: string;
}

interface NewsAPIResult {
    articles: Article[];
}

export async function getNews(teams: string[]): Promise<void> {
    if (!process.env.NEWS_API_KEY) {
        console.error("NEWS_API_KEY is not set in the environment variables.");
        return;
    }

    // Create a new NewsAPI instance with your API key
    const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

    for (const team of teams) {
        try {
            const result: NewsAPIResult = await newsapi.v2.everything({
                q: team,
                pageSize: 100,
                language: 'en'
            });

            console.log(`Number of articles for ${team}: ${result.articles.length}`);
            for (let article of result.articles) {
                const date = new Date(article.publishedAt);
                const publishedAtMain = `${date.getTime()}`

                // Store article data in DynamoDB
                await saveNewsData(article.title, publishedAtMain, team);
                console.log(`Unix Time: ${publishedAtMain} ; title: ${article.title} ; Team: ${team}`);

            }
        } catch (error) {
            console.error(`Error fetching news for ${team}:`, error);
        }
    }
}


