import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function Project() {
  const { id } = useLocalSearchParams();
  return (
    <View className={`flex-1 bg-dark p-4`}>
      <Text className="text-white text-2xl font-Poppins_600SemiBold">Project: {id}</Text>
    </View>
  );
}
