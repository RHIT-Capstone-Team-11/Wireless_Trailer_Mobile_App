import { PermissionsAndroid, Platform } from 'react-native';
import type { BleState, Peripheral } from 'react-native-ble-manager';

import { CONNECT_TIMEOUT_MS, DEVICE_NAME, SCAN_SECONDS, SERVICE_UUIDS } from './config';

type BleLibrary = typeof import('react-native-ble-manager');
type BleManager = BleLibrary['default'];

// The system Bluetooth prompt on iOS holds the state as unknown until it is answered.
const STATE_TIMEOUT_MS = 30_000;

// Loaded on first use because importing it throws where the native module is missing (Expo Go).
function loadBle(): BleLibrary {
  try {
    return require('react-native-ble-manager');
  } catch {
    throw new Error("Bluetooth needs a development build. It doesn't work in Expo Go.");
  }
}

async function requestAndroidPermissions() {
  if (Platform.OS !== 'android') return;

  const { ACCESS_FINE_LOCATION, BLUETOOTH_CONNECT, BLUETOOTH_SCAN } = PermissionsAndroid.PERMISSIONS;
  const permissions = Platform.Version >= 31 ? [BLUETOOTH_SCAN, BLUETOOTH_CONNECT] : [ACCESS_FINE_LOCATION];
  const results = await PermissionsAndroid.requestMultiple(permissions);

  if (permissions.some((permission) => results[permission] !== PermissionsAndroid.RESULTS.GRANTED)) {
    throw new Error('Allow the Bluetooth permission in Settings, then try again.');
  }
}

/** Resolves once the adapter leaves its transitional states. */
function settledState({ default: manager, BleState: states }: BleLibrary) {
  const transitional: BleState[] = [states.Unknown, states.Resetting, states.TurningOn];

  return new Promise<BleState>((resolve) => {
    const settle = (state: BleState) => {
      if (transitional.includes(state)) return;
      clearTimeout(timer);
      subscription.remove();
      resolve(state);
    };
    const timer = setTimeout(() => {
      subscription.remove();
      resolve(states.Unknown);
    }, STATE_TIMEOUT_MS);
    const subscription = manager.onDidUpdateState(({ state }) => settle(state));
    manager.checkState().then(settle);
  });
}

async function ensureBluetoothOn(ble: BleLibrary) {
  const { default: manager, BleState: states } = ble;

  await manager.start({ showAlert: false });
  let state = await settledState(ble);

  if (state === states.Off && Platform.OS === 'android') {
    // Shows the system prompt. Rejects if the user declines, which the check below reports.
    await manager.enableBluetooth().catch(() => {});
    state = await settledState(ble);
  }

  if (state === states.On) return;
  if (state === states.Off) throw new Error('Turn on Bluetooth, then try again.');
  if (state === states.Unauthorized) throw new Error('Allow Bluetooth access in Settings, then try again.');
  if (state === states.Unsupported) throw new Error("This phone doesn't support Bluetooth Low Energy.");
  throw new Error("Bluetooth isn't ready yet. Try again in a moment.");
}

function isTrailer(peripheral: Peripheral) {
  return peripheral.name === DEVICE_NAME || peripheral.advertising?.localName === DEVICE_NAME;
}

function scanForTrailer({ default: manager, BleScanMode }: BleLibrary) {
  return new Promise<Peripheral>((resolve, reject) => {
    const finish = (settle: () => void) => {
      clearTimeout(timer);
      subscription.remove();
      manager.stopScan().catch(() => {});
      settle();
    };
    const timer = setTimeout(() => {
      finish(() => reject(new Error(`Couldn't find ${DEVICE_NAME}. Make sure it's powered on and nearby.`)));
    }, SCAN_SECONDS * 1000);
    // Matched here instead of with the scan's name filter, which is unreliable on Android.
    const subscription = manager.onDiscoverPeripheral((peripheral) => {
      if (isTrailer(peripheral)) finish(() => resolve(peripheral));
    });

    manager
      .scan({ serviceUUIDs: SERVICE_UUIDS, seconds: SCAN_SECONDS, scanMode: BleScanMode.LowLatency })
      .catch((e) => finish(() => reject(e)));
  });
}

// iOS connection attempts never time out on their own.
async function connectWithTimeout(manager: BleManager, id: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out connecting to ${DEVICE_NAME}. Try again.`)), CONNECT_TIMEOUT_MS);
  });
  const connection = manager.connect(id).then(() => manager.retrieveServices(id, SERVICE_UUIDS));

  try {
    await Promise.race([connection, timeout]);
  } catch (e) {
    manager.disconnect(id).catch(() => {});
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Finds the trailer and connects to it.
 * Resolves to a function that disconnects. `onLost` fires if the link drops any other way.
 */
export async function connectToTrailer(onLost: () => void): Promise<() => void> {
  const ble = loadBle();
  const { default: manager, BleState: states } = ble;

  await requestAndroidPermissions();
  await ensureBluetoothOn(ble);

  // A device that is already connected stops advertising, so a scan wouldn't find it after a JS reload.
  const connected = await manager.getConnectedPeripherals(SERVICE_UUIDS);
  const { id } = connected.find(isTrailer) ?? (await scanForTrailer(ble));
  await connectWithTimeout(manager, id);

  const stopListening = () => {
    disconnected.remove();
    stateChanged.remove();
  };
  const handleLost = () => {
    stopListening();
    onLost();
  };
  const disconnected = manager.onDisconnectPeripheral(({ peripheral }) => {
    if (peripheral === id) handleLost();
  });
  const stateChanged = manager.onDidUpdateState(({ state }) => {
    if (state !== states.On) handleLost();
  });

  return () => {
    stopListening();
    manager.disconnect(id).catch((e) => console.warn('Bluetooth disconnect failed:', e));
  };
}
