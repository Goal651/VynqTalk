import { notificationService } from '@/api';

export class PushNotificationManager {
    private registration: ServiceWorkerRegistration | null = null;

    async initialize(): Promise<boolean> {
        try {
            // Check if service workers are supported
            if (!('serviceWorker' in navigator)) {
                console.warn('Service workers not supported');
                return false;
            }

            // Check if push notifications are supported
            if (!('PushManager' in window)) {
                console.warn('Push notifications not supported');
                return false;
            }

            // Register service worker
            this.registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker registered successfully');

            // Wait for service worker to be ready
            await navigator.serviceWorker.ready;

            return true;
        } catch (error) {
            console.error('Failed to initialize push notifications:', error);
            return false;
        }
    }

    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.warn('Notifications not supported');
            return 'denied';
        }

        let permission = Notification.permission;

        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }

        return permission;
    }

    async subscribe(): Promise<PushSubscription | null> {
        try {
            if (!this.registration) {
                throw new Error('Service worker not registered');
            }

            // Get VAPID public key from server
            const vapidResponse = await notificationService.getVapidPublicKey();
            if (!vapidResponse.success || !vapidResponse.data) {
                throw new Error('Failed to get VAPID public key');
            }

            const vapidPublicKey = vapidResponse.data;

            // Subscribe to push notifications
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as BufferSource
            });

            // Register subscription with server
            await notificationService.registerDeviceToken(subscription);

            console.log('Push subscription successful');
            return subscription;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return null;
        }
    }

    async unsubscribe(): Promise<boolean> {
        try {
            if (!this.registration) {
                return false;
            }

            const subscription = await this.registration.pushManager.getSubscription();
            if (!subscription) {
                return true;
            }

            // Unregister from server
            await notificationService.unregisterDeviceToken(subscription);

            // Unsubscribe locally
            await subscription.unsubscribe();

            console.log('Push unsubscription successful');
            return true;
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
            return false;
        }
    }

    async getSubscription(): Promise<PushSubscription | null> {
        if (!this.registration) {
            return null;
        }

        return await this.registration.pushManager.getSubscription();
    }

    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async showLocalNotification(title: string, options?: NotificationOptions): Promise<void> {
        const permission = await this.requestPermission();

        if (permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    }
}

export const pushNotificationManager = new PushNotificationManager();
