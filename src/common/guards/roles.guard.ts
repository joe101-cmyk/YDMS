import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RequestWithUser } from '../types/request-with-user';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    const request =
      (context.getType() as string) === 'graphql'
        ? GqlExecutionContext.create(context).getContext().req
        : context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}
