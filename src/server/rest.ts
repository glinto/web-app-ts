export interface RestObjectFactory<T> {
    readonly put?: (data: unknown) => Promise<void>;
    readonly get?: (id: string | number) => Promise<T>;
    readonly validate: (data: unknown) => data is T;
}

export interface RestObjectFactoryError {
    message: string;
    object: unknown;
}

export function getMethod<This, Args extends any[], Return>(_pattern: string | RegExp) {
    return function getDecorator(
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
    ) {
        const methodName = String(context.name);
        console.log('Registering GET method', methodName, 'for', target.constructor.name);
    }
}

export class LatLng {
    constructor(public readonly lat: number, public readonly lng: number) { }
}

export class LatLngFactory implements RestObjectFactory<LatLng> {

    @getMethod('/api/latlng/:id')
    get(_id: string | number): Promise<LatLng> {
        let obj: unknown = JSON.parse('{"lat": 0, "lng": 0}');
        if (this.validate(obj)) {
            Promise.resolve(obj);
        }
        return Promise.reject(<RestObjectFactoryError>{ message: 'Malformed object', object: obj });
    }

    validate(data: unknown): data is LatLng {
        return typeof data === 'object'
            && data !== null
            && 'lat' in data
            && typeof data.lat === 'number'
            && 'lng' in data
            && typeof data.lng === 'number';
    }
}