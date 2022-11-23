import { Bookmark } from 'src/app/interfaces/bookmark.interface';
import { Category } from 'src/app/modules/categories/categories.model';

export interface SpaceItem {
	category: Category,
	bookmarks: Bookmark[];
}