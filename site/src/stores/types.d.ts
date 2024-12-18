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
   update(): Promise<{ response: Response; json: any; }>;
   delete(): Promise<{ response: Response; json: any; }>;
   // Reactions
   reactions: Reaction[];
   get userReaction(): Reaction | undefined;
   syncReactions(): Promise<{ response: Response; json: any; }>;
   react(type: Reaction["type"]): Promise<{ response: Response; json: any; }>;
   unreact(): Promise<{ response: Response; json: any; } | undefined>;
   // Tags
   syncUncachedTags(): Promise<{ response: Response; json: any; } | undefined>;
}

declare export interface Reaction extends MongoDBObject {
   type: 1 | 2 | 3 | 4;
   user_id: string;
   item_id: string;
}

declare export interface Tag extends MongoDBObject {
   name: string;
   update(): Promise<{ response: Response; json: any; }>;
   delete(): Promise<{ response: Response; json: any; }>;
}