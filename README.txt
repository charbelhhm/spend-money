SPEND MONEY - Firebase version

A. Firebase setup (once, in console.firebase.google.com)
 1. Create a project.
 2. Build > Authentication > Get started > Sign-in method > enable Email/Password.
    (Password reset emails are sent by Firebase automatically.)
 3. Build > Firestore Database > Create database.
 4. Project settings > Your apps > add a Web app (</>) > copy the config
    into www/firebase-config.js.

B. Install and deploy rules
 npm install                      (also copies Firebase files into www/vendor)
 npm install -g firebase-tools
 firebase login
 firebase use --add               (pick your project)
 firebase deploy --only firestore:rules

C. Online link (public)
 firebase deploy --only hosting   -> gives https://YOUR_PROJECT.web.app

D. Test APK (needs Java 17 + Android SDK / Android Studio)
 npx cap add android
 npx cap sync android
 cd android && ./gradlew assembleDebug
 APK: android/app/build/outputs/apk/debug/app-debug.apk

Notes
 - Guest mode stays on the device. Signed-in accounts sync online.
 - Entries are stored at users/{uid}/sync, readable only by that user.
 - Edit www/ files, then run: npx cap sync android
