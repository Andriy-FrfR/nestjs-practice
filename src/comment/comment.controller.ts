import { CommentsResponseInterface } from './types/commentsResponse.interface';
import { DeleteResult } from 'typeorm';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { CommentService } from './comment.service';
import { UserEntity } from './../user/user.entity';
import { AuthGuard } from './../user/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { User } from '@app/user/decorators/user.decorator';

@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(
    @Param('slug') slug: string,
    @User('id') currentUserId: number | null,
  ): Promise<CommentsResponseInterface> {
    return this.commentService.getComments(slug, currentUserId);
  }

  @Post('')
  @UseGuards(AuthGuard)
  async createComment(
    @Body('comment') createCommentDto: CreateCommentDto,
    @User() currentUser: UserEntity,
    @Param('slug') slug: string,
  ): Promise<CommentResponseInterface> {
    const comment = await this.commentService.createComment(
      createCommentDto,
      currentUser,
      slug,
    );
    return this.commentService.buildCommentResponse(comment);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteComment(
    @User('id') currentUserId: number,
    @Param('id') commentId: number,
  ): Promise<DeleteResult> {
    return this.commentService.deleteComment(currentUserId, commentId);
  }
}
