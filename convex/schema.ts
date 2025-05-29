import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const User = v.object({
  email: v.string(),
  externalId: v.string(),
  name: v.string(),
  imageUrl: v.optional(v.string()),
});

export const Project = v.object({
  userId: v.id('users'),
  name: v.string(),
  lastUpdated: v.number(),
  videoSize: v.number(),
  videoFileId: v.id('_storage'),
  status: v.union(
    v.literal('pending'),
    v.literal('processing'),
    v.literal('ready'),
    v.literal('failed'),
  ),
  language: v.optional(v.string()),
});

export default defineSchema({
  users: defineTable(User).index('byExternalId', ['externalId']),
  projects: defineTable(Project),
});
