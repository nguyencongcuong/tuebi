import { CanActivate, ExecutionContext, Injectable, Logger, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/role.decorator';
import { Role } from '../../enums/role.enum';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
	private logger = new Logger(RolesGuard.name);
	
	constructor(
		private reflector: Reflector,
		private userService: UsersService,
		private authService: AuthService
	) {}
	
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredRoles) {
			return true;
		}
		const req = context.switchToHttp().getRequest()
		const jwt =	req.headers.authorization;
		const decodedJwt = await this.authService.decodeJwt(jwt);
		const user = await this.userService.readOne(decodedJwt.sub, '');
		const isValidated = requiredRoles.some((role) =>
			user.user_roles.includes(role)
		);
		if (isValidated) {
			this.logger.log('User role is validated');
		} else {
			this.logger.error('User role is NOT validated');
		}
		return isValidated;
	}
}
