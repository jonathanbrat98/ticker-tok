import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBLBjNBRvVPLhiq7gM8FWIVHr3GMdxH8us",
    authDomain: "ticker-tok.firebaseapp.com",
    projectId: "ticker-tok",
    storageBucket: "ticker-tok.firebasestorage.app",
    messagingSenderId: "962184012010",
    appId: "1:962184012010:web:ab396b8fef730b9021b793",
    measurementId: "G-EZDCMKPCB3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 