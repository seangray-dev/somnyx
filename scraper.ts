import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
import dotenv from "dotenv";
import { dirname, resolve } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, ".env") });

// Define the type for our post
interface RedditPost {
  title: string;
  content: string;
  url: string;
  subreddit: string;
  scrapedAt: string;
}

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function scrapeDreams() {
  console.log("Starting dream scraping...");
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Navigate to subreddit
    console.log("Navigating to r/DreamInterpretation...");
    await page.goto(
      "https://www.reddit.com/r/DreamInterpretation/top/?t=week",
      {
        waitUntil: "networkidle0",
        timeout: 30000,
      }
    );

    const postUrls = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('a[href*="/r/DreamInterpretation/comments/"]')
      );
      const uniqueUrls = new Set();
      const result = [];

      for (const link of links) {
        const url = link.getAttribute("href");
        if (url && !uniqueUrls.has(url)) {
          uniqueUrls.add(url);
          result.push(url);
          if (result.length === 20) break;
        }
      }
      return result;
    });

    console.log(`Found ${postUrls.length} unique posts to process`);

    // Process each post
    for (const url of postUrls) {
      try {
        const postPage = await browser.newPage();
        await postPage.setViewport({ width: 1280, height: 800 });

        // Navigate to the post
        const fullUrl = `https://www.reddit.com${url}`;
        console.log(`Processing post: ${fullUrl}`);

        await postPage.goto(fullUrl, {
          waitUntil: "networkidle0",
          timeout: 30000,
        });

        // Extract post data using the correct selectors
        const postData = await postPage.evaluate(() => {
          const titleElement = document.querySelector('h1[slot="title"]');
          const contentElement = document.querySelector("div.md.text-14 p");

          return {
            title: titleElement?.textContent?.trim() || "",
            content: contentElement?.textContent?.trim() || "",
          };
        });

        if (postData.title && postData.content) {
          const completePost: RedditPost = {
            title: postData.title,
            content: postData.content,
            url: fullUrl,
            subreddit: "DreamInterpretation",
            scrapedAt: new Date().toISOString(),
          };

          console.log("Post data:", {
            title: completePost.title,
            contentPreview: completePost.content.substring(0, 100) + "...",
          });

          // Store the post using the correct mutation path
          const reference = anyApi.mutations.storeDreamPost;
          await convex.mutation(reference, completePost);
          console.log(`Stored post: ${completePost.title}`);
        } else {
          console.log("Failed to extract title or content from post");
        }

        await postPage.close();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay between posts
      } catch (error) {
        console.error(`Failed to process post:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error("Scraping error:", error);
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeDreams().catch(console.error);
