import { getAuth } from "firebase/auth";

// Import Firebase
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj7BF2l566gP19S9ZwTdEE7YGbqUKXA_c",
  authDomain: "ai-chat-bot-5d203.firebaseapp.com",
  projectId: "ai-chat-bot-5d203",
  storageBucket: "ai-chat-bot-5d203.appspot.com",
  messagingSenderId: "450307544501",
  appId: "1:450307544501:web:18a5ffb2d4178d8177f5fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use Firebase services
const auth = getAuth(app);

export { auth };
