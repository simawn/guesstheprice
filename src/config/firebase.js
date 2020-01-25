import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDQfxKAJnMGB4kbL9dsKZdn5Yjj9gzSOxM",
  authDomain: "guesstheprice-a2f87.firebaseapp.com",
  databaseURL: "https://guesstheprice-a2f87.firebaseio.com",
  projectId: "guesstheprice-a2f87",
  storageBucket: "guesstheprice-a2f87.appspot.com",
  messagingSenderId: "964960604925",
  appId: "1:964960604925:web:e36222d11ccb7366512494",
  measurementId: "G-ZSSH9TQKHL"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
