import { Stream } from 'stream';

export function streamToString(stream: Stream) {
	return new Promise((resolve) => {
		let str = '';
		
		stream.on('data', (chunk) => {
			str = str + chunk.toString();
		});
		stream.on('end', () => {
			resolve(str);
		});
	});
}