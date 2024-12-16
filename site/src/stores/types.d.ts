declare export interface Item {
   _id: string;
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
   createdAt: string;
   updatedAt: string;
   get isOwned(): boolean;
   update(): void;
   delete(): void;
}