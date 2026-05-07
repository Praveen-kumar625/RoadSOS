"use client";

import { useEffect, useState } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // 2. Check current notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const triggerLocalNotification = (title, options = {}) => {
    if (permission === 'granted') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            icon: '/favicon.ico',
            vibrate: [200, 100, 200, 100, 200],
            requireInteraction: true,
            ...options
          });
        });
      } else {
        new Notification(title, {
          icon: '/favicon.ico',
          vibrate: [200, 100, 200, 100, 200],
          requireInteraction: true,
          ...options
        });
      }
    }
  };

  return {
    permission,
    requestPermission,
    triggerLocalNotification
  };
}
