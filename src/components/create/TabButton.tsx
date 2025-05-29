import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { TouchableOpacity } from 'react-native';

import { colors } from '@/utils/twconfig';

cssInterop(LinearGradient, {
  className: {
    target: 'style',
  },
});

export const TabButton = () => {
  const handleCreate = () => {
    console.log('Create button pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(app)/(modal)/create');
  };

  return (
    <TouchableOpacity
      onPress={handleCreate}
      className="rounded-xl flex-1 items-center justify-center pt-2"
    >
      <LinearGradient
        colors={[colors.primary, colors.red[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl items-center justify-center p-4 shadow-lg shadow-amber-900/30"
      >
        <Ionicons name="film-outline" size={24} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
};
