import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { colors, radius, type } from '@/theme';

export type IconName = ComponentProps<typeof Feather>['name'];

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function IconTile({ name, size = 40 }: { name: IconName; size?: number }) {
  return (
    <View style={[styles.iconTile, { width: size, height: size }]}>
      <Feather name={name} size={size * 0.48} color={colors.text} />
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={type.eyebrow}>{eyebrow}</Text>
        <Text style={[type.heading, { marginTop: 4 }]}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

export function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconTile: {
    borderRadius: radius.sm,
    backgroundColor: colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 28,
    marginBottom: 12,
  },
  pill: {
    backgroundColor: colors.amberSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: { fontSize: 11, fontWeight: '700', color: colors.text },
});
