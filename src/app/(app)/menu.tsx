import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import Feather from '@expo/vector-icons/Feather';

import { initials, useSession } from '@/auth/session';
import { Card, IconTile, type IconName } from '@/components/ui';
import { colors, radius, type } from '@/theme';

type MenuItem = { label: string; detail?: string; icon: IconName };

const ITEMS: MenuItem[] = [
  { label: 'Personal information', detail: 'Name, email, phone', icon: 'user' },
  { label: 'App settings', detail: 'Preferences and permissions', icon: 'settings' },
  { label: 'Privacy & security', icon: 'shield' },
  { label: 'Help & support', icon: 'help-circle' },
];

export default function Menu() {
  const { user, signOut } = useSession();
  const [notifications, setNotifications] = useState(true);

  const confirmSignOut = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Log out of Wire[Less]?')) signOut();
      return;
    }
    Alert.alert('Log out', 'Log out of Wire[Less]?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ]);
  };

  const [first, ...rest] = ITEMS;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={type.eyebrow}>Account & settings</Text>
        <Text style={[type.title, { marginTop: 4, marginBottom: 20 }]}>Menu</Text>

        <Pressable style={styles.profile}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>{initials(user?.name ?? '')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
          <View style={styles.profileChevron}>
            <Feather name="chevron-right" size={18} color={colors.textOnInk} />
          </View>
        </Pressable>

        <Card style={{ marginTop: 20, overflow: 'hidden' }}>
          <Row item={first} />
          <View style={styles.row}>
            <IconTile name="bell" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>Notifications</Text>
              <Text style={type.caption}>Alerts and updates</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: colors.ink, false: colors.border }}
              thumbColor={colors.surface}
            />
          </View>
          {rest.map((item) => (
            <Row key={item.label} item={item} />
          ))}
        </Card>

        <Pressable
          onPress={confirmSignOut}
          style={({ pressed }) => [styles.logout, pressed && { opacity: 0.8 }]}>
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>

        <Text style={styles.version}>Wire[Less] app · Version {Constants.expoConfig?.version ?? '1.0.0'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ item }: { item: MenuItem }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}>
      <IconTile name={item.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{item.label}</Text>
        {item.detail && <Text style={type.caption}>{item.detail}</Text>}
      </View>
      <Feather name="chevron-right" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    padding: 16,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: { fontWeight: '800', fontSize: 16, color: colors.ink },
  profileName: { color: colors.textOnInk, fontWeight: '700', fontSize: 18 },
  profileEmail: { color: colors.textOnInkMuted, fontSize: 13, marginTop: 2 },
  profileChevron: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A4853',
    backgroundColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  logout: {
    marginTop: 20,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: { color: colors.danger, fontWeight: '700', fontSize: 15 },
  version: { textAlign: 'center', marginTop: 20, fontSize: 12, color: colors.textMuted },
});
