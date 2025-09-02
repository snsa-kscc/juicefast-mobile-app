import { usePathname, useRouter } from 'expo-router';
import { Heart, Home, MessageCircle, Store, Users } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabItem {
  name: string;
  route: string;
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
}

const tabs: TabItem[] = [
  { name: 'index', route: '/', title: 'Home', icon: Home },
  { name: 'tracker', route: '/tracker', title: 'Tracker', icon: Heart },
  { name: 'store', route: '/store', title: 'Store', icon: Store },
  { name: 'chat', route: '/chat', title: 'Chat', icon: MessageCircle },
  { name: 'club', route: '/club', title: 'JF Club', icon: Users },
];

export function CustomBottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  };

  return (
    <View 
      style={{
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        height: 80 + insets.bottom,
        paddingBottom: insets.bottom + 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        const IconComponent = tab.icon;
        
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => handleTabPress(tab.route)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <IconComponent 
              size={24} 
              color={active ? '#000000' : '#9ca3af'} 
            />
            <Text 
              style={{
                fontSize: 12,
                fontFamily: 'Lufga-Medium',
                color: active ? '#000000' : '#9ca3af',
                marginTop: 4,
              }}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
