import { ConvexError, v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { authorizeProject, getUser } from './auth';

export type ProjectId = Id<'projects'>;

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
      userId: user._id,
      name: args.name,
      lastUpdated: Date.now(),
      videoSize: args.videoSize,
      videoFileId: args.videoFileId,
      status: 'pending',
    });
  },
});

export const list = query(async (ctx) => {
  const user = await getUser(ctx);
  return await ctx.db
    .query('projects')
    .withIndex('byUserId', (q) => q.eq('userId', user._id))
    .collect();
});

export const get = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const { project } = await authorizeProject(ctx, args.projectId);
    return project;
  },
});

export const getFileUrl = query({
  args: {
    id: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    if (!args.id) {
      throw new ConvexError('File ID is required');
    }
    return await ctx.storage.getUrl(args.id);
  },
});

export const getFileUrlById = internalQuery({
  args: { id: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.id);
  },
});

export const updateProject = mutation({
  args: {
    id: v.id('projects'),
    name: v.optional(v.string()),
    status: v.optional(v.union(v.literal('processing'), v.literal('ready'), v.literal('failed'))),
    error: v.optional(v.string()),
    language: v.optional(v.string()),
    captions: v.optional(
      v.array(
        v.object({
          text: v.string(),
          start: v.number(),
          end: v.number(),
          type: v.union(v.literal('word'), v.literal('spacing')),
          speaker_id: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new ConvexError('Project not found');
    }
    if (updates.captions) {
      updates.status = 'ready';
    }
    return await ctx.db.patch(id, { ...updates, lastUpdated: Date.now() });
  },
});

export const updateCaptionSettings = mutation({
  args: {
    id: v.id('projects'),
    settings: v.optional(
      v.object({
        fontSize: v.number(),
        position: v.union(v.literal('top'), v.literal('middle'), v.literal('bottom')),
        color: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { id, settings } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new ConvexError('Project not found');
    }
    return await ctx.db.patch(id, { captionSettings: settings, lastUpdated: Date.now() });
  },
});

export const getProjectById = internalQuery({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateProjectById = internalMutation({
  args: {
    id: v.id('projects'),
    generatedVideoFileId: v.optional(v.id('_storage')),
    audioFileId: v.optional(v.id('_storage')),
    words: v.optional(
      v.array(
        v.object({
          text: v.string(),
          start: v.number(),
          end: v.number(),
          type: v.union(v.literal('word'), v.literal('spacing')),
          speaker_id: v.string(),
        }),
      ),
    ),
    language_code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, language_code, words, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      lastUpdated: Date.now(),
      captions: words,
      language: language_code,
    });
  },
});

// Delete a project
export const remove = mutation({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);

    if (!existing) {
      throw new ConvexError('Project not found');
    }

    // Delete the video file from storage
    await ctx.storage.delete(existing.videoFileId);
    // Delete the project record
    await ctx.db.delete(args.id);
  },
});

// Update project script
export const updateScript = mutation({
  args: {
    id: v.id('projects'),
    script: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);

    if (!existing) {
      throw new ConvexError('Project not found');
    }

    await ctx.db.patch(args.id, {
      script: args.script,
      lastUpdated: Date.now(),
    });

    return args.script;
  },
});
