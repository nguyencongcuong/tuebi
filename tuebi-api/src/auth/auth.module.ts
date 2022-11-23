import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityService } from '../security/security.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/role.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	controllers: [AuthController],
	providers: [
		AuthService,
		UsersService,
		JwtStrategy,
		JwtService,
		Object,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		SecurityService,
	],
	imports: [UsersModule, PassportModule],
	exports: [AuthService],
})
export class AuthModule {}
