export function notify(message: string) {
    if (window?.Notification === undefined) {
        console.warn("Notifications not supported");
    } else if (window.Notification.permission === "granted") {
        new window.Notification(message);
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission()
            .then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    new Notification(message);
                    // …
                }
            })
            .catch((err) => {
                console.warn('Notification permission', err);
            })
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
}