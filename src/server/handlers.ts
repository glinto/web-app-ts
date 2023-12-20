import { IncomingMessage, ServerResponse } from "http";
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export interface URLHandler {
	handle(url: URL, res: ServerResponse<IncomingMessage>, req?: IncomingMessage): boolean;
}

export class StaticURLHandler implements URLHandler {

	readonly mimeMappings: { [key: string]: string } = {
		'.svg': 'image/svg+xml',
		'.js': 'text/javascript',
		'.css': 'text/css',
		'.html': 'text/html',
		'.json': 'application/json',
		'.txt': 'text/plain'
	}

	constructor(private readonly rootPath: string, private readonly mapTo?: string) { }

	handle(url: URL, res: ServerResponse<IncomingMessage>): boolean {
		let filePath = url.pathname === '/' ? '/index.html' : url.pathname;


		if (this.mapTo !== undefined) {
			// Check if filePath begins with mapTo
			if (filePath.startsWith(this.mapTo)) {
				//remove mapTo from the filePath start
				filePath = filePath.slice(this.mapTo.length);
			}
			else {
				return false;
			}
		}

		const staticPath = path.join(this.rootPath, filePath);

		if (existsSync(staticPath)) {
			res.statusCode = 200;

			readFile(staticPath).then((data) => {
				// Send content type header if file extension is in the known MIME mappings
				Object.keys(this.mimeMappings).some(key => {
					if (url.pathname.match(new RegExp(`.*\.${key}$`))) {
						res.setHeader('Content-Type', this.mimeMappings[key] as string);
						return true;
					}
					return false;
				});
				res.end(data);
			});
			return true;
		}
		else {
			return false;
		}
	}
}

export class NotFoundHandler implements URLHandler {
	handle(_url: URL, res: ServerResponse<IncomingMessage>): boolean {
		res.statusCode = 404;
		res.end();
		return true;
	}
}