import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service'; // Adjust the path based on your project structure

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService, // Inject the user service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      // Verify the token and decode it
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Fetch the full user details using the decoded user ID
      const user = await this.userService.findById(decoded.id); // or findByEmail(decoded.email)

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Select only the necessary fields to attach to request.user
      request.user = {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role, // assuming you have a 'role' field in your user entity
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
