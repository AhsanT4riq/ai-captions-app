import { useQuery } from 'convex/react';
import { Text, View } from 'react-native';

import { api } from '~/convex/_generated/api';

export default function Index() {
  const tasks = useQuery(api.tasks.get);

  return (
    <View className="flex-1 items-center justify-center bg-dark">
      {tasks?.map(({ _id, text }) => (
        <Text key={_id} className="text-white">
          {text}
        </Text>
      ))}
    </View>
  );
}
