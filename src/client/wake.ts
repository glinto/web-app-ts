

export class WakeLock {
    private sentinel: WakeLockSentinel | undefined = undefined;

    lock(): Promise<WakeLockSentinel> {
        if (this.sentinel !== undefined) {
            return Promise.resolve(this.sentinel);
        }
        return navigator.wakeLock.request('screen')
            .then((wakeLock) => {
                this.sentinel = wakeLock;
                this.sentinel.addEventListener('release', this.released);
                return this.sentinel;
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

    release(): Promise<void> {
        if (this.sentinel !== undefined) {
            this.sentinel.removeEventListener('release', this.released);
            const sentinel = this.sentinel;

            return sentinel.release()
                .then(() => {
                    this.sentinel = undefined;
                });
        }
        return Promise.resolve();
    }
}
