import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  stored_filename: string;

  @Column({ type: 'varchar', length: 500 })
  path: string;

  @Column({ type: 'varchar', length: 100 })
  mimetype: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @CreateDateColumn()
  created_at: Date;
}
