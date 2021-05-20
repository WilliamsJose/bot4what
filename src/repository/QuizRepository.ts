import { EntityRepository, Repository } from "typeorm";
import { Quiz } from "../models/Quiz";

@EntityRepository(Quiz)
class QuizRepository extends Repository<Quiz> {

}

export { QuizRepository };