"use client";

import { useState, useEffect, useCallback } from "react";

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

    // Load queue from localStorage
    const storedQueue = localStorage.getItem("roadsos_sync_queue");
    if (storedQueue) {
      try {
        setSyncQueue(JSON.parse(storedQueue));
      } catch (err) {
        console.error("Failed to parse sync queue", err);
      }
    }

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
    let remainingQueue = [...syncQueue];

    for (const task of syncQueue) {
      try {
        console.log(`Syncing offline task ${task.id} to ${task.endpoint}`);
        
        // Dynamically process based on endpoint or task type
        // In this app, we primarily have emergency requests
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
        
        // On success, remove from queue
        remainingQueue = remainingQueue.filter((t) => t.id !== task.id);
      } catch (err) {
        console.error(`Failed to sync task ${task.id}`, err);
        // Break the loop on first failure to retry later
        break;
      }
    }

    setSyncQueue(remainingQueue);
    localStorage.setItem("roadsos_sync_queue", JSON.stringify(remainingQueue));
    setIsSyncing(false);
  };

  const queueRequest = useCallback((endpoint: string, payload: any) => {
    const newTask: SyncTask = {
      id: Math.random().toString(36).substring(2, 9),
      payload,
      endpoint,
      timestamp: Date.now(),
    };

    setSyncQueue((prev) => {
      const newQueue = [...prev, newTask];
      localStorage.setItem("roadsos_sync_queue", JSON.stringify(newQueue));
      return newQueue;
    });

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
