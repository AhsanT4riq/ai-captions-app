import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Schema for a caption word/segment
const captionSegmentValidator = v.object({
  text: v.string(),
  start: v.number(),
  end: v.number(),
  type: v.union(v.literal('word'), v.literal('spacing'), v.literal('audio_event')),
  speaker_id: v.string(),
  characters: v.optional(
    v.array(
      v.object({
        text: v.string(),
        start: v.number(),
        end: v.number(),
      }),
    ),
  ),
});

// Schema for caption styling settings
const captionSettingsValidator = v.object({
  fontSize: v.number(),
  position: v.union(v.literal('top'), v.literal('middle'), v.literal('bottom')),
  color: v.string(),
});

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
  captions: v.optional(v.array(captionSegmentValidator)),
  captionSettings: v.optional(captionSettingsValidator),
  error: v.optional(v.string()),
  script: v.optional(v.string()),
  audioFileId: v.optional(v.id('_storage')),
  generatedVideoFileId: v.optional(v.id('_storage')),
});

export default defineSchema({
  users: defineTable(User).index('byExternalId', ['externalId']),
  projects: defineTable(Project)
    .index('byUserId', ['userId'])
    .index('byLastUpdated', ['lastUpdated']),
});
