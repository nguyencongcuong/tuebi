export interface Bookmark {
  id?: string;
  partition_key: string;
  user_id: string;
  category_id: string;
  bookmark_name: string;
  bookmark_url: string;
  bookmark_description: string;
  bookmark_favicon: string;
  bookmark_deleted: boolean;
  bookmark_created_time: number;
  bookmark_last_modified_time: number;
  bookmark_order: number;
  bookmark_tags: string[]
}

export interface CreateBookmarkRequestBodyI {
  // req.body
  category_id: string;
  bookmark_name: string;
  bookmark_url: string;
  bookmark_description: string;
  bookmark_favicon: string;
}

export interface CreateBookmarkQueryI extends CreateBookmarkRequestBodyI {
  // Pass into query
  user_id: string;
  bookmark_created_time: number;
  bookmark_last_modified_time: number;
  bookmark_deleted: boolean;
  bookmark_order: number;
}

export interface UpdateBookmarkRequestBodyI {
  category_id: string;
  bookmark_name: string;
  bookmark_url: string;
  bookmark_description: string;
  bookmark_favicon: string;
  bookmark_deleted: boolean;
  bookmark_order: number;
}

export interface UpdateBookmarkQueryI extends UpdateBookmarkRequestBodyI {
  id?: string;
  bookmark_last_modified_time: number;
}

export interface DeleteBookmarksRequestBodyI {
  bookmarks: string[];
}

export type UpdateBookmarksRequestBodyI = Bookmark[]