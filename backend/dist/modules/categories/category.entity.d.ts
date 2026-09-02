import { Store } from '../stores/store.entity.js';
export declare class Category {
    id: string;
    tenant_id: string;
    store: Store;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    parent_id: string;
    parent: Category;
    display_order: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: Date;
}
