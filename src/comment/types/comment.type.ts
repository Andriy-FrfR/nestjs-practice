import { ProfileType } from './../../profile/types/profile.type';
import { CommentEntity } from './../comment.entity';

export type CommentType = Omit<
  Omit<CommentEntity, 'author'> & {
    author: ProfileType;
  },
  'updateTimestamp'
>;
