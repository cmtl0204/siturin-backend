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
import { ProvinceEntity } from '@modules/common/ubication/province.entity';

@Entity('cantons', { schema: 'common' })
export class CantonEntity {
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

  @ManyToOne(() => ProvinceEntity)
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;
  @Column({
    type: 'integer',
    name: 'province_id',
    nullable: true,
    comment: 'Province',
  })
  provinceId: number;

  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'nombre canton',
  })
  name: string;

  @Column({
    name: 'province_code',
    type: 'int',
    comment: 'codigo de la provincia',
  })
  provinceCode: number;

  @Column({
    name: 'canton_code',
    type: 'int',
    comment: 'codigo del canton',
  })
  cantonCode: number;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true=activo, false=inactivo',
  })
  enabled: boolean;
}
