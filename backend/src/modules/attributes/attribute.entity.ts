import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenant_id: string;

  @ManyToOne(() => Store, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  store: Store;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['text', 'number', 'color', 'select', 'multi_select'],
  })
  type: string;

  @Column({ type: 'boolean', default: false, name: 'is_filterable' })
  is_filterable: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_variant' })
  is_variant: boolean;

  @Column({ type: 'int', default: 0, name: 'display_order' })
  display_order: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
