export interface Storage<T> {
    /**
     * Retrieve a value from the store
     * @param key The key which identifies the value in the store
     */
    get(key: string): T | undefined;

    /**
     * Write a value to the store
     * @param key The unique key which will identify the value in the store
     * @param value The value to be written
     */
    set(key: string, value: T): void;

    /**
     * Returns a promise which will resolve if the store has been loaded and is ready to be used
     */
    ready(): Promise<void>;
}

export class LocalStorageMap<T> implements Storage<T> {
    private map: Map<string, T>;

    constructor(private readonly key: string) {
        this.map = new Map();
        this.load();
    }

    protected load() {
        const str = localStorage.getItem(this.key);
        if (str !== null) {
            try {
                const obj = JSON.parse(str);
                Object.entries<T>(obj).forEach(([key, value]) => {
                    this.map.set(key, value);
                });
            }
            catch (e: any) {
                // could not load json object, do nothing
            }
        }
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    get(key: string): T | undefined {
        return this.map.get(key);
    }

    set(key: string, value: T): void {
        this.map.set(key, value);
        this.persist();
    }

    delete(key: string) {
        this.map.delete(key);
        this.persist();
    }

    protected persist() {
        const obj: {[index: string]: T} = {};
        Array.from(this.map.entries()).forEach(([key, value]) => {
            obj[key] = value;
        });
        const str = JSON.stringify(obj);
        localStorage.setItem(this.key, str);
    }
}