import { AuthGuard } from './../user/guards/auth.guard';
import { ProfileService } from './profile.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { User } from '@app/user/decorators/user.decorator';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @Param('username') profileUsername: string,
    @User('id') currentUserId: number | null,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      profileUsername,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followUser(
    @Param('username') profileUsername: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followUser(
      profileUsername,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowUser(
    @Param('username') profileUsername: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.unfollowUser(
      profileUsername,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
