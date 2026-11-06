// react-native-ble-manager is native-only, so web builds resolve to this file instead of manager.ts.
export async function connectToTrailer(_onLost: () => void): Promise<() => void> {
  throw new Error("Bluetooth isn't available in the browser. Open the mobile app to connect.");
}
