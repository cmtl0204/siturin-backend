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
import { ActivityEntity } from '@modules/core/entities/activity.entity';
import { ClassificationEntity } from '@modules/core/entities/classification.entity';
import { CategoryEntity } from '@modules/core/entities/category.entity';
import { DpaEntity } from '@modules/common/dpa/dpa.entity';
import { EstablishmentEntity } from '@modules/core/entities/establishment.entity';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

@Entity('processes', { schema: 'core' })
export class ProcessEntity {
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
  @ManyToOne(() => ActivityEntity, { nullable: true })
  @JoinColumn({ name: 'activity_id' })
  activity: ActivityEntity;
  @Column({
    type: 'uuid',
    name: 'activity_id',
    nullable: true,
    comment: '',
  })
  activityId: string;

  @ManyToOne(() => ClassificationEntity, { nullable: true })
  @JoinColumn({ name: 'classification_id' })
  classification: ClassificationEntity;
  @Column({
    type: 'uuid',
    name: 'classification_id',
    nullable: true,
    comment: '',
  })
  classificationId: string;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
  @Column({
    type: 'uuid',
    name: 'category_id',
    nullable: true,
    comment: '',
  })
  categoryId: string;

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

  @ManyToOne(() => EstablishmentEntity, { nullable: true })
  @JoinColumn({ name: 'establishment_id' })
  establishment: EstablishmentEntity;
  @Column({
    type: 'uuid',
    name: 'establishment_id',
    nullable: true,
    comment: '',
  })
  establishmentId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'legal_entity_id' })
  legalEntity: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'legal_entity_id',
    nullable: true,
    comment: '',
  })
  legalEntityId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'type_id',
    nullable: true,
    comment: '',
  })
  typeId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'cause_inactivation_type_id' })
  causeInactivationType: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'cause_inactivation_type_id',
    nullable: true,
    comment: '',
  })
  causeInactivationTypeId: string;

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
    name: 'registered_at',
    type: 'timestamp',
    comment: 'Fecha de la solicitud del registro',
  })
  registeredAt: Date;

  @Column({
    name: 'attended_at',
    type: 'timestamp',
    comment: 'Fecha de atencion de la solicitud del registro',
  })
  attendedAt: Date;

  @Column({
    name: 'establishment_number',
    type: 'varchar',
    comment: '',
  })
  establishmentNumber: string;

  @Column({
    name: 'web_page',
    type: 'varchar',
    comment: '',
  })
  webPage: string;

  @Column({
    name: 'has_tourist_activity_document',
    type: 'boolean',
    comment: '',
  })
  hasTouristActivityDocument: boolean;

  @Column({
    name: 'has_person_designation',
    type: 'boolean',
    comment: '',
  })
  hasPersonDesignation: boolean;

  @Column({
    name: 'has_protected_area',
    type: 'boolean',
    comment: '',
  })
  hasProtectedArea: boolean;

  @Column({
    name: 'has_protected_area_contract',
    type: 'boolean',
    comment: '',
  })
  hasProtectedAreaContract: boolean;

  @Column({
    name: 'inspection_expiration_at',
    type: 'timestamp',
    comment: '',
  })
  inspectionExpirationAt: Date;

  @Column({
    name: 'total_men',
    type: 'integer',
    comment: '',
  })
  totalMen: number;

  @Column({
    name: 'total_women',
    type: 'integer',
    comment: '',
  })
  totalWomen: number;

  @Column({
    name: 'total_men_disability',
    type: 'integer',
    comment: '',
  })
  totalMenDisability: number;

  @Column({
    name: 'total_women_disability',
    type: 'integer',
    comment: '',
  })
  totalWomenDisability: number;

  @Column({
    name: 'land_use',
    type: 'varchar',
    comment: '',
  })
  landUse: string;

  @Column({
    name: 'id_temp',
    type: 'bigint',
    comment: 'Codigo de la tabla migrada',
  })
  idTemp: number;
}
