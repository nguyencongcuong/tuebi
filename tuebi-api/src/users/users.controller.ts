import { Body, Controller, Delete, Get, Post, Put, Request, UseGuards, } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { transform } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { AzureB2cJwt } from '../auth/guards/azure-b2c-jwt';
import { PatchPayload } from '../azure/az-db.service';
import { azAppSettings } from '../azure/azure-application-settings';
import { EmailsService } from '../emails/emails.service';
import { SecurityService } from '../security/security.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { sendError, sendSuccess } from '../utilities';
import { CreateUserRequestBodyI, UpdateUserRequestBodyI, User, } from './users.interface';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  TUEBI_EMAIL_NO_REPLY_NAME = azAppSettings.TUEBI_EMAIL_NO_REPLY_NAME;
  TUEBI_EMAIL_NO_REPLY_ADDRESS = azAppSettings.TUEBI_EMAIL_NO_REPLY_ADDRESS;
  private ENCRYPTED_FIELDS = ['user_name'];
  
  constructor(
    private userService: UsersService,
    private emailService: EmailsService,
    private authService: AuthService,
    private subscriptionService: SubscriptionsService,
    private securityService: SecurityService,
  ) {}
  
  @UseGuards(AzureB2cJwt)
  @Post('users')
  async createOne(@Request() req: any, @Body() user: CreateUserRequestBodyI) {
    try {
      if (!req.user) {
        // Start: Calculate the epoch time (milliseconds) when user will be auto deleted.
        const DEFAULT_USER_MONTH_TO_DELETE = 3;
        const epochTimeToDelete = await this.userService.calculateEpochTimeToDeleteUser(DEFAULT_USER_MONTH_TO_DELETE);
        const now = Math.floor(Date.now() / 1000);
        
        const ivBuffer = randomBytes(16);
        const ivString = ivBuffer.toString('hex');
        
        const payload: User = {
          id: user.user_object_id,
          user_emails: user.user_emails,
          partition_key: '',
          user_created_time: now,
          user_last_modified_time: now,
          user_last_active_time: now,
          user_deleted_at: epochTimeToDelete,
          user_roles: ['user'],
          user_subscription_id: '',
          user_name: '',
          user_avatar_url: '',
          user_settings: {
            is_compact_mode_on: false,
            is_favicon_shown: true,
            is_bookmark_url_shorten: false,
            is_bookmark_count_shown: true,
            is_bookmark_url_shown: true,
            user_month_to_delete: DEFAULT_USER_MONTH_TO_DELETE,
          },
          _iv: ivString,
        };
        
        const data = await this.userService.createOne(payload);
        
        return sendSuccess(data);
      }
      
      return sendError('User is already existed!');
    } catch (e) {
      return sendError(e);
    }
  }
  
  @UseGuards(AzureB2cJwt)
  @Get('users')
  async readOne(@Request() req: any) {
    const user = req.user;
    
    try {
      const decryptedUser = await this.securityService.decryptObject(
        user,
        user._iv,
        this.ENCRYPTED_FIELDS
      );
      
      if (decryptedUser) {
        delete decryptedUser['user_password'];
        delete decryptedUser['user_confirmation_code'];
        return sendSuccess(decryptedUser);
      } else {
        return sendError('User not found!');
      }
    } catch (e) {
      return sendError(e);
    }
  }
  
  @UseGuards(AzureB2cJwt)
  @Put('users')
  async updateOne(@Request() req: any, @Body() updateUserBody: UpdateUserRequestBodyI) {
    const user = req.user;
    
    try {
      // If there's user_updated_password, update user_password
      const updatedUser = {
        ...updateUserBody,
        user_last_modified_time: Math.floor(Date.now() / 1000),
      };
      
      // Checking if user update their month to delete & recalculate the auto delete epoch time
      if(updateUserBody.user_settings.user_month_to_delete) {
        const monthToDelete = updateUserBody.user_settings.user_month_to_delete;
        updatedUser['user_deleted_at'] = await this.userService.calculateEpochTimeToDeleteUser(monthToDelete);
      }
      
      // Update user
      const encrypted = await this.securityService.encryptObject(
        updatedUser,
        Buffer.from(user._iv, 'hex'),
        this.ENCRYPTED_FIELDS
      );
      
      const patchPayload: PatchPayload = {
        id: user.id,
        partition_key: user.partition_key,
        operations: transform(
          encrypted,
          (result, value, key) => {
            result.push({op: 'add', path: '/' + String(key), value: value});
          },
          []
        ),
      };
      const data = await this.userService.updateOne(patchPayload);
      
      const decrypted = await this.securityService.decryptObject(
        data,
        user._iv,
        this.ENCRYPTED_FIELDS
      );
      
      return sendSuccess(decrypted);
    } catch (e) {
      return sendError(e);
    }
  }
  
  @UseGuards(AzureB2cJwt)
  @Delete('users')
  async deleteOne(@Request() req: any) {
    const user = req.user;
    
    try {
      await this.userService.deleteAllUserData(user.id, '');
      return sendSuccess();
    } catch (e) {
      return sendError(e);
    }
  }
}
