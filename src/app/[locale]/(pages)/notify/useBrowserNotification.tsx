"use client";

import { useEffect, useState, useCallback } from "react";

export const useBrowserNotification = () => {
  // Initialize with null or a fallback to keep the initial server render safe
  const [permission, setPermission] = useState<NotificationPermission | null>(
    null,
  );
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // 1. Safe Environment Initialization inside useEffect
  useEffect(() => {
    // Wrap initialization in a small timeout to let the initial render finish.
    // This prevents the React strict warning: "Calling setState synchronously within an effect can trigger cascading renders"
    const timer = setTimeout(() => {
      const supported =
        typeof window !== "undefined" && "Notification" in window;
      setIsSupported(supported);

      if (!supported) {
        console.warn(
          "[Notify] This browser does not support Web Notifications API.",
        );
        return;
      }

      // Directly read the status safely on the client mount
      setPermission(Notification.permission);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Request Permission Shorthand Function
  const requestPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!isSupported) return "denied";

      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
      } catch (error) {
        console.error(
          "[Notify] Permission request intercepted or failed:",
          error,
        );
        return "denied";
      }
    }, [isSupported]);

  // 3. Isolated Native Trigger Utility
  const triggerNativeNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      const notif = new Notification(title, {
        icon: "/next.svg", // Default absolute or relative path to public asset
        ...options,
      });

      notif.onclick = (e) => {
        e.preventDefault();
        window.focus();
      };
    },
    [],
  );

  // 4. Exposed Execution Wrapper Function
  const sendNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (!isSupported) {
        console.warn(
          "[Notify] Target engine does not support client push hooks.",
        );
        return;
      }

      // Read live permission status to catch external browser setting modifications
      const currentPermission = Notification.permission;

      if (currentPermission === "granted") {
        triggerNativeNotification(title, options);
      } else if (currentPermission === "default") {
        const result = await requestPermission();
        if (result === "granted") {
          triggerNativeNotification(title, options);
        }
      } else {
        // Fallback or explicit warning for blocked/denied instances
        alert(
          "Notification permission is blocked! Please update settings in your browser address bar.",
        );
      }
    },
    [isSupported, requestPermission, triggerNativeNotification],
  );

  return {
    sendNotification,
    requestPermission,
    permission,
    isSupported,
  };
};
