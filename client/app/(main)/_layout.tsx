import { Tabs } from 'expo-router';
import { CustomTabBar } from "../../components/navigation/CustomTabBar"


export default function MainLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="build-repair" options={{ headerShown: false }} />
      <Tabs.Screen name="new" options={{ headerShown: false }} />
      <Tabs.Screen name="chat" options={{ headerShown: false }} />
      <Tabs.Screen name="quote" options={{ headerShown: false }} />
      <Tabs.Screen name="settings" options={{ headerShown: false }} />
    </Tabs>
  );
}