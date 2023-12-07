

export class WakeLock {
    private sentinel: WakeLockSentinel | undefined = undefined;

    lock() {
        if (this.sentinel !== undefined) {
            return;
        }
        navigator.wakeLock.request('screen')
            .then((wakeLock) => {
                this.sentinel = wakeLock;
                this.sentinel.addEventListener('release', this.released);
            })
            .catch((err) => {
                console.error('Could not obtain wake lock', err);
            });
    }

    released = () => {
        this.sentinel?.removeEventListener('release', this.released);
        this.sentinel = undefined;

        if (document.visibilityState === "visible") {
            console.warn('Wake lock was released, reacquiring');
            this.lock();
        }
        else {
            console.error('Cannot reacquire wake lock, page not visible');
        }
    }

    release() {
        if (this.sentinel !== undefined) {
            this.sentinel.removeEventListener('release', this.released);
            this.sentinel.release();
            this.sentinel = undefined;
        }
    }
}
