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
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

@Entity('process_food_drinks', { schema: 'core' })
export class ProcessFoodDrinkEntity {
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
  @JoinColumn({ name: 'establishment_type_id' })
  establishmentType: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'establishment_type_id',
    nullable: true,
    comment: '',
  })
  establishmentTypeId: string;

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
    name: 'establishment_name',
    type: 'varchar',
    comment: '',
  })
  establishmentName: string;

  @Column({
    name: 'has_franchise_grant_certificate',
    type: 'boolean',
    comment: '',
  })
  hasFranchiseGrantCertificate: boolean;

  @Column({
    name: 'score',
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: '',
  })
  score: string;

  @Column({
    name: 'total_tables',
    type: 'integer',
    comment: '',
  })
  totalTables: number;

  @Column({
    name: 'total_capacities',
    type: 'integer',
    comment: '',
  })
  totalCapacities: number;

  @Column({
    name: 'id_temp',
    type: 'bigint',
    comment: 'Codigo de la tabla migrada',
  })
  idTemp: number;
}
