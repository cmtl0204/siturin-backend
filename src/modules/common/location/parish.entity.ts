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
import { CantonEntity } from '@modules/common/location/canton.entity';

@Entity('parishes', { schema: 'common' })
export class ParishEntity {
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

  @ManyToOne(() => CantonEntity)
  @JoinColumn({ name: 'canton_id' })
  province: CantonEntity;
  @Column({
    type: 'integer',
    name: 'canton_id',
    nullable: true,
    comment: 'Canton',
  })
  cantonId: number;

  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'nombre parroquia',
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
    name: 'parish_code',
    type: 'int',
    comment: 'codigo de la parroquia',
  })
  parishCode: number;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true=activo, false=inactivo',
  })
  enabled: boolean;
}
