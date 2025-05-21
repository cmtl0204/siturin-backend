import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DpaEntity } from '@modules/common/dpa/dpa.entity';
import { RucEntity } from '@modules/core/entities/ruc.entity';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

@Entity('establishments', { schema: 'core' })
export class EstablishmentEntity {
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
  @ManyToOne(() => RucEntity, { nullable: true })
  @JoinColumn({ name: 'ruc_id' })
  ruc: RucEntity;
  @Column({
    type: 'uuid',
    name: 'ruc_id',
    nullable: true,
    comment: '',
  })
  rucId: string;

  @ManyToOne(() => DpaEntity, { nullable: true })
  @JoinColumn({ name: 'province_id' })
  province: DpaEntity;
  @Column({
    type: 'uuid',
    name: 'province_id',
    nullable: true,
    comment: '',
  })
  provinceId: string;

  @ManyToOne(() => DpaEntity, { nullable: true })
  @JoinColumn({ name: 'canton_id' })
  canton: DpaEntity;
  @Column({
    type: 'uuid',
    name: 'canton_id',
    nullable: true,
    comment: '',
  })
  cantonId: string;

  @ManyToOne(() => DpaEntity, { nullable: true })
  @JoinColumn({ name: 'parish_id' })
  parish: DpaEntity;
  @Column({
    type: 'uuid',
    name: 'parish_id',
    nullable: true,
    comment: '',
  })
  parishId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'state_id' })
  state: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'state_id',
    nullable: true,
    comment: '',
  })
  stateId: string;
  /** Columns **/
  @Column({
    name: 'number',
    type: 'varchar',
    comment: '',
  })
  number: string;

  @Column({
    name: 'trade_name',
    type: 'varchar',
    comment: '',
  })
  tradeName: string;

  @Column({
    name: 'web_page',
    type: 'varchar',
    comment: '',
  })
  webPage: string;

  @Column({
    name: 'id_temp',
    type: 'bigint',
    comment: 'Codigo de la tabla migrada',
  })
  idTemp: number;
}
