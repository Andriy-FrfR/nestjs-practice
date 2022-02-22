import { FollowEntity } from './../profile/follow.entity';
import { CommentEntity } from './comment.entity';
import { ArticleEntity } from './../article/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, ArticleEntity, FollowEntity]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
