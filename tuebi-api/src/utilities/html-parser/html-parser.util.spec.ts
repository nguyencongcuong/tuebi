import * as fs from 'fs';
import { bookmarkHtmlToJson } from './html-parser.util';

const path = require('path');

describe('Html Parser', () => {
	describe('bookmarkHtmlToJson', () => {
		it('should parse a html to expected json content', async () => {
			// Arrange
			const root = path.resolve('');
			const filePath = `${root}/src/utilities/html-parser/bookmarks.html`;
			const html = fs.readFileSync(filePath);
			const htmlString = html.toString();
			const expectedResult = [
				{
					'bookmark_name': 'Bookmark 1',
					'bookmark_url': 'https://google.com/1'
				},
				{
					'bookmark_name': 'Bookmark 2',
					'bookmark_url': 'https://google.com/2'
				},
				{
					'bookmark_name': 'Bookmark 3',
					'bookmark_url': 'https://google.com/3'
				},
				{
					'bookmark_name': 'Bookmark 4',
					'bookmark_url': 'https://google.com/4'
				},
				{
					'bookmark_name': 'Bookmark 5',
					'bookmark_url': 'https://google.com/5'
				}
			];
			
			// Act
			const result = await bookmarkHtmlToJson(htmlString);
			
			// Assert
			expect(result).toEqual(expectedResult);
		});
	});
	
});
