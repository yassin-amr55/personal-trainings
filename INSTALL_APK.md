# Install Sports Tracker APK on Android Device

## Your APK Location
The debug APK has been built successfully at:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

## Option 1: Install via ADB (Recommended)

### Steps:
1. **Enable Developer Options on your Android device:**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"

2. **Connect your device via USB**
   - Connect your Android device to your computer
   - Accept the USB debugging prompt on your device

3. **Run the install command:**
   ```powershell
   & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r "android\app\build\outputs\apk\debug\app-debug.apk"
   ```

## Option 2: Manual Install

1. Copy the APK file to your device:
   - Connect your device via USB
   - Copy `android\app\build\outputs\apk\debug\app-debug.apk` to your device's Downloads folder

2. On your device:
   - Open the Files app or Downloads folder
   - Tap on `app-debug.apk`
   - Allow installation from unknown sources if prompted
   - Tap "Install"

## Option 3: Wireless Install (if device is on same network)

1. Enable wireless debugging on your device (Android 11+)
2. Use the pairing code to connect
3. Then run the install command

## Rebuilding After Changes

If you make changes to the code:

```powershell
# 1. Build the web app
npm run build

# 2. Sync with Capacitor
npx cap sync android

# 3. Build new APK
cd android
.\gradlew assembleDebug
cd ..

# 4. Install on device
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r "android\app\build\outputs\apk\debug\app-debug.apk"
```

## Quick Rebuild Script

You can also use this one-liner:
```powershell
npm run build ; npx cap sync android ; cd android ; .\gradlew assembleDebug ; cd .. ; & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" install -r "android\app\build\outputs\apk\debug\app-debug.apk"
```
