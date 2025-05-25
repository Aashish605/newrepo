import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyAli5XC4curcz_vWbTDMu_vmBmHAdAZZ80",
    authDomain: "push-d8598.firebaseapp.com",
    projectId: "push-d8598",
    storageBucket: "push-d8598.firebasestorage.app",
    messagingSenderId: "156529090720",
    appId: "1:156529090720:web:2010d9c9f9ebcd85e9e9c5",
    measurementId: "G-ZC1TXHEMBH"
}
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: 'BK4nlGgQvf4JFZVPCFkQ-GfEYy_ewcRZXd4nQlnQwrM7UFD8zzKSp4jNijacK_2_A8PnUKPg9DOVEMlm1bKl5Bg' });
        if (token) {
            console.log('FCM Token:', token);
            return token;
        } else {
            console.error('No registration token available.');
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
    }
};

// Listen for messages
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });