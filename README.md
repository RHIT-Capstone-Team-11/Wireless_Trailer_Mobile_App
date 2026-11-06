# Wire[Less] — Wireless Trailer Mobile App
Mobile app for the RHIT Capstone Team 11 wireless trailer system. Connects to the trailer hardware to display status and control features.

Built with [Expo](https://expo.dev) (SDK 58) and Expo Router.

## Running the app

```sh
npm install
npx expo start
```

- **Phone:** install **Expo Go** from the App Store / Play Store, then scan the QR code shown in the terminal (iPhone: use the Camera app).
  - **On campus Wi-Fi (rose-hulman.edu) use `npm run tunnel` instead of `npx expo start`.** The campus network blocks devices from talking to each other, so the normal LAN QR code never loads. Tunnel mode routes through Expo's servers and works from any network, including cellular.
  - Expo Go must support SDK 58 — update it from the store if it says the project is incompatible.
- **Browser:** press `w` in the terminal.
- **Emulator:** press `a` (Android Studio emulator) or `i` (iOS simulator, macOS only).

## Signing in

Login is a placeholder until there is a real backend: any valid email with a password of 6+ characters signs you in. The session is stored with `expo-secure-store` (localStorage on web), so you stay signed in across restarts until you log out from the Menu tab.

## Project layout

```
src/
  app/                 # Routes (every file is a screen)
    _layout.tsx        # Root stack; shows sign-in or the app depending on session
    sign-in.tsx
    (app)/             # Signed-in screens
      _layout.tsx      # Bottom tabs (Home, Menu)
      index.tsx        # Home: connection status, equipment, system health
      menu.tsx         # Account, settings, log out
  auth/                # Session context + secure storage
  components/          # Shared UI (cards, tab bar, wordmark)
  theme.ts             # Colors, radii, text styles
```

## Checks

```sh
npx tsc --noEmit   # typecheck
npx expo-doctor    # dependency/config health
```
