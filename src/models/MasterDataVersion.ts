import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { MasterDataType } from './MasterDataType';
import { MasterDataRecord } from './MasterDataRecord';

@Entity('master_data_versions')
export class MasterDataVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  version: number;

  @Column('simple-array', { nullable: true })
  tagList: string[];

  @Column('simple-array', { nullable: true })
  fields: string[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => MasterDataType, type => type.versions)
  masterDataType: MasterDataType;

  @OneToMany(() => MasterDataRecord, record => record.version)
  records: MasterDataRecord[];
}