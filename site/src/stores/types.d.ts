interface MongoDBObject {
   _id: string;
   createdAt: string;
   updatedAt: string;
}

declare export interface Item extends MongoDBObject {
   title: string;
   url?: string;
   content?: string;
   latitude?: number;
   longitude?: number;
   private: boolean;
   sticky: boolean;
   permalink?: string;
   tags: string[];
   created_by: string | object;
   // Self
   get isOwned(): boolean;
   update(): Promise<void>;
   delete(): Promise<void>;
   // Reactions
   reactions: Reaction[];
   get userReaction(): Reaction | undefined;
   syncReactions(): Promise<void>;
   react(type: Reaction["type"]): Promise<void>;
   unreact(): Promise<void>;
   // Tags
   syncUncachedTags(): Promise<void>;
}

declare export interface Reaction extends MongoDBObject {
   type: 1 | 2 | 3 | 4;
   user_id: string;
   item_id: string;
}

declare export interface Tag extends MongoDBObject {
   name: string;
   update(): Promise<void>;
   delete(): Promise<void>;
}