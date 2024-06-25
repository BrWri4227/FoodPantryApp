import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD05wjyXZq6nT2xJ6FtU0QkcoeE4-iUzJc",
  authDomain: "simple-pantry-eec4d.firebaseapp.com",
  projectId: "simple-pantry-eec4d",
  storageBucket: "simple-pantry-eec4d.appspot.com",
  messagingSenderId: "770958249637",
  appId: "1:770958249637:web:c7b0e18a2ac5806070474c"
};

const app = initializeApp(firebaseConfig);
export default app;