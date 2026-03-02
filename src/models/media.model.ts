import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("media")
export class Media {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  file_name: string;

  @Column()
  file_type: string;

  @Column()
  file_size: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  alt_text?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
