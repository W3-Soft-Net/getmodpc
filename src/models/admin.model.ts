import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";


@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  full_name: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: "timestamp" })
  last_login_at: Date | null;

  @Column({ type: "varchar", nullable: true, length: 6 })
  password_reset_otp: string | null;

  @Column({ type: "timestamp", nullable: true })
  password_reset_otp_expires: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT_ROUNDS || "10")
      );
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  async setPassword(newPassword: string) {
    this.password = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS || "10")
    );
  }
}
