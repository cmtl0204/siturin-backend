import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProcessEntity } from '@modules/core/entities/process.entity';

@Entity('process_address', { schema: 'core' })
export class ProcessAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestampP',
    comment: 'Fecha de creacion del registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestampP',
    comment: 'Fecha de actualizacion de la ultima actualizacion del registro',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de eliminacion del registro',
  })
  deletedAt: Date;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  enabled: boolean;

  /** Inverse Relationship **/

  /** Foreign Keys **/
  @ManyToOne(() => ProcessEntity, { nullable: true })
  @JoinColumn({ name: 'process_id' })
  process: ProcessEntity;
  @Column({
    type: 'uuid',
    name: 'process_id',
    nullable: true,
    comment: 'Actividad',
  })
  processId: string;

  /** Columns **/
  @Column({
    name: 'main_street',
    type: 'text',
    comment: 'Codigo',
  })
  mainStreet: string;

  @Column({
    name: 'number_street',
    type: 'text',
    comment: '',
  })
  numberStreet: string;

  @Column({
    name: 'secondary_street',
    type: 'text',
    comment: 'Nombre',
  })
  secondaryStreet: string;

  @Column({
    name: 'reference_street',
    type: 'text',
    comment: '',
  })
  referenceStreet: string;

  @Column({
    name: 'latitude',
    type: 'float',
    comment: '',
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'float',
    comment: '',
  })
  longitude: number;
}
