import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdBLJ1maYavr7iIxAMMqOhD7AOZKZ31jo",
  authDomain: "crud-user-fec6a.firebaseapp.com",
  databaseURL: "https://crud-user-fec6a.firebaseio.com",
  projectId: "crud-user-fec6a",
  storageBucket: "crud-user-fec6a.appspot.com",
  messagingSenderId: "986601624547",
  appId: "1:986601624547:web:17ac54e61833779b4086d6",
};

firebase.initializeApp(firebaseConfig);

export { firebase };
