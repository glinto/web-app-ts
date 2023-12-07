import { createServer } from 'http';
import { NotFoundHandler, StaticURLHandler, URLHandler } from './server/handlers';
import { Console } from './universal/app';
import { LatLngFactory } from './server/rest';
import path from 'path';

const PORT = 3081;
const console = new Console();

const llf = new LatLngFactory();

llf.constructor.name;

const handlers: URLHandler[] = [
	new StaticURLHandler(path.join(__dirname, '../static')),
	new StaticURLHandler(path.join(__dirname, '../dist/client')),
	new StaticURLHandler(path.join(__dirname, '../dist/universal')),
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