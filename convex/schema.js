import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
 users: defineTable({
    createdAt: v.float64(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    lastActiveAt: v.float64(),
    name: v.string(),
    tokenIdentifier: v.string(),
    username: v.optional(v.string()),

    // 👇 Add these new fields
    exportsThisMonth: v.optional(v.float64()),
    plan: v.optional(v.string()),          // e.g. "free" or "pro"
    projectsUsed: v.optional(v.float64()), // number of projects used
  })

    .index("by_token", ["tokenIdentifier"]) // Primary auth lookup
    .index("by_email", ["email"]) // Email lookups
    .index("by_username", ["username"]) // Username lookup for public profiles
    .searchIndex("search_name", { searchField: "name" }) // User search
    .searchIndex("search_email", { searchField: "email" }),

  // Posts/Articles - Main content
  posts: defineTable({
    title: v.string(),
    content: v.string(), // Rich text content (JSON string or HTML)
    status: v.union(v.literal("draft"), v.literal("published")),

    // Author relationship
    authorId: v.id("users"),

    // Content metadata
    tags: v.array(v.string()),
    category: v.optional(v.string()), // Single category
    featuredImage: v.optional(v.string()), // ImageKit URL

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()), // For scheduled publishing

    // Analytics
    viewCount: v.number(),
    likeCount: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_published", ["status", "publishedAt"])
    .index("by_author_status", ["authorId", "status"])
    .searchIndex("search_content", { searchField: "title" }),

  // Comments system
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.optional(v.id("users")), // Optional for anonymous comments
    authorName: v.string(), // For anonymous or display name
    authorEmail: v.optional(v.string()), // For anonymous comments

    content: v.string(),
    status: v.union(
      v.literal("approved"),
      v.literal("pending"),
      v.literal("rejected")
    ),

    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_post_status", ["postId", "status"])
    .index("by_author", ["authorId"]),

  // Likes system
  likes: defineTable({
    postId: v.id("posts"),
    userId: v.optional(v.id("users")), // Optional for anonymous likes

    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_user", ["postId", "userId"]), // Prevent duplicate likes

  // Follow/Subscribe system (combines following and newsletter subscription)
  follows: defineTable({
    followerId: v.id("users"), // User doing the following
    followingId: v.id("users"), // User being followed

    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_relationship", ["followerId", "followingId"]), // Prevent duplicates

  // Daily analytics tracking
  dailyStats: defineTable({
    postId: v.id("posts"),
    date: v.string(), // YYYY-MM-DD format for easy querying
    views: v.number(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_date", ["date"])
    .index("by_post_date", ["postId", "date"]), // Unique constraint
});
