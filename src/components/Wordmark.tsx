import { Text, type TextStyle } from 'react-native';

import { colors } from '@/theme';

type Props = {
  size?: number;
  color?: string;
  style?: TextStyle;
};

export function Wordmark({ size = 30, color = colors.text, style }: Props) {
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="Wireless"
      style={[{ fontSize: size, fontWeight: '800', color, letterSpacing: -0.5 }, style]}>
      Wire<Text style={{ color: colors.amber }}>[Less]</Text>
    </Text>
  );
}
