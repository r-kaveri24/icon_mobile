# Monorepo Build & Run Guide (user-app)

This document explains how to run the app in development and release modes, the issues encountered, what was fixed, and the exact steps to reproduce, build, install, and verify. It is written for both humans and automation/AI agents to follow.

## Quick Start

- Development (with Metro)
  - `cd apps/user-app`
  - `npx expo start --port 8081 --clear`
  - In another terminal: `cd apps/user-app/android` then `./gradlew.bat installDebug`
  - Launch: `adb shell monkey -p com.company.userapp -c android.intent.category.LAUNCHER 1`

- Release (no Metro)
  - `cd apps/user-app/android`
  - `./gradlew.bat installRelease`
  - Launch: `adb shell monkey -p com.company.userapp -c android.intent.category.LAUNCHER 1`
  - Verify running: `adb shell pidof com.company.userapp`

## Project Context

- Monorepo root: `icon-mobile/`
- App path: `apps/user-app/`
- Android module: `apps/user-app/android/app/`
- Package name: `com.company.userapp`
- JS engine: `hermes` (release and debug)
- Deep link scheme: `com.company.userapp` (see `apps/user-app/app.json`)

## Issues Encountered & Fixes Applied

1) Expo embed bundling failed with:
   - Error: `Unable to resolve module ./index.ts from D:\...\icon-mobile/.`
   - Root Cause: Gradle invokes Expo CLI `export:embed` from the monorepo root; the bundler looked for `index.ts` at the root.
   - Fixes:
     - Added root `index.ts` mapping to the app component: `import App from './apps/user-app/App'; registerRootComponent(App);`
     - Added root `metro.config.js` to resolve workspace packages and support monorepo bundling.

2) Windows native codegen path-length failure during release build:
   - Error: `ninja ... Filename longer than 260 characters` (safeareacontext codegen path)
   - Root Cause: React Native New Architecture (Fabric/TurboModules) generates deep native paths that can exceed Windows `MAX_PATH`.
   - Fixes:
     - Disabled New Architecture: set `newArchEnabled=false` in `apps/user-app/android/gradle.properties` and ran `./gradlew.bat clean`.
     - Alternative if you want New Architecture: move repo to a shorter path (e.g., `C:\icon-mobile`), enable Windows long paths, then set `newArchEnabled=true`.

3) Release signing
   - Current Setup: release signs with the debug keystore (`signingConfig = signingConfigs.debug`) so APKs can be installed directly on device.
   - Note: This is fine for internal testing but is not Play Store-ready. For distribution, create a release keystore and configure a `release` signing config.

## Prerequisites

- Windows with PowerShell; Android SDK installed and `adb` available.
- Java JDK installed; `java -version` runs without error.
- Node.js 18+; NPM comes bundled. Yarn optional.
- A physical Android device connected via USB with USB debugging enabled, or an emulator.

Useful checks:
- `adb devices` shows your device as `device`.
- `node -v` and `java -version` run successfully.

## Development Mode (Debug)

Purpose: iterate quickly with live reload; JS bundle served from Metro.

Steps:
- `cd apps/user-app`
- `npx expo start --port 8081 --clear`
- Optional: install the debug variant if not already installed
  - `cd apps/user-app/android`
  - `./gradlew.bat installDebug`
- Launch the app
  - `adb shell monkey -p com.company.userapp -c android.intent.category.LAUNCHER 1`
- Tail logs (optional)
  - `adb logcat *:I ReactNative:V ReactNativeJS:V React:V AndroidRuntime:E ActivityManager:I Expo:V`

Notes:
- Metro must be running for debug builds; otherwise the app will fail to load JS.
- Deep linking and OAuth callbacks use scheme `com.company.userapp`; ensure your Clerk configuration matches if testing sign-in.

## Release Mode (No Metro)

Purpose: produce a self-contained APK that runs without a Metro server.

Steps:
- `cd apps/user-app/android`
- Build and install in one step: `./gradlew.bat installRelease`
  - Or build only: `./gradlew.bat assembleRelease`
  - Then install: `adb install -r -d apps/user-app/android/app/build/outputs/apk/release/app-release.apk`
