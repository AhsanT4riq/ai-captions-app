import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { getUser } from './auth';

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const createProject = mutation({
  args: {
    name: v.string(),
    videoSize: v.number(),
    videoFileId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    return await ctx.db.insert('projects', {
      ...args,
      userId: user._id,
      lastUpdated: Date.now(),
      status: 'pending',
    });
  },
});
