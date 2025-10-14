import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StorageService } from '../../services/storage';

export default function TabLayout() {
  useFocusEffect(
    useCallback(() => {
      checkUserData();
    }, [])
  );

  const checkUserData = async () => {
    const userData = await StorageService.getUserData();
    if (!userData) {
      router.replace('/');
    }
  };

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#137fec' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Principal',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="jogos"
        options={{
          title: 'Jogos',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gamepad" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="estudar"
        options={{
          title: 'Estudar',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
          headerShown: false,
        }}
      />
       <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}