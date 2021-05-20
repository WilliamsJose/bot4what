import { EntityRepository, Repository } from "typeorm";
import { Votes } from "../models/Votes";

@EntityRepository(Votes)
class VotesRepository extends Repository<Votes> {

}

export { VotesRepository };