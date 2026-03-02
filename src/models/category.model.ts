import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar", length: 100, unique: true })
  @Index({ unique: true })
  title: string;

  @Column({ nullable: true, type: "text" })
  description: string | null;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
