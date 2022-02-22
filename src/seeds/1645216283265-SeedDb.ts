import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1645216283265 implements MigrationInterface {
  name = 'SeedDb1645216283265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );

    // password: 123
    await queryRunner.query(
      `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$mYcqBK1.1/X29Y1v9MbWdOu9BGj3GSuHcEuM/FGl4gJx.weqrsosS')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
      VALUES ('first-article', 'First article', 'First article description', 'first article body', 'coffee,dragons', 1)`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
      VALUES ('second-article', 'Second article', 'Second article description', 'second article body', 'coffee,dragons', 1)`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}
