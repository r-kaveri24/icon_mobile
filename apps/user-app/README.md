# User App (Expo) – Run Guide

Follow these steps to install dependencies and run the `user-app` locally.

## Prerequisites
- Node.js `>= 18` and npm `>= 9`
- Optional: Expo Go app (Android/iOS) for device previews
- Optional: Android Studio (emulator) or Xcode (iOS simulator, macOS only)

## Install Dependencies (Monorepo root)
```bash
cd c:\ICON\icon_mobile
npm install
```

## Run the User App

### Option A: From the monorepo root
```bash
cd c:\ICON\icon_mobile
npm run dev:user
```

### Option B: From the app folder
```bash
cd c:\ICON\icon_mobile\apps\user-app
npm run dev
```

When the dev server starts, you’ll see:
- A QR code and an `exp://` URL for Expo Go on device
- A prompt with shortcuts like `a` (Android), `w` (web), `r` (reload)

## Web Preview
- Press `w` in the terminal, or run:
```bash
cd c:\ICON\icon_mobile\apps\user-app
npm run web
```
- Then open `http://localhost:8081` if it doesn’t open automatically.

## Android Preview
- Ensure an Android emulator is running (or connect a device with USB debugging)
- In the dev terminal, press `a` to launch on Android
- Or run:
```bash
cd c:\ICON\icon_mobile\apps\user-app
npm run android
```

## iOS Preview (macOS only)
- Requires Xcode and an iOS simulator
- Run:
```bash
npm run ios
```

## Troubleshooting
- Clear Metro/Expo caches:
```bash
cd c:\ICON\icon_mobile\apps\user-app
npm run clean
# or
npx expo r -c
```
- If you see version warnings, you can update the indicated packages within `user-app`.

## Notes
- This repo uses npm workspaces; install at the root to wire all packages.
- Use the root scripts (e.g., `npm run dev:user`) for convenience, or run directly inside `apps\user-app`.