- Launch the app
  - `adb shell monkey -p com.company.userapp -c android.intent.category.LAUNCHER 1`
- Verify it's running
  - `adb shell pidof com.company.userapp`

Notes:
- JS is embedded via Expo CLI `export:embed` (configured in `app/build.gradle`), so no Metro is needed.
- Current signing uses the debug keystore for installability; for Play Store distribution, supply a proper release keystore.

## Release Signing (Production)

Create a keystore:
- `keytool -genkey -v -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000`

Configure `apps/user-app/android/app/build.gradle`:
- Add a `release` entry in `signingConfigs` that points to your keystore.
- Set `release { signingConfig = signingConfigs.release }` in `buildTypes`.

Update app metadata:
- Increment `android.versionCode` in `apps/user-app/app.json`.
- Keep `android.package` as `com.company.userapp` unless you intend to change applicationId.

## Monorepo-Specific Configuration

- Root `index.ts` ensures the bundler resolves the correct entry when running `export:embed` from the root.
- Root `metro.config.js` configures resolver paths and maps `@icon/*` workspace packages to their source `src/index.ts`.
- Android Gradle `react` block sets `bundleCommand = "export:embed"`, using Expo CLI for bundling to honor the Metro config.

## Troubleshooting Guide

- Error: `Unable to resolve module ./index.ts from .../icon-mobile/.`
  - Ensure root `index.ts` exists and imports `./apps/user-app/App`.
  - Ensure root `metro.config.js` is present and correctly resolves workspace packages.

- Error: `Filename longer than 260 characters` during CMake/Ninja build
  - Set `newArchEnabled=false` in `apps/user-app/android/gradle.properties` and run `./gradlew.bat clean`.
  - Or shorten the repo path (e.g., `C:\icon-mobile`) and enable Windows long paths, then set `newArchEnabled=true`.

- Install conflict or downgrade error
  - `adb uninstall com.company.userapp` and re-run install.

- Device not detected
  - Check cable/driver; run `adb devices`. Re-enable USB debugging.

- Debug build doesn’t load JS
  - Start Metro: `npx expo start --port 8081 --clear` in `apps/user-app`.

## AI Agent Runbook

Follow these exact steps depending on mode:

### Development
- Ensure device: `adb devices` → look for `device`
- Start Metro: `cd apps/user-app && npx expo start --port 8081 --clear`
- Install debug: `cd apps/user-app/android && ./gradlew.bat installDebug`
- Launch: `adb shell monkey -p com.company.userapp -c android.intent.category.LAUNCHER 1`
- Verify: `adb shell pidof com.company.userapp`
- Optional logs: start `adb logcat ...` as above.

### Release
- Ensure device: `adb devices` → look for `device`
- Build+install: `cd apps/user-app/android && ./gradlew.bat installRelease`
- Launch: `adb shell monkey -p com.company.userapp -c android.intent.category.LAUNCHER 1`
- Verify: `adb shell pidof com.company.userapp`

## Caution Checklist

- Do not rely on Metro for release runs; it’s only for debug.
- On Windows paths, prefer shorter directory roots or disable new architecture to avoid path-length issues.
- Keep environment keys (e.g., Clerk) appropriate for testing vs production; current key in `app.json` is for testing.
- When changing signing, store keystores securely and never commit secrets.
- Always increment `versionCode` when producing a new release for distribution.

## File Map (Key Files)

- Root: `index.ts` (entry for root bundling)
- Root: `metro.config.js` (monorepo resolver)
- App: `apps/user-app/App.tsx` (root component)
- App: `apps/user-app/app.json` (Expo config: package, scheme, version)
- Android: `apps/user-app/android/app/build.gradle` (React/Expo bundling config, signing)
- Android: `apps/user-app/android/gradle.properties` (`newArchEnabled`, Hermes/JSC)

## Verification Commands

- Check app install: `adb shell pm list packages | findstr company.userapp`
- Check running PID: `adb shell pidof com.company.userapp`
- Kill app: `adb shell am force-stop com.company.userapp`

---

This guide captures the real issues encountered and the precise fixes applied. Follow the Quick Start or Runbook sections to get the app running confidently in either development or release mode.