import { useAuth, useUser } from '@clerk/clerk-expo';
import { Button, Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const passkeys = user?.passkeys ?? [];

  const createClerkPasskey = async () => {
    if (!user) return;
    try {
      const passkey = await user.createPasskey();
      console.log('Passkey created:', passkey);
    } catch (error) {
      console.error('Error creating passkey:', error);
    }
  };

  return (
    <View className="flex-1 bg-dark items-center justify-center">
      <Button title="Create Passkey" onPress={createClerkPasskey} />
      <Button title="Sign Out" onPress={() => signOut()} />
      <View className="gap-4 mt-8">
        <Text className="text-white text-2xl font-Poppins_600SemiBold">Passkeys</Text>
        <View className="flex-row gap-4">
          {passkeys?.length === 0 && (
            <Text className="text-white text-base font-Poppins_500Medium text-center">
              No passkeys
            </Text>
          )}
          {passkeys?.map((passkey) => (
            <View key={passkey.id} className="bg-gray-800 p-4 rounded-lg">
              <Text className="text-white">
                ID: <Text className="text-gray-400 font-Poppins_500Medium">{passkey.id}</Text>
              </Text>
              <Text className="text-white">
                Name: <Text className="text-gray-400 font-Poppins_500Medium">{passkey.name}</Text>
              </Text>
              <Text className="text-white">
                Created:{' '}
                <Text className="text-gray-400 font-Poppins_500Medium">
                  {passkey.createdAt.toDateString()}
                </Text>
              </Text>
              <Text className="text-white">
                Last Used:{' '}
                <Text className="text-gray-400 font-Poppins_500Medium">
                  {passkey.lastUsedAt?.toDateString()}
                </Text>
              </Text>
              <TouchableOpacity onPress={() => passkey.delete()} className="mt-2">
                <Text className="text-red-500 font-Poppins_500Medium">Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
