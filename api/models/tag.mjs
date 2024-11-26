import { Schema, model } from "mongoose";

const tagSchema = new Schema({
   name: {
      type: String,
      maxLength: [50, "Le `name` ne doit pas dépasser 50 caractères"],
      required: [true, "Le champ `name`est requis"]
   }
}, { timestamps: true });

export const Tag = model("Tag", tagSchema);