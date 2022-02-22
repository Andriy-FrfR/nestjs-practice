import { TagEntity } from './tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from '@app/tag/tag.service';
import { Module } from '@nestjs/common';
import { TagController } from '@app/tag/tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
