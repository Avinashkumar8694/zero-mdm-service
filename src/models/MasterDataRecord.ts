import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { MasterDataVersion } from './MasterDataVersion';

@Entity('master_data_records')
export class MasterDataRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  data: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => MasterDataVersion, version => version.records)
  version: MasterDataVersion;
}