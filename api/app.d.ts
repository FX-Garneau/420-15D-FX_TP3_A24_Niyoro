import * as jwt from 'jsonwebtoken';
import { HydratedDocumentFromSchema } from 'mongoose';
import { User } from './models/user.mjs';
import type { Item } from './models/item.mjs';
import type { Reaction } from './models/reaction.mjs';
import type { Tag } from './models/tag.mjs';

declare global {
   declare namespace Express {
      interface Request {
         session?: jwt.JwtPayload & { userId?: string };
         user?: HydratedDocumentFromSchema<typeof User.schema> | null;
         resource?: HydratedDocumentFromSchema<(typeof User | typeof Item | typeof Reaction | typeof Tag)["schema"]> | null;
      }
   }
}