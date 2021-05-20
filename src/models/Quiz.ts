import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("quiz")
@Unique(["name"])
export class Quiz {
  @PrimaryColumn()
  readonly id: string;

  @Column({name: "name"})
  name: string;

  @Column()
  answers: string;

  @Column()
  group_id: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
