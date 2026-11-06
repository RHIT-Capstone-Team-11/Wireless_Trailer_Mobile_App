import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

import { initials, useSession } from '@/auth/session';
import { DEVICE_NAME } from '@/bluetooth/config';
import { useBluetooth } from '@/bluetooth/connection';
import { Wordmark } from '@/components/Wordmark';
import { Card, IconTile, Pill, SectionHeader, type IconName } from '@/components/ui';
import { colors, radius, type } from '@/theme';

type HealthItem = { label: string; icon: IconName; ok: boolean };

// Placeholder data until the hardware reports its equipment over Bluetooth.
const EQUIPMENT = [{ id: '1', name: 'Truck/Trailer 1', detail: 'Truck 1 + Trailer 1 · Bluetooth' }];

export default function Home() {
  const { user } = useSession();
  const { status, error, connect, disconnect } = useBluetooth();
  const connected = status === 'connected';
  const connecting = status === 'connecting';

  const health: HealthItem[] = [
    { label: 'Running lights', icon: 'shield', ok: true },
    { label: 'Trailer/Truck connection', icon: 'wifi', ok: false },
  ];
  const needsAttention = health.filter((h) => !h.ok).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Wordmark />
          <Pressable onPress={() => router.navigate('/menu')} accessibilityLabel="Open account menu">
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(user?.name ?? '')}</Text>
              <View style={styles.onlineDot} />
            </View>
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View style={styles.statusChip}>
              <View style={[styles.chipDot, { backgroundColor: connected ? colors.amber : colors.textMuted }]} />
              <Text style={styles.chipText}>
                {connected ? 'Connected' : connecting ? 'Connecting' : 'Disconnected'}
              </Text>
            </View>
            <Feather name="bluetooth" size={22} color={colors.textOnInk} />
          </View>
          <Text style={styles.statusDetail}>
            {connected
              ? `Connected to ${DEVICE_NAME}`
              : connecting
                ? 'Looking for your trailer…'
                : (error ?? 'No device connected')}
          </Text>
          <Pressable
            onPress={connected ? disconnect : connect}
            disabled={connecting}
            accessibilityState={{ busy: connecting, disabled: connecting }}
            style={({ pressed }) => [styles.connectButton, (pressed || connecting) && { opacity: 0.85 }]}>
            {connecting ? (
              <ActivityIndicator size="small" color={colors.ink} />
            ) : (
              <Feather name="wifi" size={16} color={colors.ink} />
            )}
            <Text style={styles.connectText}>
              {connected ? 'Disconnect' : connecting ? 'Connecting…' : 'Connect'}
            </Text>
          </Pressable>
        </View>

        <SectionHeader
          eyebrow="Connections"
          title="Your equipment"
          right={
            <Pressable hitSlop={8}>
              <Text style={styles.addText}>+ Add</Text>
            </Pressable>
          }
        />
        {EQUIPMENT.map((item) => (
          <Card key={item.id} style={styles.row}>
            <IconTile name="truck" size={46} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={type.caption}>{item.detail}</Text>
            </View>
            <Pill label={connected ? 'Connected' : 'Offline'} />
          </Card>
        ))}

        <SectionHeader
          eyebrow="Health"
          title="System status"
          right={needsAttention > 0 ? <Pill label={`${needsAttention} needs attention`} /> : undefined}
        />
        <View style={{ gap: 12 }}>
          {health.map((item) => (
            <Card key={item.label} style={styles.row}>
              <IconTile name={item.icon} size={34} />
              <View style={{ flex: 1 }}>
                <Text style={type.caption}>{item.label}</Text>
                <Text style={[styles.rowStatus, !item.ok && { color: colors.amberText }]}>
                  {item.ok ? 'Healthy' : 'Needs attention'}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textOnInk, fontWeight: '700', fontSize: 15 },
  onlineDot: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.background,
  },
  statusCard: { backgroundColor: colors.ink, borderRadius: radius.lg, padding: 16 },
  statusTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.inkSoft,
    borderColor: '#33414C',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { color: colors.textOnInk, fontWeight: '700', fontSize: 12 },
  statusDetail: { color: colors.textOnInkMuted, marginTop: 18, fontSize: 14 },
  connectButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.amber,
    borderRadius: radius.sm,
    paddingVertical: 13,
  },
  connectText: { fontWeight: '700', fontSize: 15, color: colors.ink },
  addText: { fontWeight: '700', fontSize: 13, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 3 },
  rowStatus: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 2 },
});
