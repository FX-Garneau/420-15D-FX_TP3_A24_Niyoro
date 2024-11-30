import { Schema, model } from "mongoose";
import { HATEOAS } from "../hateoas.mjs";

const tagSchema = new Schema({
   name: {
      type: String,
      unique: true,
      maxLength: [50, "Le `name` ne doit pas dépasser 50 caractères"],
      required: [true, "Le champ `name`est requis"]
   }
}, { timestamps: true });

tagSchema.methods.toJSON = function () {
   return HATEOAS(this.toObject())
      .addLink(["self", "GET", `/tags/${this._id}`])
      .addLink(["update", "PUT", `/tags/${this._id}`])
      .addLink(["delete", "DELETE", `/tags/${this._id}`]);
}

export const Tag = model("Tag", tagSchema);