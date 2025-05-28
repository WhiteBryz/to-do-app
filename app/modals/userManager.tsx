import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'worker';
}

export default function RolesModal() {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Record<string, 'admin' | 'worker'>>({});

  const {
      id,
      name,
      email,
      userRole } = useLocalSearchParams();

  useEffect(() => {
    // Datos simulados para pruebas
    const dummyUsers: User[] = [
      { id: '1', name: 'Juan Pérez', role: 'worker' },
      { id: '2', name: 'Luisa Gómez', role: 'admin' },
      { id: '3', name: 'Carlos Ruiz', role: 'worker' },
      { id: '4', name: 'Ana Torres', role: 'admin' },
    ];

    

    setUsers(dummyUsers);
    const initialRoles: Record<string, 'admin' | 'worker'> = {};
    dummyUsers.forEach((user) => {
      initialRoles[user.id] = user.role;
    });
    setRoles(initialRoles);
  }, []);

  const handleChangeRole = (userId: string, newRole: 'admin' | 'worker') => {
    setRoles((prev) => ({ ...prev, [userId]: newRole }));
    // Aquí podrías agregar un console.log para ver los cambios en consola
    console.log(`Rol del usuario ${userId} cambiado a ${newRole}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 40 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={theme.text} />
        </Pressable>
        <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>
          Asignar roles
        </Text>
      </View>

      {/* Lista de usuarios */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {users.map((user) => (
          <View key={user.id} style={{ marginBottom: 20 }}>
            <Text style={{ color: theme.text, fontSize: 16, marginBottom: 6 }}>{user.name}</Text>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  backgroundColor: roles[user.id] === 'admin' ? theme.primary : theme.card,
                  borderRadius: 8,
                }}
                onPress={() => handleChangeRole(user.id, 'admin')}
              >
                <Text style={{ color: roles[user.id] === 'admin' ? '#fff' : theme.text }}>Administrador</Text>
              </Pressable>

              <Pressable
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  backgroundColor: roles[user.id] === 'worker' ? theme.primary : theme.card,
                  borderRadius: 8,
                }}
                onPress={() => handleChangeRole(user.id, 'worker')}
              >
                <Text style={{ color: roles[user.id] === 'worker' ? '#fff' : theme.text }}>Worker</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
