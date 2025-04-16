import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { MasterDataVersion } from './MasterDataVersion';

@Entity('master_data_types')
export class MasterDataType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => MasterDataVersion, version => version.masterDataType)
  versions: MasterDataVersion[];
}