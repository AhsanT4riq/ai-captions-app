import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { TabButton } from '@/components/create/TabButton';
import { HapticTab } from '@/components/HapticTab';
import { colors } from '@/utils/twconfig';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.dark,
          borderTopColor: colors.gray[600],
          height: 100,
          elevation: 0,
        },
        headerStyle: {
          backgroundColor: colors.dark,
        },
        headerTitleStyle: {
          color: colors.white,
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 22,
        },
        headerTintColor: colors.white,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins_500Medium',
        },
        tabBarButton: HapticTab,
        tabBarIconStyle: {
          width: 24,
          height: 24,
        },
      }}
    >
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-open-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarButton: (props) => <TabButton {...props} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
