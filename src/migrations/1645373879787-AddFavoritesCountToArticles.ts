import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavoritesCountToArticles1645373879787 implements MigrationInterface {
    name = 'AddFavoritesCountToArticles1645373879787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "favoritesCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "favoritesCount"`);
    }

}
