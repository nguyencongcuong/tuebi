export interface Bookmark {
	id: string;
	user_id: string;
	category_id: string;
	bookmark_tags: string[];
	bookmark_name: string;
	bookmark_url: string;
	bookmark_description: string;
	bookmark_favicon: string;
	bookmark_deleted: boolean;
	bookmark_created_time: string;
	bookmark_last_modified_time: string;
	bookmark_order: number;
	is_selected?: boolean
}