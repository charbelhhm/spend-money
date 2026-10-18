// Firebase Auth + Firestore layer for Spend Money.
// Loaded after the main script: it swaps local accounts for real Firebase accounts
// and syncs each user's entries to Firestore at users/{uid}/sync/e:{email}.
(function () {
  var cfg = window.FIREBASE_CONFIG;
  if (!window.firebase || !cfg || !cfg.apiKey || cfg.apiKey.indexOf("PASTE") === 0) {
    var er = document.getElementById("aerr");
    if (er) er.textContent = "Firebase not set up yet: add your config in firebase-config.js. Guest mode still works.";
    return;
  }
  firebase.initializeApp(cfg);
  var auth = firebase.auth(), fs = firebase.firestore();
  fs.enablePersistence({ synchronizeTabs: true }).catch(function () {});

  // no local password accounts, nothing sent to Firestore
  pushAccts = function () {};
  pullAccts = async function () {};
  initCloud = async function () {};

  var MSG = {
    "auth/email-already-in-use": "This email already has an account. Sign in instead.",
    "auth/invalid-email": "Enter a valid email.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account found. Tap “I don't have an account”.",
    "auth/wrong-password": "Wrong email or password.",
    "auth/invalid-credential": "Wrong email or password.",
    "auth/too-many-requests": "Too many tries. Wait a bit and try again.",
    "auth/network-request-failed": "No internet connection."
  };
  var msg = function (c) { return MSG[c] || "Something went wrong. Try again."; };
  var valid = function (e) { return /^\S+@\S+\.\S+$/.test(e); };

  $("go").onclick = async function () {
    var e = $("em").value.trim().toLowerCase(), pw = $("pw").value, er = $("aerr");
    if (!valid(e)) { er.textContent = "Enter a valid email."; return; }
    if (pw.length < 6) { er.textContent = "Password must be at least 6 characters."; return; }
    er.textContent = "";
    try {
      if (signup) await auth.createUserWithEmailAndPassword(e, pw);
      else await auth.signInWithEmailAndPassword(e, pw);
    } catch (x) { er.textContent = msg(x.code); }
  };

  $("forgot").onclick = function () {
    $("fem").value = $("em").value; $("ferr").textContent = ""; $("ferr").style.color = "";
    $("fdlg").showModal();
  };
  $("fok").onclick = async function () {
    var e = $("fem").value.trim().toLowerCase(), er = $("ferr");
    if (!valid(e)) { er.style.color = ""; er.textContent = "Enter a valid email."; return; }
    try {
      await auth.sendPasswordResetEmail(e);
      er.style.color = "#1f9d55";
      er.textContent = "If this email has an account, a reset link is on its way. Check spam too.";
    } catch (x) { er.style.color = ""; er.textContent = msg(x.code); }
  };

  var oldLeave = leave;
  leave = function () {
    var wasUser = uid && uid !== "guest";
    oldLeave(); cloud = null;
    if (wasUser) auth.signOut();
  };
  $("out").onclick = leave;

  auth.onAuthStateChanged(function (u) {
    if (u && u.email) {
      cloud = { col: fs.collection("users").doc(u.uid).collection("sync") };
      enter(u.email);
    } else if (uid && uid !== "guest") {
      leave();
    }
  });
})();
