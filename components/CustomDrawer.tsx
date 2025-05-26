import clickSound from '@/assets/sounds/click.mp3';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { useSound } from '@/hooks/useSound';
import { logout } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export function CustomDrawer(props: any) {
  const { username, profileColor } = useSettings();
  const theme = useTheme();
  const { playSound } = useSound();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: theme.background }}
    >
      <View style={[styles.profileContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.avatar, { backgroundColor: profileColor }]}>
          <Text style={[styles.avatarText, { color: '#fff' }]}>
            {(username?.charAt(0) || '?').toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
      </View>

      {props.state.routes.map((route: typeof props.state.routes[0], index: number) => {
        const isFocused = props.state.index === index;
        const descriptor = props.descriptors[route.key];
        const options = descriptor.options;

        return (
          <DrawerItem
            key={route.key}
            label={options.title || route.name}
            icon={({ color, size, focused }) =>
              options.drawerIcon?.({ color, size, focused })
            }
            focused={isFocused}
            onPress={async () => {
              await playSound(clickSound);
              props.navigation.navigate(route.name);
            }}
            labelStyle={{ color: isFocused ? '#000' : theme.text, }}
            style={{   backgroundColor: isFocused ? '#E0D4FC' : theme.background,
  borderRadius: 8,
  marginHorizontal: 8,}}
          />
        );
      })}
      
      <DrawerItem 
        label="Cerrar sesión"
        icon={({color, size, focused}) => {
          return <Ionicons name="exit-outline" color={focused ? theme.primary : theme.text} size={size} />
        }}
        labelStyle={{ color: theme.text }}
        style={{ marginLeft: 10, height:"75%", justifyContent:'flex-end', borderRadius:8 }}
        onPress={ () => {
          Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?",[
            {text:"Cancelar", style: "cancel"},
            {text: "Aceptar", style: "default", onPress:()=>{
              logout();

            }}
          ])
        }} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
  },
  username: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
