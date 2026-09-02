import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../stores/store.entity.js';

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'attribute_id' })
  attribute_id: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'color_code' })
  color_code: string;

  @Column({ type: 'int', default: 0, name: 'display_order' })
  display_order: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}
