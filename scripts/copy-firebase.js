// Copies the Firebase browser files into www/vendor so the app also loads offline.
const fs = require("fs");
fs.mkdirSync("www/vendor", { recursive: true });
for (const f of ["app", "auth", "firestore"]) {
  fs.copyFileSync(`node_modules/firebase/firebase-${f}-compat.js`, `www/vendor/firebase-${f}-compat.js`);
}
console.log("Firebase files copied to www/vendor");
