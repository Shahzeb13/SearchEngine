import axios, { isAxiosError } from "axios";

export async function fetchPages(url: string, retries = 2) {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'MrImperfectCrawler/1.0',
          'Accept': 'text/html',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      return response.data;

    } catch (err: unknown) {

      if (isAxiosError(err)) {

        // If timeout or network issue → retry
        if (!err.response) {
          console.log(`Attempt ${attempt} failed (network/timeout)`);

          if (attempt <= retries) {
            console.log("Retrying...");
            continue;
          }
        }

        // If server responded with 4xx → don't retry
        if (err.response && err.response.status >= 400 && err.response.status < 500) {
          console.log(`Client error ${err.response.status}. Skipping.`);
          return null;
        }
      }

      // If max retries reached
      if (attempt > retries) {
        console.log("Max retries reached. Skipping.");
        return null;
      }
    }
  }
}