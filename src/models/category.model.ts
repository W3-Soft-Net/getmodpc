import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  @Index({ unique: true })
  slug: string;

  @Column({ nullable: true, type: "text" })
  description: string | null;

  @Column({ nullable: true, type: "text" })
  category_icon: string | null;

  @Column({ nullable: true, type: "text" })
  category_bg_color: string | null;

  @Column({ nullable: true, type: "text" })
  category_icon_bg_color: string | null;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "parent_cat_id" })
  parent: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
