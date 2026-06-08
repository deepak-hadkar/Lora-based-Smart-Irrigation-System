// ===============================
// Firebase Initialization (Global)
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyAbdlXLeHw5cUyB9OnlhNuXZPQRbg8NID8",
  authDomain: "efarm-dashboard.firebaseapp.com",
  databaseURL: "https://efarm-dashboard-default-rtdb.firebaseio.com",
  projectId: "efarm-dashboard",
  storageBucket: "efarm-dashboard.appspot.com",
  messagingSenderId: "395430854188",
  appId: "1:395430854188:web:63f1da7c4cc93357addb89"
};

// Prevent re-initialization
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Make auth & db globally accessible
window.auth = firebase.auth();
window.db   = firebase.database();
