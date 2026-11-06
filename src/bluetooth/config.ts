// Placeholders until the ESP32-S3 firmware is finished.
// DEVICE_NAME must match the name the firmware advertises, character for character.
export const DEVICE_NAME = 'WireLess-Trailer';

// Add the firmware's service UUID here once it has one. While empty, the scan matches on name alone.
export const SERVICE_UUIDS: string[] = [];

export const SCAN_SECONDS = 10;
export const CONNECT_TIMEOUT_MS = 15_000;
