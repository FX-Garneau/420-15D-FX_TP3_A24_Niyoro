import { Schema, model } from "mongoose";

const reactionSchema = new Schema({
  type: {
    type: String,
    enum: [1, 2, 3, 4],
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId, ref: "User",
    required: true
  },
  item_id: {
    type: Schema.Types.ObjectId, ref: "Item",
    required: true
  },
}, { timestamps: true });


export default model("Reaction", reactionSchema);