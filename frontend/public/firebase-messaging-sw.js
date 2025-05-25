// filepath: d:\Foodking\frontend\public\firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyAli5XC4curcz_vWbTDMu_vmBmHAdAZZ80",
    authDomain: "push-d8598.firebaseapp.com",
    projectId: "push-d8598",
    storageBucket: "push-d8598.firebasestorage.app",
    messagingSenderId: "156529090720",
    appId: "1:156529090720:web:2010d9c9f9ebcd85e9e9c5",
    measurementId: "G-ZC1TXHEMBH"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png', // Optional: Add an icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});