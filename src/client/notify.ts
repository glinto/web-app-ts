export interface NotificationBehavior {
    notify(message: string): Promise<void>
}

export class NotificationWrapper implements NotificationBehavior {
    constructor(private readonly registration: ServiceWorkerRegistration) {
        if (registration.constructor.name !== 'ServiceWorkerRegistration') {
            throw new Error('Invalid argument, must be ServieWorkerRegistration class');
        }
    }

    notify(message: string): Promise<void> {
        if (!("Notification" in window)) {
            return Promise.reject("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            return this.registration.showNotification(message);
        } else if (Notification.permission !== "denied") {
            // We need to ask the user for permission
            return Notification.requestPermission()
                .then((permission) => {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        return this.registration.showNotification(message);
                    }
                    return Promise.reject('Notification permission denied');
                });
        }
        return Promise.reject('Notification permission denied');
    }
}