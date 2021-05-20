import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import {v4 as uuid} from 'uuid';
import { Quiz } from "./Quiz";

@Entity("votes")
class Votes {
  
  @PrimaryColumn()
  readonly id: string;

  @Column({name: "user_id"})
  user_id: string;
  
  @Column()
  quiz_id: string;

  @ManyToOne(() => Quiz)
  @JoinColumn({name: "quiz_id"})
  quiz: Quiz
  
  @Column()
  value: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if(!this.id) {
      this.id = uuid();
    }
  }
}

export { Votes };