importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyA4x5i91P9mcoF5lufn3oqYHhIj_I3K09g75007614',
  authDomain: 'sosmexico-b2eb5.firebaseapp.com',
  projectId: 'sosmexico-b2eb5',
  storageBucket: 'sosmexico-b2eb5.firebasestorage.app',
  messagingSenderId: '651243624052',
  appId: '1:651243624052:web:957bf43478850de5e26321',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[SW] Mensaje en background:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icono.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});