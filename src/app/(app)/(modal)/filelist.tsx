import { useMutation } from 'convex/react';
import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-media-library';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { api } from '~/convex/_generated/api';

import { useMediaPermissions } from '@/hooks/useMediaPermissions';
import { formatDuration } from '@/utils/formatDuration';

export default function FileList() {
  const { granted, error, status } = useMediaPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [media, setMedia] = useState<MediaLibrary.Asset[]>([]);
  const router = useRouter();

  const getVideoAssets = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'video',
        sortBy: ['creationTime'],
      });
      setMedia(media.assets);
    } catch (error) {
      console.error(error);
    }
  };

  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  const createProject = useMutation(api.projects.createProject);

  useEffect(() => {
    if (granted) {
      getVideoAssets();
    }
  }, [granted, status]);

  if (error) {
    console.error(error);
  }

  const onSelectVideo = async (video: MediaLibrary.Asset) => {
    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();

      const fileInfo = await MediaLibrary.getAssetInfoAsync(video);
      console.log('fileInfo', JSON.stringify(fileInfo, null, 2));

      const videoUri = fileInfo.localUri;
      console.log('videoUri', videoUri);

      if (!videoUri) {
        throw new Error('Video URI not found');
      }

      const videoResponse = await fetch(videoUri);
      const videoBlob = await videoResponse.blob();

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': videoBlob.type,
        },
        body: videoBlob,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const { storageId } = await response.json();
      console.log('storageId', storageId);

      if (!storageId) {
        throw new Error('No Storage ID returned after upload');
      }

      const projectId = await createProject({
        name: video.filename || 'untitled',
        videoSize: videoBlob.size,
        videoFileId: storageId,
      });
      console.log('projectId', projectId);
      router.push(`/project/${projectId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      console.log('error', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (!granted && status === PermissionStatus.DENIED) {
    return (
      <View className="flex-1 justify-center bg-dark px-4 pt-4">
        <Text className="text-white text-center font-Poppins_500Medium text-lg">
          Please grant media permissions
        </Text>
        {/* Permission Button */}
        <TouchableOpacity
          onPress={() => Linking.openSettings()}
          className="mt-3 bg-primary rounded-2xl p-4"
        >
          <Text className="text-white text-center font-Poppins_500Medium text-lg">
            Grant Permissions
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status === PermissionStatus.UNDETERMINED) {
    return (
      <View className="flex-1 items-center justify-center bg-dark px-4 pt-4">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dark">
      {/* File List */}
      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap p-1">
          {media.map((video) => (
            <Pressable
              key={video.id}
              onPress={() => onSelectVideo(video)}
              className="w-1/3 aspect-square relative p-0.5"
            >
              <Image source={{ uri: video.uri }} className="flex-1 rounded-xl" resizeMode="cover" />
              {/* Video Duration with Blur Background */}
              <View className="absolute bottom-2 right-2 bg-dark/60 p-1 rounded-md">
                <Text className="text-white font-Poppins_500Medium text-sm">
                  {formatDuration(video.duration)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {isUploading && (
        <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <View className="bg-dark p-8 rounded-2xl gap-3">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white text-center font-Poppins_500Medium text-lg mt-2">
              Uploading...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
