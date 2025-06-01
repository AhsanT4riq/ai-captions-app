import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { api } from '~/convex/_generated/api';

export default function Projects() {
  const projects = useQuery(api.projects.list);

  if (projects === undefined) {
    return (
      <View className="flex-1 bg-dark items-center justify-center">
        <Text className="text-white text-md font-Poppins_500Medium">Loading projects...</Text>
      </View>
    );
  }

  if (!projects.length) {
    return (
      <View className="flex-1 bg-dark items-center justify-center p-4">
        <View className="items-center">
          <Ionicons name="film-outline" size={48} color="#6c6c6c" />
          <Text className="text-white text-xl font-Poppins_600SemiBold mt-4 text-center">
            No projects yet
          </Text>
          <Text className="text-gray-400 text-base font-Poppins_400Regular mt-2 text-center">
            Hit the button below to add your first project and see some magic
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1  bg-dark pt-4">
      <FlatList
        className="px-4"
        contentContainerClassName="gap-2"
        keyExtractor={(item) => item._id}
        data={projects}
        renderItem={({ item }) => (
          <Link href={`/project/${item._id}`} asChild>
            <TouchableOpacity className="bg-neutral-800 rounded-2xl p-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-lg font-Poppins_600SemiBold">{item.name}</Text>
                <Text className="text-gray-400 text-sm font-Poppins_400Regular mt-1">
                  Last update {formatDistanceToNow(item.lastUpdated)} ago •{' '}
                  {item.videoSize / 1024 / 1024 < 1
                    ? `${(item.videoSize / 1024).toFixed(1)} KB`
                    : `${(item.videoSize / 1024 / 1024).toFixed(1)} MB`}
                </Text>
              </View>
              <View>
                <Ionicons name="chevron-forward-outline" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}
