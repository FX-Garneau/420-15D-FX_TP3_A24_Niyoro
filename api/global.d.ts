import * as jwt from 'jsonwebtoken';
import { HydratedDocumentFromSchema } from 'mongoose';
import { User } from './models/user.mjs';

declare global {
   declare namespace Express {
      interface Request {
         session?: jwt.JwtPayload & { userId?: string };
         user?: HydratedDocumentFromSchema<typeof User.schema> | null;
      }
   }
}