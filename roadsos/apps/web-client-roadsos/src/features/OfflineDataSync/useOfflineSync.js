"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { saveToQueue, getQueue, removeFromQueue } from "./indexeddb-service";

export function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(false);
  const [syncQueue, setSyncQueue] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingRef = useRef(false);

  // Initialize online/offline status
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register Background Sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-emergency-requests').catch(() => {});
      });
    }

    // Load queue from IndexedDB
    getQueue().then((queue) => {
      setSyncQueue(queue);
    }).catch(() => {});

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const processQueue = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    setIsSyncing(true);

    const currentQueue = await getQueue();

    for (const task of currentQueue) {
      try {
        if (task.endpoint === "/api/emergencies") {
          const { emergencyService } = await import("@/shared/api/emergencyService");
          const result = await emergencyService.submitRequest(task.payload);
          if (!result.success) {
            throw new Error(result.error);
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        await removeFromQueue(task.id);
        setSyncQueue(prev => prev.filter(t => t.id !== task.id));
      } catch (err) {
        console.error(`Failed to sync task ${task.id}`, err);
        break;
      }
    }

    isSyncingRef.current = false;
    setIsSyncing(false);
  }, []);

  // Sync effect when coming back online
  useEffect(() => {
    if (!isOffline && syncQueue.length > 0 && !isSyncing) {
      processQueue();
    }
  }, [isOffline, syncQueue.length, isSyncing, processQueue]);

  const queueRequest = useCallback(async (endpoint, payload) => {
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      payload,
      endpoint,
      timestamp: Date.now(),
    };

    await saveToQueue(newTask);
    setSyncQueue((prev) => [...prev, newTask]);

    if (!isOffline && !isSyncingRef.current) {
      processQueue();
    }
  }, [isOffline, processQueue]);

  return {
    isOffline,
    syncQueue,
    isSyncing,
    queueRequest,
  };
}
