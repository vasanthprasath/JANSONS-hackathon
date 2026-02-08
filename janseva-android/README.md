# JanSeva Portal Android APK Wrapper

This folder contains a fully functional Android Studio project that wraps your JanSeva web application into a native Android APK using a **WebView**.

## Features Included
- **Native Splash Screen**: Professional branding while the app loads.
- **Full-Screen WebView**: Loads the web app without browser bars.
- **Local Asset Loading**: The app is bundled inside the APK (offline support for UI).
- **JavaScript & DOM Storage**: Fully enabled for your Next.js features.
- **Native Permissions**: Handles Location (GPS) and Internet permissions.
- **Back Button Support**: Native back button navigates inside the web app.
- **Swipe-to-Refresh**: Native swipe gesture to reload the page.

## Build Instructions (in Android Studio)

1. **Open the Project**:
   - Open **Android Studio**.
   - Select **Open an Existing Project**.
   - Choose the `janseva-android` folder.

2. **Wait for Sync**:
   - Let Gradle sync and download necessary dependencies.

3. **Select your Execution Mode**:
   - In `MainActivity.java`, you can choose to load from the bundled assets (offline) or a live URL:
     ```java
     // Load from bundled assets (Recommended for standalone APK)
     webView.loadUrl("file:///android_asset/index.html");
     
     // OR load from your live server
     // webView.loadUrl("https://your-live-url.com");
     ```

4. **Generate APK**:
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once finished, a notification will appear. Click **Locate** to find your `app-debug.apk`.

5. **Run on Device**:
   - Connect your Android phone via USB.
   - Enable **USB Debugging** in Developer Options.
   - Click the green **Run** button in Android Studio.

## Prerequisites
- Android Studio (Giraffe or newer recommended).
- JDK 17.
- Android Device/Emulator running Android 8.0 (Oreo) or above.

---
**Note**: The web app files have already been exported and synchronized into the `app/src/main/assets` folder from your `grievance-portal/out` directory.
