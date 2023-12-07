export class Console {
    log(...args: any[]) {
        if (isBrowser()) {
            console.log(`[${new Date().toISOString()}]`, ...args);
        }
        else {
            console.log(`\x1b[36m[${new Date().toISOString()}]\x1b[0m`, ...args);
        }
    }
}

function isBrowser() {
    return typeof window !== 'undefined';
}