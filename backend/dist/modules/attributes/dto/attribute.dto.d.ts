export declare class CreateAttributeDto {
    name: string;
    type: string;
    is_filterable?: boolean;
    is_variant?: boolean;
    display_order?: number;
}
export declare class UpdateAttributeDto {
    name?: string;
    type?: string;
    is_filterable?: boolean;
    is_variant?: boolean;
    display_order?: number;
}
export declare class CreateAttributeValueDto {
    value: string;
    color_code?: string;
    display_order?: number;
}
