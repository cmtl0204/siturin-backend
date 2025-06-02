import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProcessEntity } from '@modules/core/entities/process.entity';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

@Entity('process_ctc', { schema: 'core' })
export class ProcessCtcEntity {
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
    comment: '',
  })
  processId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'local_type_id' })
  localType: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'local_type_id',
    nullable: true,
    comment: '',
  })
  localTypeId: string;

  /** Columns **/
  @Column({
    name: 'total_beds',
    type: 'integer',
    comment: '',
  })
  totalBeds: number;

  @Column({
    name: 'total_capacities',
    type: 'integer',
    comment: '',
  })
  totalCapacities: number;

  @Column({
    name: 'total_rooms',
    type: 'integer',
    comment: '',
  })
  totalRooms: number;

  @Column({
    name: 'total_tables',
    type: 'integer',
    comment: '',
  })
  totalTables: number;

  @Column({
    name: 'has_property_registration_certificate',
    type: 'boolean',
    comment: '',
  })
  hasPropertyRegistrationCertificate: boolean;

  @Column({
    name: 'has_technical_report',
    type: 'boolean',
    comment: '',
  })
  hasTechnicalReport: boolean;

  @Column({
    name: 'has_statute',
    type: 'boolean',
    comment: '',
  })
  hasStatute: boolean;

  @Column({
    name: 'id_temp',
    type: 'bigint',
    comment: 'Codigo de la tabla migrada',
  })
  idTemp: number;
}
