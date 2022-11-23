const htmlparser2 = require('htmlparser2');

export async function bookmarkHtmlToJson(htmlString: string) {
	let result = [];
	let bookmark_name = '';
	let bookmark_url = '';
	let category_name = '';
	
	let currentOpeningTag = '';
	let isReadingCategory = false;
	let isReadingBookmark = false;
	
	const parser = new htmlparser2.Parser({
		onopentagname(name: string) {
			currentOpeningTag = name;
			if (name === 'h3') {
				isReadingCategory = true;
				isReadingBookmark = false;
			} else if (name === 'a') {
				isReadingCategory = false;
				isReadingBookmark = true;
			}
		},
		onattribute(name: string, value: string) {
			if (name === 'href' && currentOpeningTag === 'a') {
				bookmark_url = value;
			}
		},
		ontext(value: string) {
			if (isReadingCategory && currentOpeningTag === 'h3') {
				category_name = value;
			} else if (isReadingBookmark && currentOpeningTag === 'a') {
				bookmark_name = value;
			}
		},
		onclosetag(name: string) {
			if (name === 'h3') {
				currentOpeningTag = '';
			}
			
			if (name === 'a') {
				let item = {
					bookmark_name: '',
					bookmark_url: '',
					category_name: ''
				};
				
				item.bookmark_name = bookmark_name;
				item.bookmark_url = bookmark_url;
				item.category_name = category_name;
				
				result.push(item);
			}
		}
	});
	
	parser.write(htmlString);
	parser.end();
	
	return result;
}