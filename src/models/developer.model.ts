import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("developers")
export class Developer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  @Index({ unique: true })
  slug: string;

  @Column({ nullable: true, type: "text" })
  description: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
