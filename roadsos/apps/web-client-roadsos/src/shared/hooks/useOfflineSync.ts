"use client";

import { useState, useEffect, useCallback } from "react";
import { saveToQueue, getQueue, removeFromQueue } from "../utils/offline-db";

interface SyncTask<T = any> {
  id: string;
  payload: T;
  endpoint: string;
  timestamp: number;
}

export function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(false);
  const [syncQueue, setSyncQueue] = useState<SyncTask[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize online/offline status
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register Background Sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-emergency-requests').catch(console.error);
      });
    }

    // Load queue from IndexedDB
    getQueue().then((queue) => {
      setSyncQueue(queue as SyncTask[]);
    }).catch(err => {
      console.error("Failed to load sync queue from IndexedDB", err);
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync effect when coming back online
  useEffect(() => {
    if (!isOffline && syncQueue.length > 0 && !isSyncing) {
      processQueue();
    }
  }, [isOffline, syncQueue.length, isSyncing]);

  const processQueue = async () => {
    setIsSyncing(true);
    const currentQueue = await getQueue() as SyncTask[];

    for (const task of currentQueue) {
      try {
        console.log(`Syncing offline task ${task.id} to ${task.endpoint}`);
        
        if (task.endpoint === "/api/emergencies") {
          const { emergencyService } = await import("@/shared/api/emergencyService");
          const result = await emergencyService.submitRequest(task.payload);
          if (!result.success) {
            throw new Error(result.error);
          }
        } else {
          // Fallback or other generic API requests
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        
        // On success, remove from IndexedDB and local state
        await removeFromQueue(task.id);
        setSyncQueue(prev => prev.filter(t => t.id !== task.id));
      } catch (err) {
        console.error(`Failed to sync task ${task.id}`, err);
        // Break the loop on first failure to retry later
        break;
      }
    }
    
    setIsSyncing(false);
  };

  const queueRequest = useCallback(async (endpoint: string, payload: any) => {
    const newTask: SyncTask = {
      id: Math.random().toString(36).substring(2, 9),
      payload,
      endpoint,
      timestamp: Date.now(),
    };

    await saveToQueue(newTask);
    setSyncQueue((prev) => [...prev, newTask]);

    if (!isOffline && !isSyncing) {
      processQueue();
    }
  }, [isOffline, isSyncing]);

  return {
    isOffline,
    syncQueue,
    isSyncing,
    queueRequest,
  };
}
