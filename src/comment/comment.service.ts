import { FollowEntity } from './../profile/follow.entity';
import { CommentsResponseInterface } from './types/commentsResponse.interface';
import { CommentResponseInterface } from './types/commentResponse.interface';
import { ArticleEntity } from './../article/article.entity';
import { CommentEntity } from './comment.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, getRepository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    currentUser: UserEntity,
    slug: string,
  ): Promise<CommentEntity> {
    const article = await this.articleRepository.findOne({ slug });

    if (!article) {
      throw new HttpException(
        { errors: { slug: ['No article with this slug'] } },
        HttpStatus.NOT_FOUND,
      );
    }

    const comment = new CommentEntity();
    Object.assign(comment, createCommentDto);
    comment.author = currentUser;
    comment.article = article;
    return await this.commentRepository.save(comment);
  }

  async getComments(
    slug: string,
    currentUserId: number | null,
  ): Promise<CommentsResponseInterface> {
    const article = await this.articleRepository.findOne({ slug });

    if (!article) {
      throw new HttpException(
        { errors: { slug: ['No article with this slug'] } },
        HttpStatus.NOT_FOUND,
      );
    }

    const queryBuilder = getRepository(CommentEntity)
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.author', 'author')
      .where('comments.articleId = :id', { id: article.id });

    const comments = await queryBuilder.getMany();

    const commentsResponse = await Promise.all(
      comments.map(async (comment: CommentEntity) => {
        delete comment.author.email;
        const follow = await this.followRepository.findOne({
          followerId: currentUserId,
          followingId: comment.author.id,
        });
        const commentAuthorProfile = {
          ...comment.author,
          following: Boolean(follow),
        };
        return {
          ...comment,
          author: commentAuthorProfile,
        };
      }),
    );

    return {
      comments: commentsResponse,
    };
  }

  async deleteComment(
    currentUserId: number,
    commentId: number,
  ): Promise<DeleteResult> {
    const commentToDelete = await this.commentRepository.findOne(commentId, {
      relations: ['author'],
    });

    if (!commentToDelete) {
      throw new HttpException(
        { errors: { comment: ['does not exist'] } },
        HttpStatus.NOT_FOUND,
      );
    }

    if (commentToDelete.author.id !== currentUserId) {
      throw new HttpException(
        { errors: { author: ['You can not delete this comment'] } },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.commentRepository.delete(commentToDelete.id);
  }

  buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
    delete comment.article;
    delete comment.author.email;
    const commentAuthorProfile = { ...comment.author, following: false };
    return {
      comment: {
        ...comment,
        author: commentAuthorProfile,
      },
    };
  }
}
