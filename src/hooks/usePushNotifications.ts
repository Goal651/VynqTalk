import { useState, useEffect } from 'react';
import { pushNotificationManager } from '@/lib/pushNotifications';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    setIsLoading(true);
    
    try {
      const supported = await pushNotificationManager.initialize();
      setIsSupported(supported);
      
      if (supported) {
        const currentPermission = await pushNotificationManager.requestPermission();
        setPermission(currentPermission);
        
        const currentSubscription = await pushNotificationManager.getSubscription();
        setSubscription(currentSubscription);
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const newPermission = await pushNotificationManager.requestPermission();
      setPermission(newPermission);
      return newPermission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    try {
      const newSubscription = await pushNotificationManager.subscribe();
      setSubscription(newSubscription);
      return newSubscription !== null;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    try {
      const success = await pushNotificationManager.unsubscribe();
      if (success) {
        setSubscription(null);
      }
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  };

  const showNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
    try {
      await pushNotificationManager.showLocalNotification(title, options);
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    isLoading,
    isSubscribed: subscription !== null,
    isPermissionGranted: permission === 'granted',
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification
  };
};
