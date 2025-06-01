import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ActionButtonProps = TouchableOpacityProps & {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

const ActionButton = ({ icon, title, subtitle, onPress }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      className="flex-1 items-center bg-neutral-800 rounded-2xl p-4 gap-3"
      onPress={onPress}
    >
      <View>{icon}</View>
      <View>
        <Text className="text-primary text-lg font-Poppins_600SemiBold text-center">{title}</Text>
        <Text className="text-white text-sm font-Poppins_400Regular text-center">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
