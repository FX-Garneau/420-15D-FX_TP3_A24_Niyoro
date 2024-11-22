import { Schema, model } from "mongoose";

const tagSchema = new Schema({

}, { timestamps: true });


export default model("Tag", tagSchema);
