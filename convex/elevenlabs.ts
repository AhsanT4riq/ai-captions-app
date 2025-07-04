'use node';
import { ConvexError, v } from 'convex/values';
import { ElevenLabsClient } from 'elevenlabs';

import { internal } from './_generated/api';
import { action } from './_generated/server';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export const processVideo = action({
  args: {
    videoFileId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const file = await ctx.storage.getUrl(args.videoFileId);
    if (!file) {
      throw new ConvexError('File not found');
    }
    const response = await fetch(file);
    const videoBlob = new Blob([await response.arrayBuffer()], { type: 'video/mp4' });
    const result = await client.speechToText.convert({
      file: videoBlob,
      model_id: 'scribe_v1',
      language_code: 'eng',
    });

    const transformedWords = result.words
      .filter((word) => word.type === 'word')
      .map((word) => ({
        text: word.text,
        start: word.start ?? 0,
        end: word.end ?? (word.start ?? 0) + 0.1,
        type: word.type as 'word' | 'spacing',
        speaker_id: word.speaker_id ?? 'speaker_1',
      }));

    return {
      words: transformedWords,
      language_code: result.language_code,
    };
  },
});

// Action to generate speech from script
export const generateSpeech = action({
  args: {
    projectId: v.id('projects'),
    voiceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Get the project
      const project = await ctx.runQuery(internal.projects.getProjectById, {
        id: args.projectId,
      });

      if (!project || !project.script) {
        throw new Error('Project not found or no script available');
      }

      // Use default voice if none specified
      const voiceId = args.voiceId || 'EXAVITQu4vr4xnSDxMaL'; // Default voice ID

      // Generate speech from script
      const audioResponse = await client.textToSpeech.convert(voiceId, {
        text: project.script,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
        },
        output_format: 'mp3_44100_128',
      });

      // Convert the Readable stream to a buffer
      const chunks: Buffer[] = [];
      for await (const chunk of audioResponse) {
        chunks.push(Buffer.from(chunk));
      }
      const audioBuffer = Buffer.concat(chunks);

      // Create a Blob from the buffer
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });

      // Store audio file in Convex storage
      const audioFileId = await ctx.storage.store(audioBlob);

      // Generate captions from the audio file
      const sttResult = await client.speechToText.convert({
        file: audioBlob,
        model_id: 'scribe_v1',
        language_code: 'eng',
      });

      // Transform and filter words to match our schema
      const transformedWords = sttResult.words
        .filter((word) => word.type === 'word')
        .map((word) => ({
          text: word.text,
          start: word.start ?? 0,
          end: word.end ?? (word.start ?? 0) + 0.1,
          type: word.type as 'word' | 'spacing',
          speaker_id: word.speaker_id ?? 'speaker_1',
        }));

      // Update project with audio file ID and captions
      await ctx.runMutation(internal.projects.updateProjectById, {
        id: args.projectId,
        audioFileId,
        words: transformedWords,
        language_code: sttResult.language_code,
      });

      // Return the URL to the audio file
      return await ctx.storage.getUrl(audioFileId);
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  },
});

// Action to get available voices
export const getVoices = action({
  handler: async () => {
    try {
      const voices = await client.voices.search({
        category: 'premade',
      });
      return voices.voices.map((voice) => ({
        id: voice.voice_id,
        name: voice.name,
        previewUrl: voice.preview_url,
        description: voice.description || '',
        category: voice.category || 'other',
      }));
    } catch (error) {
      console.error('Error getting voices:', error);
      throw error;
    }
  },
});
