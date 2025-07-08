// Utility for push notification subscription and permission

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  return await Notification.requestPermission();
}

export async function subscribeUserToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  const registration = await navigator.serviceWorker.ready;
  // Use VAPID public key if your backend requires it (replace with your key)
  const vapidPublicKey = undefined; // e.g., 'BEl...yourkey...';
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      ...(vapidPublicKey ? { applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) } : {})
    });
    return subscription;
  } catch (err) {
    console.error('Push subscription failed:', err);
    return null;
  }
}

// Helper for VAPID key conversion (if needed)
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 