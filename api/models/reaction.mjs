import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
   type: {
      type: String,
      enum: ["J'aime", "Informatif", "Drôle", "Inapproprié"],
      required: true
   },
   user_id: {
      type: Schema.Types.ObjectId, ref: "User",
      required: true
   },
   item_id: {
      type: Schema.Types.ObjectId, ref: "Item",
      required: true
   }
}, { timestamps: true });


export const Reaction = model("Reaction", reactionSchema);