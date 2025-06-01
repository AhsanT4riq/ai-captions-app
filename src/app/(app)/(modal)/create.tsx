import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

import ActionButton from '@/components/create/ActionButton';
import { colors } from '@/utils/twconfig';

export default function Create() {
  const onImportVideo = () => {
    console.log('Import video');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(app)/(modal)/filelist');
  };

  const onRecordVideo = () => {
    console.log('Record video');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onCancel = () => {
    console.log('Cancel');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View className="flex-1 bg-dark px-4 pt-4">
      <View className="flex-row gap-3 mb-3">
        <ActionButton
          icon={<Ionicons name="download-outline" size={24} color={colors.primary} />}
          title="Import Video"
          subtitle="Import a video from your device"
          onPress={onImportVideo}
        />
        <ActionButton
          icon={<Ionicons name="videocam-outline" size={24} color={colors.primary} />}
          title="Record Video"
          subtitle="Record a video from your device"
          onPress={onRecordVideo}
        />
      </View>
      <TouchableOpacity className="mt-3 mb-8 bg-zinc-800 rounded-2xl p-4" onPress={onCancel}>
        <Text className="text-center text-lg text-white font-Poppins_500Medium">Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
