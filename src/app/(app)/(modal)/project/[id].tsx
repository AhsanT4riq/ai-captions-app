import { Ionicons } from '@expo/vector-icons';
import { useAction, useMutation, useQuery } from 'convex/react';
import { useEvent } from 'expo';
import { useAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { cssInterop } from 'nativewind';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { api } from '~/convex/_generated/api';
import { ProjectId } from '~/convex/projects';

import { CaptionControls } from '@/components/CaptionControls';
import {
  CaptionSettings,
  CaptionsOverlay,
  DEFAULT_CAPTION_SETTINGS,
} from '@/components/CaptionsOverlay';
import { VideoControls } from '@/components/VideoControls';
import { VoiceSelectionModal } from '@/components/VoiceSelectionModal';
import { formatTime } from '@/utils/formatDuration';

cssInterop(VideoView, {
  className: {
    target: 'style',
  },
});

export default function Project() {
  const { id } = useLocalSearchParams();

  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [showCaptionControls, setShowCaptionControls] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [captionSettings, setCaptionSettings] = useState<CaptionSettings>(DEFAULT_CAPTION_SETTINGS);

  const [showScriptModal, setShowScriptModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [script, setScript] = useState<string>('');
  const [isSavingScript, setIsSavingScript] = useState(false);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  const project = useQuery(api.projects.get, { projectId: id as ProjectId });

  const updateProject = useMutation(api.projects.updateProject);
  const updateCaptionSettings = useMutation(api.projects.updateCaptionSettings);
  const updateProjectScript = useMutation(api.projects.updateScript);

  const processVideo = useAction(api.elevenlabs.processVideo);
  const generateSpeech = useAction(api.elevenlabs.generateSpeech);
  const generateCaptionedVideo = useAction(api.exportvideo.generateCaptionedVideo);

  const videoUrl = useQuery(
    api.projects.getFileUrl,
    project?.videoFileId ? { id: project?.videoFileId } : 'skip',
  );

  const player = useVideoPlayer(videoUrl || null, (player) => {
    player.loop = true;
    player.timeUpdateEventInterval = 1;
  });

  const audioUrl = useQuery(
    api.projects.getFileUrl,
    project?.audioFileId ? { id: project?.audioFileId } : 'skip',
  );

  const audioPlayer = useAudioPlayer(audioUrl || null);

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  console.log('🚀 ~ Project ~ currentTime:', currentTime);
  console.log('🚀 ~ Project ~ isPlaying:', isPlaying);

  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        setCurrentTime(player.currentTime);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [player]);

  useEffect(() => {
    if (project?.captionSettings) {
      setCaptionSettings(project.captionSettings);
    }
  }, [project?.captionSettings]);

  useEffect(() => {
    if (audioPlayer && player) {
      if (isPlaying) {
        player.muted = true;
        audioPlayer.play();
        player.currentTime = audioPlayer.currentTime;
      } else {
        audioPlayer.pause();
      }
    }
  }, [audioPlayer, player, isPlaying]);

  useEffect(() => {
    if (project?.script) {
      setScript(project.script);
    }
  }, [project?.script]);

  const onGenerateCaptions = async () => {
    if (!project) return;
    try {
      setIsGenerating(true);

      // Update the project status to processing
      await updateProject({
        id: project._id,
        status: 'processing',
      });

      // Generate captions with ElevenLabs
      const videoId = project.videoFileId;

      const captions = await processVideo({ videoFileId: videoId });

      // Update the project status to ready
      await updateProject({
        id: project._id,
        captions: captions.words,
        language: captions.language_code,
        status: 'ready',
      });
    } catch (error) {
      console.error(error);
      // Update the project status to failed
      await updateProject({
        id: project._id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCaptionSettingsChange = async (newSettings: CaptionSettings) => {
    if (!project) return;
    try {
      setIsUpdatingSettings(true);
      await updateCaptionSettings({
        id: project._id,
        settings: newSettings,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const onShowCaptionControls = () => setShowCaptionControls(!showCaptionControls);

  const onShowScriptModal = () => setShowScriptModal(!showScriptModal);

  const onGenerateSpeech = async (voiceId?: string) => {
    if (!project) return;
    try {
      setIsGeneratingAudio(true);

      const audioUrl = await generateSpeech({
        projectId: project._id,
        voiceId: voiceId || selectedVoice || undefined,
      });
      if (audioUrl) {
        // Reset video and audio to beginning and start playback
        if (player) {
          player.currentTime = 0;
          player.play();
        }
      }
    } catch (error) {
      console.error('Failed to generate speech:', error);
      Alert.alert('Error', 'Failed to generate speech. Please try again.');
    } finally {
      setIsGeneratingAudio(false);
      setShowScriptModal(false);
    }
  };

  const onExportVideo = async () => {
    if (!project) return;
    try {
      setIsExporting(true);

      // Request media library permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required to export video.');
        return;
      }

      const videoUrl = await generateCaptionedVideo({ id: project._id });
      if (videoUrl) {
        // Save video to media library
        const fileUri = FileSystem.documentDirectory + `exported_video_${Date.now()}.mp4`;
        const download = await FileSystem.downloadAsync(videoUrl, fileUri);
        console.log('Downloaded file to:', download.uri);

        if (download.status === 200) {
          const asset = await MediaLibrary.createAssetAsync(download.uri);
          await FileSystem.deleteAsync(fileUri);

          Alert.prompt('Exported Video', 'Video exported successfully. Do you want to open it?', [
            {
              text: 'View in Library',
              onPress: async () => {
                const album = await MediaLibrary.getAlbumAsync('Captions Editor');

                if (!album) {
                  await MediaLibrary.createAlbumAsync('Captions Editor', asset, false);
                } else {
                  await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
                }
                await Linking.openURL('photos-redirect://');
              },
            },
            {
              text: 'Cancel',
              onPress: () => {},
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to export video:', error);
      Alert.alert('Error', 'Failed to export video. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (project === undefined) {
    return (
      <View className="flex-1 bg-dark items-center justify-center">
        <Text className="text-white text-md font-Poppins_500Medium">Loading project...</Text>
      </View>
    );
  }

  return (
    <View className={`bg-dark p-4 flex-1`}>
      <Stack.Screen
        options={{
          title: project?.name,
          headerRight: () => (
            <TouchableOpacity
              disabled={isExporting}
              onPress={onExportVideo}
              className={`bg-primary rounded-xl p-2 px-3 ${isExporting ? 'opacity-50' : ''}`}
            >
              <Text className="text-white text-md font-Poppins_600SemiBold">Export</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Video Player */}
      <View className="mt-5 items-center">
        <VideoView
          player={player}
          nativeControls={false}
          className="w-4/5 h-4/5"
          // contentFit="cover"
        />
        {project.captions && (
          <CaptionsOverlay
            captions={project.captions}
            currentTime={currentTime}
            fontSize={captionSettings.fontSize}
            position={captionSettings.position}
            color={captionSettings.color}
          />
        )}

        <View className="w-3/4 flex-row items-center justify-between mt-4 bg-secondary p-3 rounded-full px-4">
          <TouchableOpacity
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-medium self-center">
            {formatTime(currentTime)} / {formatTime(player?.duration || 0)}
          </Text>
          {/* <View style={{ width: 40 }} /> */}
        </View>
      </View>
      <VideoControls
        isGenerating={isGenerating}
        projectStatus={project.status}
        onGenerateCaptions={onGenerateCaptions}
        onShowCaptionControls={onShowCaptionControls}
        onShowScriptModal={onShowScriptModal}
      />
      {/* Caption controls */}
      {showCaptionControls && (
        <CaptionControls
          captionSettings={captionSettings}
          isUpdatingSettings={isUpdatingSettings}
          onCaptionSettingsChange={handleCaptionSettingsChange}
        />
      )}
      {/* Script modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showScriptModal}
        onRequestClose={() => setShowScriptModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-1 justify-end">
            <View className="bg-secondary rounded-t-3xl p-6 h-1/2">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-xl font-Poppins_600SemiBold">Add Script</Text>
                <TouchableOpacity onPress={() => setShowScriptModal(false)}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <TextInput
                className="bg-neutral-800 text-white p-4 rounded-xl h-[60%] mb-4"
                multiline
                placeholder="Paste or write your script here..."
                placeholderTextColor="#666"
                value={script}
                onChangeText={setScript}
                textAlignVertical="top"
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      setIsSavingScript(true);
                      await updateProjectScript({ id: id as ProjectId, script });
                      setShowScriptModal(false);
                    } catch (error) {
                      console.error('Failed to save script:', error);
                      Alert.alert('Error', 'Failed to save script. Please try again.');
                    } finally {
                      setIsSavingScript(false);
                    }
                  }}
                  disabled={isSavingScript}
                  className={`flex-1 bg-primary p-4 rounded-xl ${isSavingScript ? 'opacity-50' : ''}`}
                >
                  <Text className="text-white text-center font-Poppins_600SemiBold">
                    {isSavingScript ? 'Saving...' : 'Save Script'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowScriptModal(false); // Close script modal first
                    setTimeout(() => setShowVoiceModal(true), 100); // Open voice modal after a short delay
                  }}
                  disabled={isGeneratingAudio || !script}
                  className={`flex-1 bg-neutral-800 p-4 rounded-xl ${isGeneratingAudio || !script ? 'opacity-50' : ''}`}
                >
                  <Text className="text-white text-center font-Poppins_600SemiBold">
                    {isGeneratingAudio ? 'Generating...' : 'Select Voice'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* Voice selection modal */}
      {showVoiceModal && (
        <View className="absolute inset-0 z-[100]">
          <VoiceSelectionModal
            visible={showVoiceModal}
            onClose={() => setShowVoiceModal(false)}
            onSelectVoice={(voiceId) => {
              setSelectedVoice(voiceId);
              setShowVoiceModal(false);
              onGenerateSpeech(voiceId);
            }}
          />
        </View>
      )}
      {/* Exporting video overlay */}
      {isExporting && (
        <View className="absolute inset-0 bg-dark/50 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white text-center font-Poppins_500Medium text-md">
            Exporting video...
          </Text>
        </View>
      )}
      {/* Generating video overlay */}
      {isGenerating && (
        <View className="absolute inset-0 bg-dark/50 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white text-center font-Poppins_500Medium text-md">
            Generating captions...
          </Text>
        </View>
      )}
      {/* Generating audio overlay */}
      {isGeneratingAudio && (
        <View className="absolute inset-0 bg-dark/50 items-center justify-center gap-3">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white text-center font-Poppins_500Medium text-md">
            Generating audio...
          </Text>
        </View>
      )}
    </View>
  );
}
