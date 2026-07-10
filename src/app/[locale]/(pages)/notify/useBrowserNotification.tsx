export const useBrowserNotification = () => {
  const sendNotification = async (title: string, options?: NotificationOptions) => {
    console.log('[Notify] sendNotification called, title:', title);

    // 1. Check browser supports notifications
    if (!('Notification' in window)) {
      console.error('[Notify] Notification API not found in window');
      alert('Ei browser-e notification support kore na!');
      return;
    }

    console.log('[Notify] Current permission:', Notification.permission);

    // 2. If permission is default, ask for it
    if (Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        console.log('[Notify] Permission result:', permission);
        if (permission === 'granted') {
          trigger(title, options);
        } else {
          console.warn('[Notify] User did not grant permission:', permission);
        }
      } catch (err) {
        console.error('[Notify] requestPermission threw an error:', err);
      }
    }
    // 3. If already granted, trigger immediately
    else if (Notification.permission === 'granted') {
      trigger(title, options);
    }
    // 4. If blocked
    else {
      console.warn('[Notify] Permission is denied');
      alert('Notification permission block kora! Browser URL bar theke eta allow koren.');
    }
  };

  const trigger = (title: string, options?: NotificationOptions) => {
    try {
      const notif = new Notification(title, {
        icon: '/next.svg',
        ...options,
      });
      console.log('[Notify] Notification object created:', notif);

      notif.onclick = () => window.focus();
      notif.onerror = (e) => console.error('[Notify] Notification error event:', e);
      notif.onshow = () => console.log('[Notify] Notification shown successfully');
    } catch (err) {
      console.error('[Notify] new Notification() threw:', err);
    }
  };

  return { sendNotification };
};