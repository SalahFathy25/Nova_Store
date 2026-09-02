export declare class CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    image_url?: string;
    display_order?: number;
    parent_id?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    slug?: string;
    description?: string;
    image_url?: string;
    display_order?: number;
    is_active?: boolean;
    parent_id?: string;
}
