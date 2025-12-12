import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
import { File } from '../../../services/database/common-entities/file.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  @Index()
  post: Post;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Comment, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  @Index()
  parent?: Comment;

  // Ltree path
  @Column({ type: 'varchar', length: 500 })
  @Index()
  path: string; // '1.2.3.4'

  @Column({ type: 'int', default: 0 })
  depth: number;

  @Column({ type: 'text' })
  content: string;

  @OneToOne(() => File, { nullable: true, eager: true })
  @JoinColumn({ name: 'file_id' })
  file?: File;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Soft delete
  @DeleteDateColumn()
  @Index()
  deleted_at?: Date;
}
