// Firebase Configuration
// TODO: Replace with your Firebase project credentials from Firebase Console

const firebaseConfig = {
  apiKey: "AIzaSyCImqa9Wn02L6NOGhsgSrkumjPwWwHZNLM",
  authDomain: "github-like-site.firebaseapp.com",
  projectId: "github-like-site",
  storageBucket: "github-like-site.firebasestorage.app",
  messagingSenderId: "710360958538",
  appId: "1:710360958538:web:114185be3aaaf2f5c648b3",
  measurementId: "G-LD8PXBV0XB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to shared files collection
const PUBLIC_FILES_COLLECTION = 'public_files';
const SECRET_FILES_COLLECTION = 'secret_files';
