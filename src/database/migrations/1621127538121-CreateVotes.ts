import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateVotes1621127538121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "votes",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "quiz_id",
                        type: "uuid"
                    },
                    {
                        name: "value",
                        type: "string"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
                foreignKeys: [
                    {
                        name: "FKQuiz",
                        referencedTableName: "quiz",
                        referencedColumnNames: ["id"],
                        columnNames: ["quiz_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("votes");
    }

}
