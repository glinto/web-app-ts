import { createServer } from 'http';
import { NotFoundHandler, StaticURLHandler, URLHandler } from './server/handlers.js';
import { Console } from './universal/app.js';
import { LatLngFactory } from './server/rest.js';


const PORT = 3081;
const console = new Console();

const llf = new LatLngFactory();
llf.constructor.name;

const handlers: URLHandler[] = [
	new StaticURLHandler(dirname('../static')),
	new StaticURLHandler(dirname('../dist/client'), '/js/client'),
	new StaticURLHandler(dirname('../dist/universal'), '/js/universal'),
	new NotFoundHandler()
];

// Create the server
const server = createServer((req, res) => {
	const url = new URL(req.url || '/', `http://${req.headers.host}`);
	console.log('Request', url.href);
	handlers.some((handler) => handler.handle(url, res));
});

// Start the server
server.listen(PORT, () => {
	console.log(`Server listening on :${PORT}`);
});

function dirname(path: string): string {
	return new URL(path, import.meta.url).pathname;
}