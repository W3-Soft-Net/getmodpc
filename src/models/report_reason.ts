import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";

@Entity("report_reasons")
export class ReportReason {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  @Index({ unique: true })
  title: string;

  @Column({
    type: "boolean",
    default: true,
  })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
