import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AzureB2cJwt extends AuthGuard('jwt') {
  private logger = new Logger(AzureB2cJwt.name);
  
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    super();
  }
  
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const jwt = req.headers.authorization.replace('Bearer', '').trim();
    const publicKey = await this.authService.getPublicKey();
    const payload = await this.authService.verifyJWT(jwt, publicKey);
    const isVerified = !!payload;
    
    this.logger.log('Access Token Verification = ' + isVerified);
    
    if(isVerified) {
      req.user = await this.userService.readOne(payload.sub, '');
    }
    
    return isVerified;
  }
  
}
