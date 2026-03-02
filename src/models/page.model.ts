import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PageType } from "../types";

@Entity("pages")
export class Page {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, type: "varchar" })
  @Index({ unique: true })
  page_name: string;

  @Column({ unique: true, type: "varchar" })
  @Index({ unique: true })
  slug: string;

  @Column({ type: "varchar", nullable: true })
  external_link: string | null;

  @Column({ type: "enum", default: PageType.INTERNAL, enum: PageType })
  page_type: PageType;

  @Column({ default: false })
  is_open_new_tab: boolean;

  @Column()
  content: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: "timestamp", nullable: true })
  last_edited_at: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
