import { initializeApp } from "firebase/app";

import {getAuth, GoogleAuthProvider} from "firebase/auth";

import {
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC4tp1036twsh_2XVM93cvsxedhP_h1UNY",
    authDomain: "pwa-project-51ed2.firebaseapp.com",
    projectId: "pwa-project-51ed2",
    storageBucket: "pwa-project-51ed2.firebasestorage.app",
    messagingSenderId: "247153555307",
    appId: "1:247153555307:web:def389a0dee691f4fd3e2e",
    measurementId: "G-Z2ZRGJTGNK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account"
});

export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});