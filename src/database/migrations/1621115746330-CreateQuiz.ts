import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateQuiz1621115746330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "quiz",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true
          },
          {
            name: "group_id",
            type: "varchar"
          },
          {
            name: "status",
            type: "varchar"
          },
          {
            name: "answers",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()"
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("quiz");
  }
}
