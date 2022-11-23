import * as fs from 'fs';
import { streamToString } from './stream.util';

const path = require('path');

describe('Stream Util', () => {
	describe('streamToString', () => {
		it('should parse the html stream to correct html string', async () => {
			// Arrange
			const root = path.resolve('');
			const filePath = `${root}/src/utilities/html-parser/bookmarks.html`;
			const htmlStream = fs.createReadStream(filePath);
			const expectedResult = fs.readFileSync(filePath).toString();
			
			// Act
			const result = await streamToString(htmlStream);
			
			// Assert
			expect(result).toBeDefined();
			expect(result).toEqual(expectedResult);
		});
	});
});
