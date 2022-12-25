import { Category } from './category.interface';
import { Bookmark } from './bookmark.interface';

export interface SpaceItem {
	category: Category,
	bookmarks: Bookmark[];
}