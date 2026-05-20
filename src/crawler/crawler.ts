import { Frontier } from "./frontier.js"
import { fetchPages } from "./fetcher.js";
import { extractLinks } from "./parser.js";
import { convertIntoAbsoluteUrls, filterPipeline, getUniqueUrls } from "./urlManager.js";
// const Frontier = require("./frontier.ts")
const seedUrl = "https://www.wikipedia.org/"
const frontier = Frontier();

export async function Crawl() {
    // Start by adding the seed URL to the frontier
    frontier.enqueue(seedUrl);

    console.log(`Starting crawl from: ${seedUrl}`);

    while (!frontier.isEmpty()) {
        // Get the next URL from the queue
        const currentUrl = frontier.dequeue();
        console.log("Current Url being crawled : ", currentUrl)
        if (!currentUrl) continue;

        // Skip if we've already been here
        if (frontier.hasVisited(currentUrl)) {
            console.log(`Already visited: ${currentUrl}`);
            continue;
        }

        console.log(`\n>>> Processing: ${currentUrl}`);

        // 1. Fetch the page content
        const html = await fetchPages(currentUrl);

        // Mark as visited regardless of success to avoid infinite retries on broken links
        frontier.addToVisited(currentUrl);


        if (!html) {
            console.log(`Skipping: No content retrieved from ${currentUrl}`);
            continue;
        }


        // 2. Extract links from the HTML
        const rawLinks = await extractLinks(html);

        // 3. Filter out junk (admin pages, files, mailto, etc.)
        const filteredLinks = filterPipeline(rawLinks);

        // 4. Remove duplicates found on this specific page
        const uniqueLinks = getUniqueUrls(filteredLinks);

        // 5. Convert relative links to absolute URLs
        const absoluteURLs = convertIntoAbsoluteUrls(uniqueLinks, currentUrl);

        console.log(`Found ${absoluteURLs.length} valid links. Adding to queue...`);

        // 6. Push discovered links into the frontier for future crawling
        for (const nextUrl of absoluteURLs) {
            frontier.enqueue(nextUrl);
        }
    }

    console.log("\nCrawl completed! No more URLs in frontier(Queue).");

}




/*
jab tak queue kahali na ho tab tak fetcher call kart raho






*/