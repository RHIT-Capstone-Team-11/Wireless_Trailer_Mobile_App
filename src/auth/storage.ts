import { useCallback, useEffect, useReducer } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type StorageState = [isLoading: boolean, value: string | null];

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
    return;
  }
  if (value === null) await SecureStore.deleteItemAsync(key);
  else await SecureStore.setItemAsync(key, value);
}

async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

/** Persists a string securely on native (Keychain/Keystore) and in localStorage on web. */
export function useStorageState(key: string): [StorageState, (value: string | null) => void] {
  const [state, setState] = useReducer(
    (_: StorageState, value: string | null): StorageState => [false, value],
    [true, null],
  );

  useEffect(() => {
    getStorageItemAsync(key).then(setState, () => setState(null));
  }, [key]);

  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key],
  );

  return [state, setValue];
}
