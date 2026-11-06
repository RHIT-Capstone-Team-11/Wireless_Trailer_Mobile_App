import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { colors, radius } from '@/theme';
import type { IconName } from './ui';

const ICONS: Record<string, IconName> = {
  index: 'home',
  menu: 'menu',
};

export function TabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;

          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigateToTab(route.key);
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              style={[styles.tab, focused && styles.tabActive]}>
              <Feather
                name={ICONS[route.name] ?? 'circle'}
                size={20}
                color={focused ? colors.text : colors.textMuted}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: colors.background,
  },
  bar: {
    flexDirection: 'row',
    gap: 8,
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: radius.md,
  },
  tabActive: { backgroundColor: colors.amberSoft },
  label: { fontSize: 14, fontWeight: '500', color: colors.textMuted },
  labelActive: { fontWeight: '700', color: colors.text },
});
