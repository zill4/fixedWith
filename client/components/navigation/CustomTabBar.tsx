import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter, usePathname } from 'expo-router';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabInfo {
  name: string;
  icon: IconName;
  activeIcon: IconName;
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabInfo[] = [
    { name: 'home', icon: 'home-outline', activeIcon: 'home' },
    // { name: 'build-repair', icon: 'construct-outline', activeIcon: 'construct' },
    { name: 'new', icon: 'add-circle-outline', activeIcon: 'add-circle' },
    { name: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
    // { name: 'quote', icon: 'document-outline', activeIcon: 'document' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
       const isFocused = pathname.includes(`${tab.name}`);

       const onPress = () => {
         if (!isFocused) {
           router.push(`/(main)/${tab.name}` as any);
         }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={isFocused ? tab.activeIcon : tab.icon}
              size={tab.name === 'new' ? 42 : 20}
              color={isFocused ? '#DE2020' : '#8E8E93'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});