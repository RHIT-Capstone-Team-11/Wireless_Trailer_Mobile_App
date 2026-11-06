import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

import { useSession } from '@/auth/session';
import { Wordmark } from '@/components/Wordmark';
import { colors, radius, type } from '@/theme';

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    setError(await signIn(email, password));
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.logo}>
              <Feather name="bluetooth" size={28} color={colors.amber} />
            </View>
            <Text style={[type.eyebrow, { marginTop: 24 }]}>Wireless trailer system</Text>
            <Wordmark size={40} style={{ marginTop: 6 }} />
            <Text style={[type.caption, { marginTop: 10, fontSize: 15 }]}>
              Sign in to connect and monitor your truck and trailer.
            </Text>
          </View>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={onSubmit}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              hitSlop={8}
              style={{ paddingHorizontal: 14 }}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={onSubmit}
            disabled={submitting}
            style={({ pressed }) => [styles.button, (pressed || submitting) && { opacity: 0.85 }]}>
            {submitting ? (
              <ActivityIndicator color={colors.ink} />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  hero: { marginBottom: 36 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  error: { color: colors.danger, marginTop: 14, fontSize: 13 },
  button: {
    marginTop: 28,
    backgroundColor: colors.amber,
    borderRadius: radius.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700', color: colors.ink },
});
