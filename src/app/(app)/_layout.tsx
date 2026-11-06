import { Tabs } from 'expo-router/js-tabs';

import { BluetoothProvider } from '@/bluetooth/connection';
import { TabBar } from '@/components/TabBar';
import { colors } from '@/theme';

export default function AppLayout() {
  return (
    <BluetoothProvider>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="menu" options={{ title: 'Menu' }} />
      </Tabs>
    </BluetoothProvider>
  );
}
