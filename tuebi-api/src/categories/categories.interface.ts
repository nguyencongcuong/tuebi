export interface Category {
	id?: string;
	partition_key: string;
	user_id: string;
	category_name: string;
	category_created_time: number;
	category_last_modified_time: number;
	category_order: number;
	category_theme: string;
}

export interface CreateCategory {
	category_name: string;
}

export interface CreateCategoryQueryI extends CreateCategory {
	user_id: string;
	category_created_time: string;
	category_last_modified_time: string;
	category_order: number;
	category_theme: string;
}

export interface UpdateCategoryRequestBodyI {
	id?: string;
	partition_key: string;
	category_name?: string;
	category_order?: number;
	category_theme?: string;
}

export interface UpdateCategoryQueryI extends UpdateCategoryRequestBodyI {
	category_created_time: string;
	category_last_modified_time: string;
}

export interface DeleteCategoriesRequestBodyI {
	categories: string[]
}
