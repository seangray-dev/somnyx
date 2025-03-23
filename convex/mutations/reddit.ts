import { v } from "convex/values";

import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";

export const storeDreamPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    url: v.string(),
    subreddit: v.string(),
    scrapedAt: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if post already exists
    const existingPost = await ctx.db
      .query("redditPosts")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();

    if (existingPost) {
      console.log(`Post already exists: ${args.title}`);
      return existingPost._id;
    }

    // Store new post
    const postId = await ctx.db.insert("redditPosts", {
      title: args.title,
      content: args.content,
      url: args.url,
      subreddit: args.subreddit,
      scrapedAt: args.scrapedAt,
      processed: false,
    });

    return postId;
  },
});

export const processRedditPostAsInterpretation = internalMutation({
  args: {
    postId: v.id("redditPosts"),
  },
  handler: async (ctx, args) => {
    // Get the post
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Skip if already processed
    if (post.processed) {
      console.log(`Post ${post._id} already processed, skipping`);
      return;
    }

    try {
      // Generate themes and symbols
      await ctx.scheduler.runAfter(
        0,
        // @ts-ignore
        internal.mutations.openai.generateDreamThemesFree,
        {
          source: {
            type: "interpretation",
            sourceType: "reddit",
            id: post._id,
          },
          details: post.content,
        }
      );

      // Mark post as processed
      await ctx.db.patch(args.postId, {
        processed: true,
        processedAt: new Date().toISOString(),
      });

      console.log(`Successfully processed post ${post._id}`);
    } catch (error) {
      console.error(`Failed to process post ${post._id}:`, error);
      throw error;
    }
  },
});

// Batch process function to handle multiple posts
export const batchProcessRedditPosts = internalMutation({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;

    // Get unprocessed posts
    const totalPosts = await ctx.db.query("redditPosts").collect();
    const unprocessedPosts = totalPosts.filter((post) => !post.processed);

    // const unprocessedPosts = await ctx.db
    //   .query("redditPosts")
    //   .filter((q) => q.eq(q.field("processed"), !true))
    //   .take(limit);

    console.log(
      `Found ${unprocessedPosts.length} unprocessed posts out of ${totalPosts.length}`
    );

    let processedCount = 0;
    // Process each post
    for (const post of unprocessedPosts) {
      try {
        await ctx.runMutation(
          // @ts-ignore
          internal.mutations.reddit.processRedditPostAsInterpretation,
          {
            postId: post._id,
          }
        );
        processedCount++;
      } catch (error) {
        console.error(`Failed to process post ${post._id}:`, error);
        continue;
      }
    }

    return processedCount;
  },
});

// Function to remove duplicate posts based on content similarity
export const removeDuplicatePosts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allPosts = await ctx.db.query("redditPosts").collect();
    const seen = new Set();
    const duplicates = [];

    // Helper function to normalize text for comparison
    const normalizeText = (text: string) => {
      return text.toLowerCase().replace(/[^a-z0-9]/g, "");
    };

    for (const post of allPosts) {
      const normalizedContent = normalizeText(post.content);
      if (seen.has(normalizedContent)) {
        duplicates.push(post._id);
      } else {
        seen.add(normalizedContent);
      }
    }

    // Delete duplicate posts
    for (const duplicateId of duplicates) {
      await ctx.db.delete(duplicateId);
    }

    return duplicates.length;
  },
});

// Dashboard function to clean up duplicate posts
export const cleanupDuplicatePostsDashboard = mutation({
  args: {},
  handler: async (ctx) => {
    const allPosts = await ctx.db.query("redditPosts").collect();
    const seen = new Map();
    const duplicates = [];

    // Helper function to normalize text for comparison
    const normalizeText = (text: string) => {
      return text.toLowerCase().replace(/[^a-z0-9]/g, "");
    };

    // First pass: store normalized content and first occurrence
    for (const post of allPosts) {
      const normalizedContent = normalizeText(post.content);
      if (seen.has(normalizedContent)) {
        duplicates.push({
          id: post._id,
          title: post.title,
          originalId: seen.get(normalizedContent),
        });
      } else {
        seen.set(normalizedContent, post._id);
      }
    }

    // Delete duplicate posts
    let deletedCount = 0;
    const deletedPosts = [];
    for (const duplicate of duplicates) {
      await ctx.db.delete(duplicate.id);
      deletedPosts.push(duplicate.title);
      deletedCount++;
    }

    // Return detailed report
    return {
      totalPosts: allPosts.length,
      duplicatesRemoved: deletedCount,
      deletedPosts: deletedPosts,
      timestamp: new Date().toISOString(),
    };
  },
});

// Simple content-only duplicate check
export const checkDuplicateContent = mutation({
  args: {},
  handler: async (ctx) => {
    const allPosts = await ctx.db.query("redditPosts").collect();
    const contentMap = new Map();

    // Group by exact content
    for (const post of allPosts) {
      const content = post.content;
      if (!contentMap.has(content)) {
        contentMap.set(content, []);
      }
      contentMap.get(content).push(post._id);
    }

    // Find duplicates (any content that appears more than once)
    const duplicates = Array.from(contentMap.entries())
      .filter(([_, ids]) => ids.length > 1)
      .map(([content, ids]) => ({
        content: content.substring(0, 100) + "...", // Preview of content
        postIds: ids,
        count: ids.length,
      }));

    return {
      totalPosts: allPosts.length,
      duplicateContents: duplicates,
      summary: `Found ${duplicates.length} pieces of content that appear in multiple posts`,
    };
  },
});
