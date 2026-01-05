import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  @Index()
  email?: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password_hash?: string;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_guest: boolean;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  @Index()
  session_token?: string;

  @Column({ type: 'timestamp', nullable: true })
  session_expires_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
