import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('provinces', { schema: 'common' })
export class ProvinceEntity {
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
    name: 'name',
    type: 'varchar',
    comment: 'nombre provincia',
  })
  name: string;

  @Column({
    name: 'province_code',
    type: 'int',
    comment: 'codigo de la provincia',
  })
  provinceCode: number;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true=activo, false=inactivo',
  })
  enabled: boolean;
}
